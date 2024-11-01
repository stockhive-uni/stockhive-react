import { useState } from 'react';
import { useRouter } from 'next/router';
import { logIn } from '../../lib/auth';

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
    handleAuth();
  };
  
  //make function to validate if user exists in database
  
  return (
    <>
    <div className="md:w-[65%] w-[90%] m-auto">
      <h1 className="text-5xl font-extrabold text-accent my-4 text-center">{isLogin ? 'Sign in' : 'Sign Up'}</h1>
      <form onSubmit={handleSubmit}>
      <input type="email" className="text-white bg-black bg-opacity-25 p-2 w-full rounded-2xl my-4" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required/>
      <input type="password" className="text-white bg-black bg-opacity-25 p-2 w-full rounded-2xl my-4" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required/>
      <button type="submit" className="rounded-lg py-2 px-4 font-bold my-4 text-white bg-accent text-xl hover:scale-105 hover:opacity-55 transition-all"disabled={loading}>
          {loading ? 'Loading...' : ('Login')}
      </button>
      </form>
      <button className="rounded-lg underline my-4 text-accent text-xl hover:scale-105 hover:opacity-55 transition-all" onClick={() => setIsLogin(!isLogin)}>{isLogin ? 'Create an account' : 'Already have an account?'}</button>
      </div>
    </>
  );
};

export default Login;