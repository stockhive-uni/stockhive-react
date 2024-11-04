import { getAuth } from 'firebase/auth';

function PopulateUsers() {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
        console.log(user.uid);  // Test whether I am able to get the UID of current user
    } else {
        // No user is signed in.
    }
}