// Will make it so page is unreachable if user is not logged in. - AJ
import { useAuth } from "../../lib/AuthContext";
import { useRouter } from "next/router";
import { useEffect } from "react";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return children;
}

export default ProtectedRoute;