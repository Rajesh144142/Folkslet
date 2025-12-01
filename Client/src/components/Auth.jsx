<<<<<<< Updated upstream
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logIn, signUp } from "../Home/action/AuthActions";
import { BsFacebook } from "react-icons/bs";
const Auth = () => {
  const initialState = {
    firstname: "",
    lastname: "",
    username: "",
    password: "",
    confirmpass: "",
  };

  const loading = useSelector((state) => state.authReducer.loading);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isSignUp, setIsSignUp] = useState(false);
  const [data, setData] = useState(initialState);
  const [confirmPass, setConfirmPass] = useState(true);

  const resetForm = () => {
    setData(initialState); // Reset the form data
    setConfirmPass(true); // Set confirmPass to true to clear any error message
  };

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });

    // Check if the changed input is the confirm password field
    if (e.target.name === "confirmpass") {
      setConfirmPass(data.password === e.target.value);
    }
  };

  const handleSubmit = (e) => {
    setConfirmPass(true); // Reset confirmPass before validation
    e.preventDefault();
    if (isSignUp) {
      if (data.password === data.confirmpass) {
        dispatch(signUp(data, navigate));
      } else {
        setConfirmPass(false); // Set confirmPass to false to show error message
      }
    } else {
      dispatch(logIn(data, navigate));
=======
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { BsFacebook } from 'react-icons/bs';
import { logIn, signUp } from '../redux/actions/AuthActions';
import { useSnackbar } from '../providers/SnackbarProvider.jsx';

const initialState = {
  email: '',
  password: '',
  confirmpass: '',
};

const Auth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showMessage } = useSnackbar();
  const { loading, authData } = useSelector((state) => state.authReducer);
  useEffect(() => {
    if (authData) {
      navigate('/home', { replace: true });
    }
  }, [authData, navigate]);
  const [isSignUp, setIsSignUp] = useState(false);
  const [formValues, setFormValues] = useState(initialState);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormValues(initialState);
  };

  const toggleMode = () => {
    resetForm();
    setIsSignUp((prev) => !prev);
  };

  const passwordsMatch = !isSignUp || formValues.password === formValues.confirmpass;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!passwordsMatch) {
      showMessage('Passwords do not match', { severity: 'error' });
      return;
    }

    const normalizedEmail = formValues.email.trim().toLowerCase();

    const payload = {
      email: normalizedEmail,
      password: formValues.password,
    };

    try {
      if (isSignUp) {
        await dispatch(signUp(payload));
        showMessage('Account created successfully', { severity: 'success' });
      } else {
        await dispatch(logIn(payload));
        showMessage('Signed in successfully', { severity: 'success' });
      }
      navigate('/home', { replace: true });
    } catch (error) {
      const apiMessage = error.response?.data?.message || error.message;
      showMessage(apiMessage || 'Unable to process request', { severity: 'error' });
>>>>>>> Stashed changes
    }
  };

  return (
<<<<<<< Updated upstream
    <div className=" flex  justify-center items-center   mt-0  sm:mt-12 md:mt-12 lg:mt-20 gap-0 md:gap-4 lg:gap-4">
      {/* Left side */}
      <div className="w-0 sm:w-0 md:w-[50%] lg:w-[50%]  hidden sm:hidden md:block lg:block">
        <img
          src="https://imgs.search.brave.com/dWA124YWqhgCLiNdTP0FKXTD7MY5cxIFs184DZET024/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMudW5zcGxhc2gu/Y29tL3Bob3RvLTE1/NTg4ODU1NDQtMmRl/ZmM2MmUyZTJiP2l4/bGliPXJiLTQuMC4z/Jml4aWQ9TTN3eE1q/QTNmREI4TUh4elpX/RnlZMmg4TVRGOGZH/MXZZbWxzWlNVeU1I/Qm9iMjVsZkdWdWZE/QjhmREI4Zkh3dyZ3/PTEwMDAmcT04MA"
          alt="Error"
          className="w-[330px] rounded-xl float-right"
        />
      </div>
      {/* Right form side */}
      <div className="   w-[100%] sm:w-[100%] md:w-[50%] lg:w-[50%] ">
        <form
          className=" float-none md:float-left lg:float-left m-auto p-2 w-[100%] sm:w-[350px] md:w-[370px] lg:w-[380px] border-0 sm:border-2 md:border-2 lg:border-2"
          onSubmit={handleSubmit}
        >
          <h1 className="pt-6 text-center text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
            <i>Folkslet</i>
          </h1>
          {isSignUp && (
            <div className="flex m-auto w-[90%] mt-6">
              <input
                required
                type="text"
                placeholder="First Name"
                name="firstname"
                value={data.firstname}
                onChange={handleChange}
                className="bg-slate-50 m-auto p-2 w-[49%] rounded-md border-2"
              />
              <input
                required
                type="text"
                placeholder="Last Name"
                name="lastname"
                value={data.lastname}
                onChange={handleChange}
                className="bg-slate-50 m-auto w-[49%] rounded-md p-2 border-2"
              />
            </div>
          )}
          <div className={`m-auto w-[89%]  ${isSignUp ? "pt-3" : "pt-7"}`}>
            <input
              required
              type="text"
              placeholder="Username"
              name="username"
              onChange={handleChange}
              value={data.username}
              className="bg-slate-50 w-[100%] p-2 rounded-md border-2"
            />
          </div>
          <div className="m-auto w-[89%] flex flex-col pt-3">
            <input
              required
              type="password"
              placeholder="Password"
              name="password"
              value={data.password}
              onChange={handleChange}
              className="bg-slate-50 w-[100%] p-2 rounded-md border-2"
            />
            {isSignUp && (
              <input
                required
                type="password"
                placeholder="Confirm Password"
                name="confirmpass" // Add the name attribute
                value={data.confirmpass}
                onChange={handleChange}
                className="bg-slate-50 w-[100%] p-2 mt-3 rounded-md border-2"
              />
            )}
          </div>

          <span
            style={{
              color: "red",
              fontSize: "12px",
              alignSelf: "flex-end",
              marginRight: "5px",
              display: confirmPass ? "none" : "block",
            }}
          >
            *Confirm password is not the same
          </span>

          <div className="flex flex-col-reverse mt-6 gap-3 mb-4">
            <span
              className=" m-auto w-[90%] pt-3 text-center"
              style={{
                fontSize: "12px",
                cursor: "pointer",
                textDecoration: "underline",
              }}
              onClick={() => {
                resetForm();
                setIsSignUp(!isSignUp);
              }}
            >
              {isSignUp
                ? "Already have an account? Login"
                : "Don't have an account? Sign up"}
            </span>
        <div >
            {!isSignUp && (
              <div className=" mt-0 md:mt-9 lg:mt-9 ">
                <span className="flex justify-center items-center gap-3 m-auto w-[90%]">
                  <span className="h-[0.5px] w-[40%] bg-gray-500"></span>
                  <h1>Or</h1>
                  <span className="h-[0.5px] w-[40%] bg-black"></span>

                  <hr/>

                </span>
                <span className="flex justify-center items-center gap-2 mt-6">
                  <h1 className="text-xl text-blue-900">
                    <BsFacebook />
                  </h1>
                  <h1 className="text-bold text-blue-900">Log in with Facebook</h1>
                </span>
              </div>
            )}
          </div>
            <button
              className="rounded-lg border-2 p-1  bg-blue-600 text-white font-bold hover:bg-blue-200 m-auto w-[90%]"
              type="Submit"
              disabled={loading}
            >
              {loading ? "Loading..." : isSignUp ? "Sign Up" : "Login"}
            </button>
          </div>
  
        </form>
=======
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-8 text-text-base transition-colors duration-200">
      <div className="flex w-full max-w-5xl overflow-hidden rounded-3xl border border-border bg-surface shadow-xl shadow-border/40 md:h-[80vh]">
        <div className="relative hidden h-full w-1/2 bg-background md:block">
          <img
            src="https://imgs.search.brave.com/dWA124YWqhgCLiNdTP0FKXTD7MY5cxIFs184DZET024/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMudW5zcGxhc2gu/Y29tL3Bob3RvLTE1/NTg4ODU1NDQtMmRl/ZmM2MmUyZTJiP2l4/bGliPXJiLTQuMC4z/Jml4aWQ9TTN3eE1q/QTNmREI4TUh4elpX/RnlZMmg4TVRGOGZH/MXZZbWxzWlNVeU1I/Qm9iMjVsZkdWdWZE/QjhmREI4Zkh3dyZ3/PTEwMDAmcT04MA"
            alt="Creative workspace"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-background/20 to-background/5" />
        </div>
        <div className="flex h-full w-full flex-col justify-center bg-surface px-6 py-10 sm:px-10 md:w-1/2">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-semibold text-primary">Folkslet</h1>
            <p className="mt-2 text-sm text-text-muted">
              {isSignUp ? 'Create a new account to get started.' : 'Welcome back, sign in to continue.'}
            </p>
          </div>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-xs font-medium uppercase tracking-wide text-text-muted"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formValues.email}
                onChange={handleChange}
                className="w-full rounded-lg border border-border bg-background p-3 text-sm text-text-base placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/70"
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-xs font-medium uppercase tracking-wide text-text-muted"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formValues.password}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-border bg-background p-3 text-sm text-text-base
                  placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/70"
                />
              </div>
              {isSignUp && (
                <div>
                  <label
                    htmlFor="confirmpass"
                    className="mb-2 block text-xs font-medium uppercase tracking-wide text-text-muted"
                  >
                    Confirm password
                  </label>
                  <input
                    id="confirmpass"
                    name="confirmpass"
                    type="password"
                    required
                    value={formValues.confirmpass}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-border bg-background p-3 text-sm text-text-base placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/70"
                  />
                </div>
              )}
            </div>
            <button
              type="submit"
              disabled={loading || !passwordsMatch}
              className="flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-on-primary transition-colors duration-200 hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? 'Processing...' : isSignUp ? 'Create account' : 'Sign in'}
            </button>
          </form>
          {isSignUp && !passwordsMatch && (
            <p className="mt-2 text-xs font-medium text-red-500">
              Password and confirm password must match.
            </p>
          )}
          <div className="mt-6 flex items-center gap-3 text-sm text-text-muted">
            <span className="h-px flex-1 bg-border" />
            <span>or continue with</span>
            <span className="h-px flex-1 bg-border" />
          </div>
          <button
            type="button"
            className="mt-4 flex items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-text-base transition-colors duration-200 hover:border-primary hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <BsFacebook className="text-lg" />
            Log in with Facebook
          </button>
          <div className="mt-6 text-center text-sm text-text-muted">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              type="button"
              onClick={toggleMode}
              className="font-medium text-primary hover:underline"
            >
              {isSignUp ? 'Sign in' : 'Sign up'}
            </button>
          </div>
        </div>
>>>>>>> Stashed changes
      </div>
    </div>
  );
};

export default Auth;
