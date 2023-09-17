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
    }
  };

  return (
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
      </div>
    </div>
  );
};

export default Auth;
