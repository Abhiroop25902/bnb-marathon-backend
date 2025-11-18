import admin, {credential} from 'firebase-admin';
import cert = credential.cert;


if (process.env.FIREBASE_ADMIN_JSON) {
    //in dev docker
    const fireBaseAdminJson = JSON.parse(process.env.FIREBASE_ADMIN_JSON);
    admin.initializeApp({credential: cert(fireBaseAdminJson)});
} else {
    // in firebase
    admin.initializeApp();
}

export const auth = admin.auth()
export const db = admin.firestore()

