"use client";
import Link from "next/link";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendEmailVerification,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebase/firebase.init";
import { useState } from "react";
import { FaEye, FaRegEyeSlash } from "react-icons/fa";

export default function RegisterPage() {
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const provider = new GoogleAuthProvider();

  const handleGoogleSignIn = () => {
    console.log("Google sign in clicked");
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log(result);
        setUser(result.user);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log("Sign out completed");
        setUser(null);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    const userName = e.target.userName.value;
    const photo =  e.target.photo.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const terms = e.target.terms.checked;
    console.log(userName, email, password, terms,photo);

    setSuccess(false);
    setErrorMessage("");

    if(!terms){
      setErrorMessage('Please accept Our Terms and Conditions');
      return;
    }

    // create user
    createUserWithEmailAndPassword(auth, email, password)
      .then((result) => {
        console.log(result);
        
        // email verify
        sendEmailVerification(auth.currentUser)
        .then(() =>{
          setSuccess(true);
          alert("We sent you a verification email. Please check your email.")
        })

        // update user profile
        const profile = {
          displayName: userName,
          photoURl: photo
        }

        updateProfile(auth.currentUser, profile)
        .then(() =>{
          console.log('User Profile Updated');
        })
        .catch(() => console.log(error))
      })

      .catch((error) => {
        console.log(error);
        setErrorMessage(error.message);
      });
  };

  return (
    <div className="hero min-h-screen">
      <div className="hero-content flex-col lg:flex-row-reverse shadow-xl/30">
        <div className="card w-full max-w-sm shrink-0 p-8">
          <div className="card-body">
            <h3 className="text-center text-2xl">Create an account</h3>
            <fieldset className="fieldset">
              <form onSubmit={handleRegister}>
                <label className="label">Name</label>
                <input
                  type="text"
                  name="userName"
                  required
                  className="input bg-white border-2 border-black"
                  placeholder="Full Name"
                />
                <label className="label">Photo URL</label>
                <input
                  type="text"
                  name="photo"
                  required
                  className="input bg-white border-2 border-black"
                  placeholder="Photo URL"
                />
                <label className="label">Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  className="input bg-white border-2 border-black"
                  placeholder="Email"
                />
                <label className="label">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    className="input bg-white border-2 border-black"
                    placeholder="Password"
                    minLength="8"
                    pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                    title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
                  />
                  <button
                    onClick={() => {
                      setShowPassword(!showPassword);
                    }}
                    type="button"
                    className="btn btn-xs absolute top-2 right-3 bg-white text-black border-0 shadow-none"
                  >
                    {showPassword ? <FaRegEyeSlash /> : <FaEye />}
                  </button>
                </div>
                <div>
                  <fieldset className="fieldset w-64 p-4 font-extrabold">
                    <legend className="fieldset-legend"></legend>
                    <label className="label">
                      <input
                        type="checkbox"
                        name="terms"
                        className="checkbox checkbox-secondary"
                      />
                      Accept Terms and Conditions
                    </label>
                  </fieldset>
                </div>
                <button
                  type="submit"
                  className="btn border-0 bg-black hover:bg-secondary mt-4 "
                >
                  SignUp
                </button>
                <br />
                {user ? (
                  <button type="submit" onClick={handleSignOut}>
                    SignOut
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    className="btm border-2 mt-4 bg-white hover:bg-secondary rounded-md p-2"
                  >
                    Sign In With Google
                  </button>
                )}
                <div>
                  <h3>{user?.displayName}</h3>
                  <p>{user?.email}</p>
                </div>
                <p className=" mt-2 text-center text-xl ">
                  Already have an account? Please {}
                  <Link className="text-secondary underline" href="/login">
                    Login
                  </Link>
                </p>
              </form>
            </fieldset>
            {errorMessage && <p className="text-red-600">{errorMessage}</p>}

            {success && (
              <div role="alert" className="alert alert-success">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 shrink-0 stroke-current"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>You have created your account successfully!</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
