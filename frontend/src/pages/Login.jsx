import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage("");
        setSuccessMessage("");

        try {
            const response = await axios.post("https://hotel-website-backend-drab.vercel.app/auth/admin/login", {
                username,
                password,
            });

            if (response.data.token) {
                localStorage.setItem("adminToken", response.data.token);
                alert("Admin login successful");
                navigate("/admin-package");
            } else {
                setErrorMessage("Invalid login response. Please try again.");
            }
        } catch (error) {
            console.error("Login failed", error);
            setErrorMessage(
                error.response?.data?.message || "Invalid admin credentials. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async () => {
        setLoading(true);
        setErrorMessage("");
        setSuccessMessage("");

        try {

            const response = await axios.post("https://hotel-website-backend-drab.vercel.app/auth/admin/forgot-password", {
                email: "14992pasan@gmail.com",
            });

            if (response.data.message === "Email sent successfully") {
                setSuccessMessage("Password has been sent to your email.");
            } else {
                setErrorMessage("Failed to send the password. Please try again.");
            }
        } catch (error) {
            console.error("Forgot password failed", error);
            setErrorMessage("Error sending email. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex text-pcolor items-center justify-center min-h-screen bg-gray-800">
            <form
                className="max-w-sm w-full bg-white p-8 rounded-lg shadow-md"
                onSubmit={handleSubmit}
            >
                <h1 className="text-center text-pcolor mb-6 text-2xl">Admin Login</h1>
                {errorMessage && (
                    <p className="mb-4 text-red-600 text-sm text-center">{errorMessage}</p>
                )}
                {successMessage && (
                    <p className="mb-4 text-green-600 text-sm text-center">{successMessage}</p>
                )}
                <div className="mb-5">
                    <label htmlFor="username" className="block mb-2 text-sm font-medium text-pcolor">
                        Username
                    </label>
                    <input
                        type="text"
                        id="username"
                        className="bg-gray-50 border border-gray-300 text-pcolor text-sm rounded-lg focus:ring-pcolor focus:border-pcolor block w-full p-2.5"
                        placeholder="admin"
                        value={username}
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
                        placeholder=""
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <button
                        type="submit"
                        className="text-white bg-gray-800 hover:bg-black focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </div>
                <div className="mt-4 text-center">
                    <button
                        type="button"
                        className="text-sm text-blue-600 hover:underline"
                        onClick={handleForgotPassword}
                        disabled={loading}
                    >
                        Forgot Password?
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Login;