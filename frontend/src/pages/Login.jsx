import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5555/auth/admin/login", {
                username,
                password,
            });

            // Check if the token exists in the response and save it to localStorage
            if (response.data.token) {
                localStorage.setItem("adminToken", response.data.token);
                alert("Admin login successful");

                // Navigate to the admin package page after successful login
                navigate("/admin-package");
            } else {
                alert("Invalid login response");
            }
        } catch (error) {
            console.error("Login failed", error);
            alert("Invalid admin credentials");
        }
    };

    return (
        <div className="flex text-pcolor items-center justify-center min-h-screen bg-gray-800">
            <form className="max-w-sm w-full bg-white p-8 rounded-lg shadow-md"
                onSubmit={handleSubmit}>
                <h1 className="text-center text-pcolor mb-6 text-2xl">Admin Login</h1>
                <div className="mb-5">
                    <label htmlFor="username" className="block mb-2 text-sm font-medium text-pcolor">
                        Username
                    </label>
                    <input
                        type="text"
                        id="username"
                        className="bg-gray-50 border border-gray-300 text-pcolor text-sm rounded-lg focus:ring-pcolor focus:border-pcolor block w-full p-2.5"
                        placeholder="admin"
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-5">
                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-pcolor">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-pcolor focus:border-pcolor block w-full p-2.5"
                        placeholder="********"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <button
                        type="submit"
                        className="text-white bg-gray-800 hover:bg-black focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                    >
                        Login
                    </button>
                </div>
                <div className="text-center mt-4">
                    <p className="text-pcolor">Not an admin?</p>
                    
                        Go to User Login
                   
                </div>
            </form>
        </div>
    );
};

export default Login;
