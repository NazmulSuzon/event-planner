"use client";
import { sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";
import Link from "next/link";
import { auth } from "../firebase/firebase.init";
import { useRef, useState } from "react";

export default function LoginPage() {
  const [errorMessage, setErrorMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const emailRef = useRef();

  const handleLogin = (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;
    console.log(email, password);

    // reset
    setSuccess(false);
    setErrorMessage("");

    // Login User
    signInWithEmailAndPassword(auth, email, password)
      .then((result) => {
        console.log(result.user);
        if(!result.user.emailVerified){
          alert("Please verify your email address.")
        }
        else{
          setSuccess(true);
        }
      })
      .catch((error) => {
        console.log(error);
        setErrorMessage(error.message);
      });
  };

  const handleForgetPassword = () =>{
    console.log(emailRef.current.value);
    const email = emailRef.current.value;
    // reset
    setErrorMessage('');

    // send password reset email
    sendPasswordResetEmail(auth, email)
    .then(() =>{
      alert('A password reset email is sent. Please check your email.')
    })
    .catch(error =>{
      setErrorMessage(error.message);
    })
  }

  return (
    <div className="hero min-h-screen">
      <div className="hero-content flex-col lg:flex-row-reverse shadow-xl/30">
        <div className="card w-full max-w-sm shrink-0 p-8">
          <div className="card-body">
            <h3 className="text-center text-2xl">Login!</h3>
            <fieldset className="fieldset">
              <form onSubmit={handleLogin}>
                <label className="label">Email</label>
                <input
                  type="email"
                  name="email"
                  ref={emailRef}
                  required
                  className="input bg-white border-2 border-black"
                  placeholder="Email"
                />
                <label className="label">Password</label>
                <div className="relative">
                  <input
                    type="password"
                    name="password"
                    required
                    className="input bg-white border-2 border-black"
                    placeholder="Password"
                    minLength="8"
                    pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                    title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
                  />
                </div>
                <div onClick={handleForgetPassword}>
                  <a className="link link-hover">Forgot password?</a>
                </div>
                <button
                  type="submit"
                  className="btn border-0 bg-black hover:bg-secondary mt-4 w-full"
                >
                  Login
                </button>
                <br />
                <p className=" mt-2 text-center text-xl ">
                  New Here? Please {}
                  <Link className="text-secondary underline" href="/register">
                    Signup
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
                <span>Login Successfully!</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
