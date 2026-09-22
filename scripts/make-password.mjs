// Prints a strong random admin password.
// Usage: npm run admin:password
import crypto from 'node:crypto';

const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
const pick = () => alphabet[crypto.randomInt(alphabet.length)];
const groups = Array.from({ length: 4 }, () => Array.from({ length: 5 }, pick).join(''));
const password = groups.join('-');

// The password is printed alone on its own line (no indent) so it copies cleanly.
console.log(`
Strong admin password (copy the next line exactly):

${password}

In Hostinger > your Node.js app > Environment variables, set:
  Name:  ADMIN_PASSWORD
  Value: the password above (no spaces or quotes)

Store it in a password manager. Don't send it by email or chat.
`);
