"use client";

import Link from "next/link";
import type { ReactNode } from "react";

interface SidebarProps {
  children: ReactNode;
}

const Sidebar = ({ children }: SidebarProps) => {
  return (
    <div className="drawer lg:drawer-open min-h-screen">
      {/* toggle for mobile */}
      <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />

      {/* main content */}
      <div className="drawer-content flex flex-col">
        {/* top bar */}
        <div className="navbar bg-base-200 border-b border-base-300">
          <div className="flex-none lg:hidden">
            <label
              htmlFor="dashboard-drawer"
              className="btn btn-ghost btn-square"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </label>
          </div>
          <div className="flex-1 px-2 text-lg font-semibold">
            The Sprintables Dashboard for Admin
          </div>
        </div>

        {/* page content - this is where nested routes will render */}
        <main className="p-4">
          {children}
        </main>
      </div>

      {/* sidebar */}
      <div className="drawer-side">
        <label
          htmlFor="dashboard-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu bg-base-200 text-base-content min-h-full w-64 p-4">
          <li className="mb-2">
            <span className="text-sm font-semibold uppercase text-base-content/60">
              Navigation
            </span>
          </li>

          <li>
            <Link href="/">
              <span>Home</span>
            </Link>
          </li>

          <li>
            <Link href="/dashboard/CreateEvent">
              <span>Create Event</span>
            </Link>
          </li>

          <li>
            <Link href="/dashboard/EventList">
              <span>EventList</span>
            </Link>
          </li>

          <li>
            <Link href="/dashboard/AddAdmin">
              <span>Add Admin</span>
            </Link>
          </li>

          <li className="mt-4">
            <span className="text-sm font-semibold uppercase text-base-content/60">
              Management
            </span>
          </li>
          <li>
            <button className="justify-start">
              Inbox
            </button>
          </li>
          <li>
            <button className="justify-start">
              Starred
            </button>
          </li>
          <li>
            <button className="justify-start">
              Send email
            </button>
          </li>
          <li>
            <button className="justify-start">
              Drafts
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;