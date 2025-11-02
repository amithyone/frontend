import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../contexts/AuthContext";
import { AuthLayout } from "./AuthLayout";

import registerBg from "/images/register-bg.png";

type Tab = "contact" | "verify";

export default function Register() {
    const { register: authRegister } = useAuth();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState<Tab>("contact");
    const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        agreeToTerms: false,
    });

    const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmitContact = async (e: React.FormEvent) => {
        e.preventDefault();

        const errors: string[] = [];

        if (!formData.firstName.trim()) errors.push("First name is required");
        if (!formData.lastName.trim()) errors.push("Last name is required");
        if (!formData.email.trim()) errors.push("Email is required");
        else if (!/\S+@\S+\.\S+/.test(formData.email))
            errors.push("Please enter a valid email address");
        if (!formData.password) errors.push("Password is required");
        else if (formData.password.length < 8)
            errors.push("Password must be at least 8 characters");
        if (formData.password !== formData.confirmPassword)
            errors.push("Passwords do not match");
        if (!formData.agreeToTerms)
            return toast.error("Please agree to the terms and conditions");

        if (errors.length) {
            errors.forEach((msg) => toast.error(msg));
            return;
        }

        toast.success("OTP sent to your email!");
        setActiveTab("verify");

        setIsLoading(true);
        try {
            await new Promise((r) => setTimeout(r, 800));
        } catch (err: any) {
            toast.error(err.message || "Failed to send OTP");
        } finally {
            setIsLoading(false);
        }
    };

    const handleOtpChange = (index: number, value: string) => {
        if (!/^\d?$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        if (value && index < 5) otpRefs.current[index + 1]?.focus();
    };

    const handleOtpKeyDown = (
        index: number,
        e: React.KeyboardEvent<HTMLInputElement>
    ) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        const code = otp.join("");
        if (code.length !== 6) return toast.error("Please enter all 6 digits");

        setIsLoading(true);
        try {
            await authRegister(formData.email, formData.password, {
                firstName: formData.firstName,
                lastName: formData.lastName,
            });
            toast.success("Account created successfully!");
            navigate("/dashboard");
        } catch (err: any) {
            toast.error(err.message || "Invalid OTP or registration failed");
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
            toast.error("Failed to connect to Google");
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOtp = () => {
        toast.success("OTP resent!");
    };

    return (
        <AuthLayout
            image={registerBg}
            title={
                <>
                    Receive <span className="text-teal-400">SMS & OTP</span>
                </>
            }
            subtitle="From 900+ Services"
            footer={
                <p className="text-center text-sm text-gray-600">
                    Already Had an Account?{" "}
                    <Link to="/login" className="text-teal-600 hover:underline font-medium">
                        Login
                    </Link>
                </p>
            }
        >
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <img
                        src="/icons/faddedsmsLogo.svg"
                        alt="FaddedSMS logo"
                        className="mx-auto mb-4 w-34 h-auto"
                    />
                    <h2 className="text-3xl font-bold text-gray-900">
                        {activeTab === "contact" ? "Create an account" : "Enter OTP"}
                    </h2>
                </div>

                <div className="flex border-b border-gray-300 mb-6">
                    <button
                        type="button"
                        onClick={() => setActiveTab("contact")}
                        className={`flex-1 py-3 text-sm font-medium transition-colors relative ${activeTab === "contact"
                                ? "text-teal-600"
                                : "text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        Contact
                        {activeTab === "contact" && (
                            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600" />
                        )}
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab("verify")}
                        className={`flex-1 py-3 text-sm font-medium transition-colors relative ${activeTab === "verify"
                                ? "text-teal-600"
                                : "text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        Verify Mail
                        {activeTab === "verify" && (
                            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600" />
                        )}
                    </button>
                </div>

                {activeTab === "contact" && (
                    <form onSubmit={handleSubmitContact} className="space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            {["firstName", "lastName"].map((field) => (
                                <div key={field} className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        name={field}
                                        type="text"
                                        value={formData[field as keyof typeof formData] as string}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-3 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                                        placeholder={field === "firstName" ? "First Name" : "Last Name"}
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full pl-10 pr-3 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                                placeholder="Email address"
                            />
                        </div>

                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                name="password"
                                type={showPassword ? "text" : "password"}
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                                placeholder="Create Password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2"
                            >
                                {showPassword ? (
                                    <EyeOff className="h-5 w-5 text-gray-400" />
                                ) : (
                                    <Eye className="h-5 w-5 text-gray-400" />
                                )}
                            </button>
                        </div>

                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                name="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                                placeholder="Confirm password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2"
                            >
                                {showConfirmPassword ? (
                                    <EyeOff className="h-5 w-5 text-gray-400" />
                                ) : (
                                    <Eye className="h-5 w-5 text-gray-400" />
                                )}
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#172624] text-white font-semibold py-3 px-4 rounded-lg transition-all"
                        >
                            {isLoading ? "Sending OTP..." : "REGISTER"}
                        </button>

                        <button
                            type="button"
                            onClick={handleGoogleLogin}
                            disabled={isLoading}
                            className="w-full bg-white hover:bg-gray-50 border border-gray-300 text-gray-900 font-medium py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path
                                    fill="#4285F4"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                    fill="#34A853"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                    fill="#FBBC05"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                />
                                <path
                                    fill="#EA4335"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                />
                            </svg>
                            Continue with Google
                        </button>
                    </form>
                )}

                {activeTab === "verify" && (
                    <form onSubmit={handleVerifyOtp} className="space-y-6">
                        <p className="text-center text-gray-600 text-sm">
                            Enter the 6-digit code sent to your email address to verify your account
                        </p>

                        <div className="flex justify-center gap-2">
                            {otp.map((digit, i) => (
                                <input
                                    key={i}
                                    ref={(el) => (otpRefs.current[i] = el)}
                                    type="text"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleOtpChange(i, e.target.value)}
                                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                                    className="w-12 h-12 text-center text-lg font-medium border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                                />
                            ))}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#172624] text-white font-semibold py-3 px-4 rounded-lg transition-all"
                        >
                            {isLoading ? "Verifying..." : "CONTINUE"}
                        </button>

                        <p className="text-center text-sm text-gray-600">
                            Didn't receive?{" "}
                            <button
                                type="button"
                                onClick={handleResendOtp}
                                className="text-teal-600 hover:underline font-medium"
                            >
                                Resend
                            </button>
                        </p>
                    </form>
                )}
            </div>
        </AuthLayout>
    );
}