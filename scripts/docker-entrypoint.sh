#!/bin/bash
set -e

echo "🔄 Waiting for PostgreSQL database on postgres:5432..."

max_attempts=30
attempt=0

while [ $attempt -lt $max_attempts ]; do
  if nc -z postgres 5432 2>/dev/null; then
    echo "✅ Database is ready!"
    break
  fi
  attempt=$((attempt + 1))
  echo "⏳ Waiting... (attempt $attempt/$max_attempts)"
  sleep 2
done

if [ $attempt -eq $max_attempts ]; then
  echo "❌ Database failed to start in time"
  exit 1
fi

echo "🔄 Generating Prisma Client..."
npx prisma generate || {
  echo "❌ Prisma generate failed"
  exit 1
}

echo "🔄 Running Prisma migrations..."
npx prisma migrate deploy || {
  echo "❌ Prisma migrate failed"
  exit 1
}

echo "✅ Migrations completed successfully"
echo "🚀 Starting NestJS application..."

exec "$@"
