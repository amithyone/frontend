import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PasswordUpdatedModalProps {
    isOpen: boolean;
    onClose?: () => void;
}

export default function PasswordUpdatedModal({ isOpen, onClose }: PasswordUpdatedModalProps) {
    const navigate = useNavigate();

    if (!isOpen) return null;

    const handleContinue = () => {
        if (onClose) {
            onClose();
        }
        navigate("/login");
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-12 relative">
                {/* Logo */}
                <div className="absolute top-8 left-1/2 -translate-x-1/2">
                    <div className="flex items-center justify-center gap-3">
                        <img
                            src="/icons/faddedsmsLogo.svg"
                            alt="FaddedSMS"
                            className="w-10 h-10"
                        />
                        <span className="text-2xl font-semibold text-gray-900">faddedsms</span>
                    </div>
                </div>

                {/* Success Icon */}
                <div className="flex justify-center mb-8 mt-16">
                    <div className="relative">
                        <div className="absolute inset-0 bg-green-100 rounded-full blur-xl opacity-60" />
                        
                        <div className="relative bg-green-100 rounded-full p-8">
                            <div className="bg-green-500 rounded-full p-8">
                                <Check className="w-16 h-16 text-white stroke-[3]" />
                            </div>
                        </div>
                    </div>
                </div>

                <p className="text-center text-gray-900 text-xl mb-12">
                    You've updated your password.
                </p>

                <button
                    onClick={handleContinue}
                    className="w-full bg-[#172624] text-white font-semibold py-4 px-4 rounded-xl text-lg transition-all hover:bg-[#0f1a18]"
                >
                    CONTINUE
                </button>
            </div>
        </div>
    )
}