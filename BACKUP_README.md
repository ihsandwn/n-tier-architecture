# Database Backup Setup

## Overview
The database backup service automatically backs up the PostgreSQL database daily at **1:00 AM** UTC.

## How It Works

### Components
1. **Dockerfile.backup** - Docker image with PostgreSQL client and cron scheduler
2. **scripts/backup-db.sh** - Backup script that uses `pg_dump` to export the database
3. **db-backup service** - Docker Compose service that runs the backup scheduler

### Backup Schedule
- **Time**: 1:00 AM (UTC) every day
- **Location**: `/backups/` directory inside the container, mapped to `postgres_backups` volume
- **Retention**: Backups older than 7 days are automatically deleted
- **Format**: SQL format, compressed with gzip (`.sql.gz`)
- **Naming**: `db_backup_YYYYMMDD_HHMMSS.sql.gz`

## Using the Backup System

### Starting the Backup Service
The backup service starts automatically with the other services:

```bash
# For development
docker-compose -f docker-compose.dev.yml up -d

# For production
docker-compose -f docker-compose.prod.yml up -d
```

### Accessing Backups

#### View Backup Logs
```bash
# Check backup logs in real-time
docker logs -f omni_db_backup

# Or for production
docker logs -f <project>-db-backup-1
```

#### Access Backup Files
```bash
# List backups
docker exec omni_db_backup ls -lh /backups/

# Copy backup to host
docker cp omni_db_backup:/backups/db_backup_20250217_010000.sql.gz ./

# Or mount and access directly if using named volume
docker run -v postgres_backups:/backups alpine ls -lh /backups/
```

### Manual Backup

To create a backup manually:

```bash
# Run backup script inside the container
docker exec omni_db_backup /usr/local/bin/backup-db.sh
```

## Environment Variables

Configure backup behavior using environment variables in your `.env` file:

```env
# Database credentials
POSTGRES_USER=admin
POSTGRES_PASSWORD=admin123
POSTGRES_DB=omni_logistics

# Backup service will use these values automatically
```

## Backup Restoration

To restore a backup:

```bash
# Extract the compressed backup
gunzip db_backup_20250217_010000.sql.gz

# Restore the database
PGPASSWORD=your_password psql -h localhost -U postgres -d target_db < db_backup_20250217_010000.sql

# Or inside Docker container
docker exec -it omni_postgres psql -U postgres -d target_db -f /path/to/backup.sql
```

## Monitoring

### Check if Backup Service is Running
```bash
docker ps | grep db-backup
```

### View Backup Statistics
```bash
# Check total backups size
docker exec omni_db_backup du -sh /backups/

# Check individual backup sizes
docker exec omni_db_backup ls -lh /backups/
```

### Enable Verbose Cronjob Output
Edit `Dockerfile.backup` and change the log level:
```dockerfile
CMD ["crond", "-f", "-l", "0"]  # 0 = verbose
```

## Troubleshooting

### Backup Not Running
1. Check if the service is running: `docker ps | grep db-backup`
2. Check logs: `docker logs omni_db_backup`
3. Verify cron is active: `docker exec omni_db_backup ps aux | grep crond`

### Backup File Permission Issues
The backup script runs as root inside the container, so permission issues are rare. If they occur:
- Ensure the `/backups` volume has proper permissions
- Check Docker volume mount options

### Database Connection Issues
Verify environment variables are set correctly and the postgres service is running:
```bash
docker exec omni_db_backup psql -h postgres -U postgres -c "SELECT 1"
```

## Backup Policy Recommendations

- **Backup Retention**: Current policy keeps 7 days of backups
- **Off-site Storage**: For production, consider copying backups to S3 or another cloud storage
- **Testing**: Periodically test restoration to ensure backups are valid
- **Monitoring**: Set up alerts if a backup fails

## Production Considerations

For production deployments:

1. **External Storage**: Copy backups to S3, GCS, or another object storage
2. **Encryption**: Encrypt backups before storing off-site
3. **Separate Backup Service**: Consider using managed backup solutions like AWS RDS backups
4. **Alerting**: Set up notifications if backups fail
5. **Monitoring**: Track backup size and duration

Example S3 backup enhancement:
```bash
# In backup-db.sh, add at the end:
aws s3 cp "$COMPRESSED_FILE" s3://my-backup-bucket/backups/
```
