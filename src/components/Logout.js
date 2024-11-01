import { useRouter } from 'next/router';
import { logout } from '../../lib/auth';
import { useAuth } from '../../lib/AuthContext';

function Logout() {
    const router = useRouter();
    const { user } = useAuth();
    // Handle logout functionality
    function handleLogout() {
        logout().then(() => {
            console.log("Logout Successful");
            router.push('/');
        })
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