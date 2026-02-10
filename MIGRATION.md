# Database Migration Guide

This guide will help you migrate from the task management schema to the YouTube script writing schema.

## ⚠️ Important Notes

- **Backup your database** before running migrations
- The schema changes are significant and will require a new migration
- Existing data will need to be migrated manually or through a script

## Migration Steps

### 1. Generate New Migration

```bash
npx drizzle-kit generate
```

This will create a new migration file that:
- Renames `tasks` table to `scripts`
- Updates the status enum from `task_status` to `script_status`
- Adds new video-specific columns
- Creates the `script_type` enum

### 2. Review Migration File

Check the generated migration file in `migrations/` to ensure it looks correct.

### 3. Manual Data Migration (if needed)

If you have existing data, you may need to:

1. **Map old statuses to new statuses:**
   - `NEW` → `DRAFT`
   - `IN_PROGRESS` → `WRITING`
   - `COMPLETED` → `PUBLISHED`
   - `CANCELLED` → `ARCHIVED`

2. **Calculate word counts** for existing scripts (optional):
   ```sql
   UPDATE scripts 
   SET word_count = (
     SELECT array_length(string_to_array(regexp_replace(content, '<[^>]+>', '', 'g'), ' '), 1)
   )
   WHERE word_count IS NULL;
   ```

3. **Calculate estimated duration** (optional):
   ```sql
   UPDATE scripts 
   SET estimated_duration = CEIL(word_count / 150.0)
   WHERE estimated_duration IS NULL AND word_count IS NOT NULL;
   ```

### 4. Run Migration

**For Development:**
```bash
npx drizzle-kit push
```

**For Production:**
```bash
npx drizzle-kit migrate
```

### 5. Verify Migration

After migration, verify:
- ✅ `scripts` table exists (not `tasks`)
- ✅ New columns are present
- ✅ Status enum has new values
- ✅ Data is intact

## Schema Changes Summary

### Table Renamed
- `tasks` → `scripts`

### Status Enum Changed
**Old:** `NEW`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`  
**New:** `DRAFT`, `WRITING`, `REVIEW`, `READY_TO_FILM`, `FILMING`, `EDITING`, `READY_TO_PUBLISH`, `PUBLISHED`, `ARCHIVED`

### New Columns Added
- `script_type` (enum: TUTORIAL, REVIEW, VLOG, EDUCATIONAL, ENTERTAINMENT, OTHER)
- `video_title` (text)
- `description` (text)
- `tags` (text)
- `estimated_duration` (integer)
- `target_publish_date` (timestamp)
- `video_url` (text)
- `thumbnail_notes` (text)
- `word_count` (integer)

## Rollback (if needed)

If you need to rollback, restore from your backup. The migration is not easily reversible due to enum changes.

## Troubleshooting

### Issue: Migration fails with enum error
**Solution:** Drop and recreate the enum types:
```sql
DROP TYPE IF EXISTS task_status CASCADE;
-- Migration will create script_status
```

### Issue: Foreign key constraints
**Solution:** The migration should handle this, but if issues occur, temporarily disable constraints.

### Issue: Data loss
**Solution:** Restore from backup and review migration script before running.

---

**Note:** Always test migrations in a development environment first!
