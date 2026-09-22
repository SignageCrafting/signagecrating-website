// Prints a strong random admin password.
// Usage: npm run admin:password
import crypto from 'node:crypto';

const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
const pick = () => alphabet[crypto.randomInt(alphabet.length)];
const groups = Array.from({ length: 4 }, () => Array.from({ length: 5 }, pick).join(''));
const password = groups.join('-');

console.log(`
Strong admin password:

  ${password}

Add it in Hostinger > your Node.js app > Environment variables as:

  ADMIN_PASSWORD = ${password}

Store it in a password manager. Don't send it by email or chat.
`);
