import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useUser } from "@auth0/nextjs-auth0/client";
import Link from 'next/link';

const LoginPage: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-gray-100 justify-center items-center">
      <div className="p-6 max-w-sm w-full bg-white shadow-md rounded-md">
        <h1 className="text-center text-2xl font-semibold text-gray-700">Login</h1>
        <div className="mt-4 flex items-center justify-center">
          <Link href="api/auth/login" className="px-4 py-2 bg-blue-500 hover:bg-blue-700 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50">
              Login with Auth0
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
