import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState(""); // Renamed from username
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
            const backendUrl = import.meta.env.VITE_BACKEND_URL;

            const response = await axios.post(`${backendUrl}/users/login`, {
                email,
                password,
            });

            if (response.data.token) {
                // ✅ Store in sessionStorage
                sessionStorage.setItem("token", response.data.token);
                sessionStorage.setItem("isAdmin", response.data.isAdmin);

                alert("Login successful");
                navigate("/admin-dashboard");
            } else {
                setErrorMessage("Invalid login response. Please try again.");
            }
        } catch (error) {
            console.error("Login failed", error);
            setErrorMessage(
                error.response?.data?.message || "Invalid credentials. Please try again."
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
            const backendUrl = import.meta.env.VITE_BACKEND_URL;

            const response = await axios.post(`${backendUrl}/auth/admin/forgot-password`, {
                email,
            });

            if (response.data.message === "Email sent successfully") {
                setSuccessMessage("Password reset email sent.");
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
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-pcolor">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        className="bg-gray-50 border border-gray-300 text-pcolor text-sm rounded-lg focus:ring-pcolor focus:border-pcolor block w-full p-2.5"
                        placeholder="admin@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                        placeholder="••••••••"
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
