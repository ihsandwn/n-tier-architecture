#!/bin/bash

# Database Backup Script
# Runs PostgreSQL backup daily

set -e

BACKUP_DIR="/backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/db_backup_$TIMESTAMP.sql"
POSTGRES_USER="${POSTGRES_USER:-postgres}"
POSTGRES_PASSWORD="${POSTGRES_PASSWORD:-12345}"
POSTGRES_DB="${POSTGRES_DB:-pwa}"
POSTGRES_HOST="${POSTGRES_HOST:-postgres}"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

echo "[$(date)] Starting database backup..."

# Create backup
PGPASSWORD="$POSTGRES_PASSWORD" pg_dump \
  -h "$POSTGRES_HOST" \
  -U "$POSTGRES_USER" \
  -d "$POSTGRES_DB" \
  --verbose \
  > "$BACKUP_FILE" 2>&1

# Compress backup
gzip "$BACKUP_FILE"
COMPRESSED_FILE="$BACKUP_FILE.gz"

echo "[$(date)] Backup created: $COMPRESSED_FILE ($(du -h $COMPRESSED_FILE | cut -f1))"

# Keep only last 7 days of backups (cleanup old files)
find "$BACKUP_DIR" -name "db_backup_*.sql.gz" -mtime +7 -delete
echo "[$(date)] Cleaned up backups older than 7 days"

echo "[$(date)] Backup completed successfully"
