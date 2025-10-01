# Testing the Session Persistence Fix

## Quick Verification Steps

### 1. Clear Previous State
```bash
# Open browser DevTools Console and run:
localStorage.clear()
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Monitor the Logs

#### Expected Behavior (CORRECT ✅)
```
[Session] Creating new session...
[Session] Created new session: <session-id> (anonymous)
prisma:query INSERT INTO "public"."Session" ... (ONCE)
```

Then on refresh:
```
[Session] Restored session from localStorage: <same-session-id>
# NO prisma:query INSERT - just a SELECT to validate
```

#### Previous Behavior (INCORRECT ❌)
```
prisma:query INSERT INTO "public"."Session" ... (EVERY REFRESH)
prisma:query INSERT INTO "public"."Session" ... (EVERY REFRESH)
prisma:query INSERT INTO "public"."Session" ... (EVERY REFRESH)
```

### 4. Test Multiple Refreshes

**Action**: Press `Cmd+R` (Mac) or `Ctrl+R` (Windows) 5 times rapidly

**Expected Result**: 
- First load: ONE session created
- Next 4 refreshes: SAME session restored from localStorage
- Total database INSERTs: **1**

**Previous Result**:
- Total database INSERTs: **5+** (sometimes 10+ due to double mounting)

### 5. Test Browser Console

Open DevTools Console and check:
```javascript
// Should show the current session ID
localStorage.getItem('currentSessionId')

// Should be the same across refreshes
```

### 6. Test Database

```bash
# Connect to your database and check session count
# Should see minimal growth, not explosive growth
```

## Advanced Testing

### Test React Strict Mode Handling

1. Ensure `next.config.ts` has Strict Mode enabled (default in Next.js)
2. Refresh page multiple times
3. Check logs for:
   - `[Session] Already initialized, skipping` ✅
   - `[Session] Initialization in progress, skipping` ✅
   - `[Session] Waiting for existing initialization...` ✅

### Test Authentication Flow

1. **Anonymous Session**:
   ```
   - Load page → creates anonymous session
   - Check: session has no userId
   ```

2. **Login**:
   ```
   - Login with credentials
   - Check: SAME session now linked to user
   - No new session created
   ```

3. **Logout**:
   ```
   - Logout
   - Session remains but userId cleared (optional behavior)
   ```

### Test Edge Cases

#### Test 1: Invalid Session in localStorage
```javascript
// In browser console:
localStorage.setItem('currentSessionId', 'invalid-session-id-12345')
// Refresh page
// Expected: Clears invalid ID, creates new session
```

#### Test 2: Inactive Session
```javascript
// Manually mark session as 'completed' in database
// Refresh page
// Expected: Clears old ID, creates new session
```

#### Test 3: Concurrent Tabs
```javascript
// Open same URL in 2 tabs simultaneously
// Expected: Both tabs share the same session (via localStorage)
```

## Success Criteria

✅ **PASS**: Only ONE database INSERT on first load  
✅ **PASS**: Session ID persists across refreshes  
✅ **PASS**: No duplicate sessions created  
✅ **PASS**: Fast page loads (localStorage restoration)  
✅ **PASS**: Proper error handling and fallbacks  
✅ **PASS**: Works with React Strict Mode  

❌ **FAIL**: Multiple INSERTs on single page load  
❌ **FAIL**: Different session ID after refresh  
❌ **FAIL**: Session proliferation in database  

## Monitoring Commands

### Watch Database Sessions (PostgreSQL)
```sql
-- Count total sessions
SELECT COUNT(*) FROM "Session";

-- Count sessions created in last minute
SELECT COUNT(*) FROM "Session" 
WHERE "createdAt" > NOW() - INTERVAL '1 minute';

-- Show recent sessions
SELECT id, "agentConfig", status, "createdAt", "userId"
FROM "Session"
ORDER BY "createdAt" DESC
LIMIT 10;
```

### Watch Application Logs
```bash
# In terminal running npm run dev
# Look for these patterns:

# GOOD (after first load):
grep "Restored session from localStorage"

# BAD (should be rare after fix):
grep "Creating new session"
grep "prisma:query INSERT INTO"
```

## Performance Comparison

### Before Fix
- **Page Load 1**: 1-2 sessions created
- **Page Load 2**: 1-2 MORE sessions created
- **Page Load 3**: 1-2 MORE sessions created
- **Total after 3 refreshes**: 3-6 sessions 📈

### After Fix
- **Page Load 1**: 1 session created
- **Page Load 2**: SAME session restored
- **Page Load 3**: SAME session restored
- **Total after 3 refreshes**: 1 session ✅

## Troubleshooting

### Issue: Still seeing duplicate sessions

**Check 1**: Clear browser cache and localStorage
```javascript
localStorage.clear()
sessionStorage.clear()
```

**Check 2**: Verify code changes applied
```bash
# Check if changes are in the running code
grep "Global promise tracker" src/app/hooks/useSessionPersistence.ts
```

**Check 3**: Hard refresh
```
Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
```

### Issue: Session not persisting

**Check 1**: localStorage enabled
```javascript
// In console
localStorage.setItem('test', '123')
localStorage.getItem('test') // Should return '123'
```

**Check 2**: Database connection
```bash
# Check if database is accessible
npm run db:studio
```

### Issue: Errors in console

**Check 1**: Database schema synced
```bash
npx prisma db push
```

**Check 2**: Environment variables set
```bash
# Check .env file has DATABASE_URL
cat .env | grep DATABASE_URL
```

## Cleanup After Testing

```bash
# Optional: Clean up test sessions from database
# Be careful in production!

# Connect to database and run:
DELETE FROM "Session" 
WHERE status = 'active' 
AND "createdAt" < NOW() - INTERVAL '1 hour';
```

## Next Steps

Once verified:
1. ✅ Commit the changes
2. ✅ Deploy to staging
3. ✅ Monitor production metrics
4. ✅ Document in team wiki
5. ✅ Add automated tests
