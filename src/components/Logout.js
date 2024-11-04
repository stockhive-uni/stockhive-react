import { useRouter } from 'next/router';
import { auth } from '../../lib/firebase';
import { useAuth } from '../../lib/AuthContext';
import { signOut } from 'firebase/auth';

function Logout() {
    const router = useRouter();
    const { user } = useAuth();
    // Handle logout functionality
    function handleLogout() {
        signOut(auth).then(() => {
            console.log("Logged out");
            router.push('/');
        }
        )
        .catch((error) => {
            console.error("Error:", error.message);
        });
    }

    // If user is not logged in, do not display the button.
    if (!user) {
        return null;
    }
    return(
        <button onClick={handleLogout}>Logout</button>
    );
}

export default Logout;