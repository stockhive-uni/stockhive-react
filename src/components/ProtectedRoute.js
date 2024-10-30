import { useEffect } from 'react';
import { useAuth } from '../../lib/AuthContext';
import { useRouter } from 'next/router';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log("ProtectedRoute user:", user, "loading:", loading); // Debugging log
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) return <div>Loading...</div>; // Show loading state
  return user ? children : null;
}

export default ProtectedRoute;
