import ProtectedRoute from '../components/ProtectedRoute';
import Logout from '../components/Logout';

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <div>
        <h1>You are logged in.</h1>
        <p>Welcome to your dashboard!</p>
        <Logout />
      </div>
    </ProtectedRoute>
  );
}