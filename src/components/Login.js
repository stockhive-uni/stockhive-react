
import { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from 'next/router';

const LoginComponent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const router = useRouter();
  const auth = getAuth();
  const regex = /^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/ //regex expression was taken from this website: https://regex101.com/library/SOgUIV

  const Login = async(e) => { //used the firedocs documentation to assist in using the provided functions: https://firebase.google.com/docs/auth/web/start
   e.preventDefault();
   setLoading(true);

   //regular expression validation on top of HTML validation for email

   let UserEmailValid = regex.test(email);
    
   if (UserEmailValid) {
    try {
      console.log(email, password);
      await signInWithEmailAndPassword(auth, email, password) 
      .then((userInformation) => {
        setLoading(false);
        console.log("User: ", userInformation.user);
        router.push('/dashboard');
      })
    }
    catch (error) {
      setLoginError("Incorrect email/password, try again."); 
    }  
   }
   else {
    setLoginError("Invalid Email, try again.");
   }
   setLoading(false);
  }
   
  
  return (
    <>
    <div className="md:w-[65%] w-[90%] m-auto">
      <h1 className="text-5xl font-extrabold text-accent my-4 text-center">Login</h1>
      <form onSubmit={Login}>
      <input type="email" className="text-white bg-black bg-opacity-25 p-2 w-full rounded-2xl my-4" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required/>
      <input type="password" className="text-white bg-black bg-opacity-25 p-2 w-full rounded-2xl my-4" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required/>
      <div className="text-red-500 text-center">{loginError}</div>
      <button type="submit" className="rounded-lg py-2 px-4 font-bold my-4 text-white bg-accent text-xl hover:scale-105 hover:opacity-55 transition-all"disabled={loading}>
          {loading ? 'Loading...' : 'Login'}
      </button>
      </form>
     </div>
    </>
  );
};

export default LoginComponent;