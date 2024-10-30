import { useState } from 'react';
import { useRouter } from 'next/router';
import { logIn, signUp } from '../../lib/auth';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAuth = async () => {
    setError('');
    setLoading(true); 
    try {
      if (isLogin) {
        await logIn(email, password);
      } else {
        await signUp(email, password);
      }
      router.push('/dashboard');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter your email and password.'); // Basic validation
      return;
    }
    handleAuth();
  };

  return (
    <>
    <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
    <form onSubmit={handleSubmit}>
    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required/>
    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required/>
    <button type="submit" disabled={loading}>
        {loading ? 'Loading...' : (isLogin ? 'Login' : 'Sign Up')}
    </button>
    </form>
    <button onClick={() => setIsLogin(!isLogin)}>{isLogin ? 'Create an account' : 'Already have an account?'}</button>
    </>
  );
};

export default Login;