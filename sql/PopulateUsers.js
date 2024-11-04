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

export default PopulateUsers;

// This needs to be continued to be worked on, so that it can push data to the database.