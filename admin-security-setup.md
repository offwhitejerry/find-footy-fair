# Admin Security Setup

This project now includes a secure admin authentication system. Here's how to configure it:

## Environment Variables

Add these to your environment configuration:

```bash
# Show admin links in UI (default: false)
VITE_SHOW_ADMIN=true

# SHA256 hash of your admin passcode
VITE_ADMIN_PASSCODE_HASH=your_sha256_hash_here
```

## Generating the Passcode Hash

To generate the SHA256 hash for your passcode:

### Option 1: Using Online Tool
1. Go to any SHA256 hash generator (e.g., https://emn178.github.io/online-tools/sha256.html)
2. Enter your desired passcode
3. Copy the generated hash to `VITE_ADMIN_PASSCODE_HASH`

### Option 2: Using Node.js
```javascript
const crypto = require('crypto');
const passcode = 'your-secure-passcode';
const hash = crypto.createHash('sha256').update(passcode).digest('hex');
console.log(hash);
```

### Option 3: Using Browser Console
```javascript
async function generateHash(passcode) {
  const msgBuffer = new TextEncoder().encode(passcode);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Usage
generateHash('your-secure-passcode').then(console.log);
```

## Security Features

✅ **Environment-controlled access**: Admin links only show when `VITE_SHOW_ADMIN=true`
✅ **Passcode protection**: SHA256 hash verification for admin access
✅ **Browser-side hashing**: Passcode is hashed in browser before comparison
✅ **Persistent sessions**: Uses localStorage to maintain access until sign-out
✅ **SEO protection**: All admin pages have `noindex, nofollow` meta tags
✅ **Visual indicators**: Lock icon shows next to admin links and pages
✅ **Secure defaults**: Denies access if no hash is configured

## Usage Flow

1. **Default state**: No admin links visible, direct admin access denied
2. **With `VITE_SHOW_ADMIN=true`**: Admin links appear but require authentication
3. **Authentication**: Enter passcode → SHA256 hash → compare with env hash
4. **Authenticated state**: Full admin access until manual sign-out
5. **Sign out**: Clears localStorage and refreshes page

## Testing

- **No env vars**: No admin access anywhere
- **VITE_SHOW_ADMIN=true only**: Shows locked admin gate, denies access
- **Both vars set**: Full admin functionality with passcode protection
- **Browser refresh**: Maintains access via localStorage
- **Crawler protection**: All admin pages return noindex meta tags