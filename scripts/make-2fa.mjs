// Creates a secret for admin 2-step verification.
// Usage: npm run admin:2fa
import crypto from 'node:crypto';

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
const bytes = crypto.randomBytes(20);
let bits = '';
for (const b of bytes) bits += b.toString(2).padStart(8, '0');
let secret = '';
for (let i = 0; i < bits.length; i += 5) secret += alphabet[parseInt(bits.slice(i, i + 5).padEnd(5, '0'), 2)];

const label = encodeURIComponent('Signage Crafting:admin');
const uri = `otpauth://totp/${label}?secret=${secret}&issuer=${encodeURIComponent('Signage Crafting')}&algorithm=SHA1&digits=6&period=30`;

console.log(`
2-step verification secret created.

1. In your authenticator app (Google Authenticator, Microsoft Authenticator,
   Authy, 1Password...), choose "Add account" > "Enter a setup key" and type:

     ${secret.match(/.{1,4}/g).join(' ')}

   Account name: Signage Crafting admin   Type: Time based

   (Apps that accept a link can use: ${uri})

2. In Hostinger > your Node.js app > Environment variables, add:

     ADMIN_TOTP_SECRET = ${secret}

3. Save (the app redeploys). The admin login will now ask for the 6-digit code.

Keep this secret private. Anyone with it can generate your login codes.
`);
