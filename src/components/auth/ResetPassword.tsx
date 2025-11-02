import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import PasswordUpdatedModal from "../PasswordUpdatedModal";

export default function ResetPassword() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const API_URL = import.meta.env.VITE_API_AUTH_URL || "https://api.fadsms.com/api";
            const response = await fetch(`${API_URL}/auth/forgot-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            const json = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(json?.message || "Failed to send reset email");
            }

            setSuccess(true);
            setShowSuccessModal(true);
        } catch (err: any) {
            setError(err.message || "Failed to send reset email. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <div className="flex items-center justify-center gap-3 mb-2">
                            <img
                                src="/icons/faddedsmsLogo.svg"
                                alt="FaddedSMS"
                                className="w-44 h-24"
                            />
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                        <div className="text-center mb-6">
                            <h1 className="text-2xl font-bold text-[#000000] mb-2">
                                Reset Password
                            </h1>
                            <p className="text-[#667185] text-sm">
                                Enter your email address, we'll send you an one time password (OTP) to reset your password
                            </p>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                                <p className="text-red-700 text-sm">{error}</p>
                            </div>
                        )}

                        {success && !showSuccessModal && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                                <p className="text-green-700 text-sm">
                                    Reset instructions sent! Check your email for the OTP.
                                </p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-2">
                                    Email
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-10 pr-3 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                                        placeholder="Email address"
                                        required
                                        disabled={success}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading || success}
                                className="w-full bg-[#172624] text-white font-semibold py-3 px-4 rounded-lg transition-all hover:bg-[#0f1a18] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? "SENDING..." : "CONTINUE"}
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <Link
                                to="/login"
                                className="text-sm text-gray-600 hover:text-gray-900"
                            >
                                Back to login
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <PasswordUpdatedModal 
                isOpen={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
            />
        </>
    );
}