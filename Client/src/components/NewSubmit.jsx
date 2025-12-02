import { useState } from "react"
import axios from 'axios'
import { useNavigate ,Link} from "react-router-dom"

const NewSubmit = () => {

    const navigate = useNavigate()
    const [otp, setOtp] = useState('')
    const [password, setPassword] = useState('')
    const handleSubmit = (e) => {
        e.preventDefault();
    const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
    axios.post(`${apiUrl}/users/submit-otp`,
        {
            email: localStorage.getItem('email'), // Assuming you store the email in localStorage
            otp: otp,
            password: password
        })
        .then(res => {
          
            navigate('/users/login')
            alert('Password Updated.')

        }).catch(err => {
            console.log(err)
        })}
    return (
        <section className="bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">

                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            FORGET PASSWORD                </h1>
                        <form className="space-y-4 md:space-y-6" action="#">
                            <div>
                                <label htmlFor="otp" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">OTP</label>
                                <input type="text" name="OTP" id="OTP" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="OTP" required=""
                                    onChange={(e) => {
                                        setOtp(e.target.value)
                                    }}
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                <input type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" onChange={(e) => {
                                    setPassword(e.target.value)

                                }} />
                            </div>
                            <button type="submit" className="w-full bg-blue-900 text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"    onClick={handleSubmit}>CHANGE PASSWORD</button>
                        

                        </form>
                     
                    </div>
                </div>
            </div>
        </section>)
}

export default NewSubmit
