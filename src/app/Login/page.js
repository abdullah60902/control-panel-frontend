'use client'
import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import {
  FaThLarge,
  FaUser,
  FaClipboardList,
  FaExclamationTriangle,
  FaUsers,
  FaGraduationCap,
  FaShieldAlt,
  FaUserCog,
} from 'react-icons/fa';
import { set } from 'nprogress';
import { toast } from 'react-toastify';

const Page = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [loginError, setLoginError] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('https://control-panel-backend-eta.vercel.app/user/login', {
        email,
        password,
      });

      if (res.status === 200) {
        const { token, user } = res.data;
        login(token, user);
        setMsg('Login successful!');
        toast.success(res.data.msg);

        router.push('/Dashboard'); // redirect to profile or dashboard
      }
    } catch (err) {
      setLoginError(true);
      setMsg(err.response?.data?.msg || 'Login failed');
      toast.error(err.response?.data?.msg || 'Login failed')
    }
  };
  
  return (
    <>
    <div className="flex bg-[#111827] "  >
      {/* Sidebar */}
      <aside className="hidden md:block w-64 bg-white dark:bg-gray-800 shadow h-screen sticky top-0">
        <nav className="flex flex-col h-full">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">Navigation</p>
          </div>
          <div className="flex-1 px-2 py-4 overflow-y-auto">
            <a href="#" className="side-menu-item flex items-center px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-primary-light hover:text-primary dark:hover:bg-gray-700 dark:hover:text-primary-light rounded-md transition-colors">
              <FaThLarge className="mr-3 text-gray-500 dark:text-gray-400" />
              Dashboard
            </a>
            <a href="#" className="side-menu-item flex items-center px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-primary-light hover:text-primary dark:hover:bg-gray-700 dark:hover:text-primary-light rounded-md transition-colors">
              <FaUser className="mr-3 text-gray-500 dark:text-gray-400" />
              Client Management
            </a>
            <a href="#" className="side-menu-item flex items-center px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-primary-light hover:text-primary dark:hover:bg-gray-700 dark:hover:text-primary-light rounded-md transition-colors">
              <FaClipboardList className="mr-3 text-gray-500 dark:text-gray-400" />
              Care Planning
            </a>
            <a href="#" className="side-menu-item flex items-center px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-primary-light hover:text-primary dark:hover:bg-gray-700 dark:hover:text-primary-light rounded-md transition-colors">
              <FaExclamationTriangle className="mr-3 text-gray-500 dark:text-gray-400" />
              Incident Reports
            </a>
            <a href="#" className="side-menu-item flex items-center px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-primary-light hover:text-primary dark:hover:bg-gray-700 dark:hover:text-primary-light rounded-md transition-colors">
              <FaUsers className="mr-3 text-gray-500 dark:text-gray-400" />
              HR Management
            </a>
            <a href="#" className="side-menu-item flex items-center px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-primary-light hover:text-primary dark:hover:bg-gray-700 dark:hover:text-primary-light rounded-md transition-colors">
              <FaGraduationCap className="mr-3 text-gray-500 dark:text-gray-400" />
              Training
            </a>
            <a href="#" className="side-menu-item flex items-center px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-primary-light hover:text-primary dark:hover:bg-gray-700 dark:hover:text-primary-light rounded-md transition-colors">
              <FaShieldAlt className="mr-3 text-gray-500 dark:text-gray-400" />
              Compliance
            </a>
            <a href="#" className="side-menu-item flex items-center px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-primary-light hover:text-primary dark:hover:bg-gray-700 dark:hover:text-primary-light rounded-md transition-colors">
              <FaUserCog className="mr-3 text-gray-500 dark:text-gray-400" />
              User Management
            </a>
          </div>
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#EEEEFF] flex items-center justify-center text-[#4A49B0] font-medium">
                A
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Admin User</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">admin@carehome.com</p>
              </div>
            </div>
          </div>
        </nav>
      </aside>

      {/* Login Form */}
    <div className="flex-1 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="bg-[#111827] dark:bg-gray-800 shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white dark:text-primary-light">Care Home Management</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Sign in to your account</p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 dark:border-gray-600 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 dark:border-gray-600 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>

            {loginError && (
              <div className="mb-4 text-red-500 text-sm">
                {msg}
              </div>
            )}

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <input id="remember-me" type="checkbox" className="h-4 w-4 text-primary border-gray-300 rounded" />
                <label htmlFor="remember-me" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Remember me
                </label>
              </div>
              <a href="#" className="text-sm font-bold text-white hover:text-blue-300">
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-[#4b4aac] hover:bg-[#474588] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Sign In
            </button>

            <div className="text-center text-gray-500 dark:text-gray-400 text-sm mt-4">
<p>Hint: Use email &quot;butt60902@gmail.com&quot; and password &quot;Test@123&quot;</p>
            </div>
          </form>
        </div>
      </div>
    </div>
    </div>
    
    </>
  );
};

export default Page;
