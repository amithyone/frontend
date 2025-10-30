import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useAuth } from '../contexts/AuthContext';
import { AuthLayout } from "../components/auth/AuthLayout";
import toast from "react-hot-toast";

import loginBg from "/images/login-bg.png";

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);
        try {
            await login(email, password);
            navigate("/dashboard");
        } catch (err: any) {
            setError(err.message || "Login failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        try {
            const API_URL =
                import.meta.env.VITE_API_AUTH_URL || "https://api.fadsms.com/api";
            const response = await fetch(`${API_URL}/auth/google`, {
                method: "GET",
                headers: { Accept: "application/json" },
            });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const data = await response.json();
            if (data.data?.url) window.location.href = data.data.url;
        } catch {
            setError("Failed to connect to Google. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout
            image={loginBg}
            title=""
            subtitle=""
            footer={
                <div className="mt-0 text-center text-sm text-gray-600">
                    <p>
                        Are you new here?{" "}
                        <Link to="/register" className="font-medium text-[#007AFF] hover:underline">
                            Create Account
                        </Link>
                    </p>
                </div>
            }
        >
            <div className="p-0">
                <div className="text-center mb-8">
                    <img
                        src="/icons/faddedsmsLogo.svg"
                        alt="FaddedSMS logo"
                        className="mx-auto mb-4 w-38"
                    />
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Login to your account
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">Welcome back</p>
                </div>


                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-6">
                        <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Email
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-3 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="you@example.com"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-12 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2"
                            >
                                {showPassword ? (
                                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                ) : (
                                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                )}
                            </button>
                        </div>
                    </div>


                    <Link
                        to="/forgot-password"
                        className="text-sm text-[#007AFF] underline mt-1"
                    >
                        Reset password
                    </Link>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#172624] text-white font-semibold py-3 px-4 rounded-lg transition-all"
                    >
                        {isLoading ? "Signing in..." : "Login"}
                    </button>
                </form>

                <div className="my-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">
                                Or continue with
                            </span>
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                    className="w-full bg-white hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white font-medium py-3 px-4 rounded-lg transition-all flex items-center justify-center"
                >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                        {/* Google SVG same as register */}
                    </svg>
                    <div className="flex gap-2">

                        <img src="/icons/googleSVG.svg" /> Continue with Google
                    </div>
                </button>
            </div>
        </AuthLayout>
    );
}