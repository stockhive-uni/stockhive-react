import { auth } from './firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';

function signUp(email, password) {
  return createUserWithEmailAndPassword(auth, email, password);
}

function logIn(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

function logout() {
  return signOut(auth);
}

export default { signUp, logIn, logout };