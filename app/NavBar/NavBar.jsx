"use client";

import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase.init";

const NavBar = () => {
  const { user } = useContext(AuthContext);

  //color mode start
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
  
    const stored = window.localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialDark = stored ? stored === "dark" : prefersDark;
  
    setIsDark(initialDark);
    document.documentElement.classList.toggle("dark", initialDark);
  }, []);
  
  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    window.localStorage.setItem("theme", next ? "dark" : "light");
  };
//color mode finish

  const links = (
    <>
      <li>
        <Link href="/">Home</Link>
      </li>
      <li>
        <Link href="/login">Login</Link>
      </li>
      <li>
        <Link href="/register">Signup</Link>
      </li>
      <li>
        <Link href="/register">Signup</Link>
      </li>
      <li>
        <Link href="/dashboard">Dashboard</Link>
      </li>
    </>
  );

  const handleLogout = () => {
    signOut(auth)
      .then(() => console.log("User logged out"))
      .catch((err) => console.error(err));
  };

  return (
    <div>
      <div className="navbar bg-primary text-primary-content">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {" "}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />{" "}
              </svg>
            </div>
            <ul
              tabIndex="-1"
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              {links}
            </ul>
          </div>
          <Link href="/" className="btn btn-ghost text-xl">
            The Spritables
          </Link>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">{links}</ul>
        </div>
        <div className="navbar-end">
        <button
    type="button"
    onClick={toggleTheme}
    className="btn btn-ghost btn-sm mr-2"
  >
    {isDark ? "🌙 Dark" : "☀️ Light"}
  </button>
           {user ? (
          <div className="flex items-center gap-3">
            <span className="font-semibold">{user.displayName || user.email}</span>
            <button
              className="btn btn-secondary text-white"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        ) : (
          <Link className="btn text-white btn-dash btn-secondary px-8" href="/login">
            Login
          </Link>
        )}
        </div>
      </div>
    </div>
  );
};

export default NavBar;
