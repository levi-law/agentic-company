# Authentication Testing Guide

## Issue: "Nothing happens when clicking Sign In"

### Debugging Steps

1. **Open Browser DevTools Console** (F12 or Cmd+Option+I)

2. **Click the "Sign In" button** in the modal

3. **Check Console for Logs**

You should see logs like:
```
[AuthModal] Submitting form, mode: login
[AuthModal] Attempting login with: <your-email-or-username>
[AuthContext] Login attempt for: <your-email-or-username>
[AuthContext] Login response status: 401 or 200
[AuthContext] Login response data: {...}
```

### Common Issues & Solutions

#### Issue 1: No Console Logs at All
**Problem**: Form not submitting
**Causes**:
- Empty fields (form validation preventing submit)
- Password less than 6 characters
- JavaScript error blocking execution

**Solution**: 
- Fill in all required fields
- Use password with 6+ characters
- Check console for JavaScript errors (red text)

#### Issue 2: "Invalid credentials" Error
**Problem**: User doesn't exist in database
**Solution**: **Register first, then login**

1. Click "Don't have an account? Sign up"
2. Fill in registration form:
   - Email: `test@example.com`
   - Username: `testuser`
   - Password: `password123` (6+ chars)
   - Name: `Test User` (optional)
3. Click "Create Account"
4. Should auto-login and close modal

#### Issue 3: Network Error
**Problem**: API route not responding
**Solution**:
- Check dev server is running: `npm run dev`
- Check terminal for errors
- Verify database is connected

#### Issue 4: Database Error
**Problem**: User table doesn't exist
**Solution**:
```bash
npx prisma db push
```

## Quick Test Flow

### Step 1: Register a New User
```
1. Click "Sign In" button (top right)
2. Click "Don't have an account? Sign up"
3. Fill in:
   - Email: test@example.com
   - Username: testuser
   - Password: password123
   - Name: Test User
4. Click "Create Account"
5. Should see success and modal closes
```

### Step 2: Verify Login Works
```
1. Refresh page
2. Click "Sign In" button again
3. Fill in:
   - Email or Username: testuser
   - Password: password123
4. Click "Sign In"
5. Should see success and modal closes
```

### Step 3: Verify User Menu
```
1. After login, check top-right corner
2. Should see user avatar/menu
3. Click it to see profile and logout options
```

## Console Log Examples

### Successful Registration:
```
[AuthModal] Submitting form, mode: register
[AuthModal] Attempting registration with: {email: "test@example.com", username: "testuser"}
[AuthContext] Registration attempt for: {email: "test@example.com", username: "testuser"}
[AuthContext] Registration response status: 201
[AuthContext] Registration response data: {success: true, user: {...}}
[AuthContext] User registered and set: {id: "...", email: "test@example.com", ...}
[AuthModal] Result: {success: true}
[AuthModal] Success! Closing modal
```

### Successful Login:
```
[AuthModal] Submitting form, mode: login
[AuthModal] Attempting login with: testuser
[AuthContext] Login attempt for: testuser
[AuthContext] Login response status: 200
[AuthContext] Login response data: {success: true, user: {...}}
[AuthContext] User set: {id: "...", email: "test@example.com", ...}
[AuthModal] Result: {success: true}
[AuthModal] Success! Closing modal
```

### Failed Login (No User):
```
[AuthModal] Submitting form, mode: login
[AuthModal] Attempting login with: nonexistent
[AuthContext] Login attempt for: nonexistent
[AuthContext] Login response status: 401
[AuthContext] Login response data: {error: "Invalid credentials"}
[AuthContext] Login failed: Invalid credentials
[AuthModal] Result: {success: false, error: "Invalid credentials"}
[AuthModal] Failed: Invalid credentials
```

## Troubleshooting Commands

### Check if database is accessible:
```bash
npx prisma studio
# Opens database GUI at http://localhost:5555
```

### Check if User table exists:
```bash
npx prisma db push
# Syncs schema with database
```

### View existing users:
```sql
-- In Prisma Studio or database client
SELECT id, email, username, name FROM "User";
```

### Create test user manually (if needed):
```bash
# In Prisma Studio:
# 1. Go to User table
# 2. Click "Add record"
# 3. Fill in fields (password must be bcrypt hashed)
# Note: Easier to use registration form!
```

## Expected Behavior

### ✅ Working Correctly:
- Form submits when clicking "Sign In" or "Create Account"
- Console shows detailed logs
- Error messages display in red box if credentials wrong
- Modal closes on successful login/registration
- User menu appears in top-right after login

### ❌ Not Working:
- No console logs when clicking button
- Modal doesn't close after successful login
- No error message shown
- JavaScript errors in console (red text)

## Next Steps

1. **Try Registration First**: Most likely you don't have any users yet
2. **Check Console Logs**: They will tell you exactly what's happening
3. **Share Console Output**: If still stuck, share the console logs

---

**TL;DR**: Try **registering** a new account first instead of logging in!
