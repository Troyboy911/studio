// This script sets a custom user claim on a Firebase user to grant them admin privileges.
// To run this script:
// 1. Make sure you have 'firebase-admin' installed in your devDependencies (`npm install firebase-admin --save-dev`).
// 2. Download your service account key from your Firebase project settings and save it as 'service-account.json' in your project's root directory.
// 3. Run the script from your terminal: `node scripts/set-admin.js <user_email_to_make_admin>`

const admin = require('firebase-admin');
const path = require('path');

// --- IMPORTANT ---
// Path to your service account key JSON file.
const serviceAccountPath = path.resolve(__dirname, '../service-account.json');
try {
  const serviceAccount = require(serviceAccountPath);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
} catch (error) {
  console.error("\x1b[31m%s\x1b[0m", "Error: 'service-account.json' not found or invalid.");
  console.log("Please download your service account key from the Firebase Console and save it as 'service-account.json' in the root of your project.");
  process.exit(1);
}


const userEmail = process.argv[2];

if (!userEmail) {
  console.error("\x1b[31m%s\x1b[0m", 'Error: Please provide an email address as an argument.');
  console.log('Usage: node scripts/set-admin.js user@example.com');
  process.exit(1);
}

async function setAdminClaim(email) {
  try {
    console.log(`Fetching user with email: ${email}...`);
    const user = await admin.auth().getUserByEmail(email);
    
    console.log(`Found user: ${user.uid}. Setting custom claim { admin: true }...`);
    await admin.auth().setCustomUserClaims(user.uid, { admin: true });
    
    console.log("\x1b[32m%s\x1b[0m", `✅ Success! User ${email} (${user.uid}) has been made an admin.`);
    console.log('They will have admin privileges on their next sign-in or token refresh.');
  } catch (error) {
    console.error("\x1b[31m%s\x1b[0m", 'Error setting custom claim:', error.message);
    if (error.code === 'auth/user-not-found') {
        console.log(`\x1b[33m%s\x1b[0m`, `Hint: Make sure the user '${email}' exists in Firebase Authentication before running this script.`);
    }
  }
}

setAdminClaim(userEmail).then(() => {
  process.exit(0);
}).catch(() => {
  process.exit(1);
});
