<<<<<<< Updated upstream
import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from 'react-router-dom';
import {useDispatch} from 'react-redux'
const Login = ({ setLoginUser }) => {
    const dispatch=useDispatch();
    const [user, setUser] = useState({
        email: "",
        password: ""
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser({
            ...user,
            [name]: value
        });
    };

    const signIn = (e) => {
        e.preventDefault();

        axios.post("http://localhost:5000/auth/login", user)
        .then((res) => {
          const { user, token } = res.data;
          localStorage.setItem('TOKEN', token);
          localStorage.setItem('USER_ID', user._id);
    
          localStorage.setItem('EMAIL', user.email);
          console.log(user._id);
         navigate('/home');
            })
            .catch(err => {
                if (err.response && err.response.data && err.response.data.message) {
                    window.alert(err.response.data.message);
                    
                } else {
                    console.log(err);
                }
            });    };

    return (
        <section className="bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">

                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Sign in to your account
                        </h1>
                        <form className="space-y-4 md:space-y-6" action="#">
                            <div>
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                                <input type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" required="" onChange={handleChange} />
                            </div>
                            <div>
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                <input type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" onChange={handleChange} />
                            </div>
                            <button type="submit" className="w-full bg-blue-900 text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800" onClick={signIn}>Sign in</button>
                            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                Don’t have an account yet? <Link to="/auth/signup" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign up</Link>
                            </p>
                            <Link to="/auth/forgetpassword" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Forget password?</Link>

                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}
=======
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { login as loginRequest } from '../api/authApi';
import { AUTH_START, AUTH_SUCCESS, AUTH_FAIL } from '../redux/actionTypes';
import { useSnackbar } from '../providers/SnackbarProvider.jsx';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showMessage } = useSnackbar();
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const signIn = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    dispatch({ type: AUTH_START });
    try {
      const { data } = await loginRequest(credentials);
      dispatch({ type: AUTH_SUCCESS, data });
      showMessage('Signed in successfully', { severity: 'success' });
      navigate('/home', { replace: true });
    } catch (error) {
      dispatch({ type: AUTH_FAIL, error: error.response?.data?.message || error.message });
      showMessage(error.response?.data?.message || 'Unable to sign in', { severity: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="bg-background text-text-base transition-colors duration-200">
      <div className="flex min-h-screen flex-col items-center justify-center px-6 py-8">
        <div className="w-full rounded-lg border border-border bg-surface shadow-sm sm:max-w-md">
          <div className="space-y-5 p-6 sm:p-8">
            <h1 className="text-xl font-semibold leading-tight tracking-tight sm:text-2xl">
              Sign in to your account
            </h1>
            <form className="space-y-5" onSubmit={signIn}>
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-text-base">
                  Your email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={credentials.email}
                  onChange={handleChange}
                  className="block w-full rounded-lg border border-border bg-background p-2.5 text-sm text-text-base placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/70"
                  placeholder="name@company.com"
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-text-base"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={credentials.password}
                  onChange={handleChange}
                  className="block w-full rounded-lg border border-border bg-background p-2.5 text-sm text-text-base placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/70"
                  placeholder="••••••••"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-on-primary transition-colors duration-200 hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting ? 'Signing in...' : 'Sign in'}
              </button>
              <p className="text-sm font-light text-text-muted">
                Don’t have an account yet?{' '}
                <Link to="/auth" className="font-medium text-primary hover:underline">
                  Sign up
                </Link>
              </p>
              <Link to="/auth/forgetpassword" className="text-sm font-medium text-primary">
                Forget password?
              </Link>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
>>>>>>> Stashed changes

export default Login;
