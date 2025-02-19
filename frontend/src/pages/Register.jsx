import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post("http://localhost:5555/register", { name, email, password })
            .then(result => {
                console.log(result);
                navigate('/login'); // Move navigate to be inside the then block
            })
            .catch(err => console.log(err));
    };

    return (
        <div className="flex text-pcolor items-center justify-center min-h-screen bg-gray-800">
            <form className="max-w-sm w-full bg-white p-8 rounded-lg shadow-md" onSubmit={handleSubmit}>
                <h1 className="text-center text-pcolor mb-6 text-2xl">Register</h1>

                <div className="mb-5">
                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-pcolor">
                        User Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        className="bg-gray-50 border border-gray-300 text-pcolor text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        placeholder="Your Name"
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-5">
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-pcolor">
                        Your email
                    </label>
                    <input
                        type="email"
                        id="email"
                        className="bg-gray-50 border border-gray-300 text-pcolor text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        placeholder="suneragira@gmail.com"
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-5">
                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-pcolor">
                        Your password
                    </label>
                    <input
                        type="password"
                        id="password"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        placeholder="********"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <button
                        type="submit"
                        className="text-white bg-gray-700 hover:bg-black focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                    >
                        Register
                    </button>
                    <div className="text-center mt-4">
                        <label htmlFor="password" className="block py-5 mb-2 text-sm font-medium text-pcolor">
                            Already registered?
                        </label>
                        <Link
                            to="/login"
                            className="text-white bg-gray-700 hover:bg-black focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                        >
                            Login
                        </Link>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Register;
