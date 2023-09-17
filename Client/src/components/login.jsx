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

export default Login;
