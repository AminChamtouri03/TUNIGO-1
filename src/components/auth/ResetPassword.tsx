import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add actual password reset logic here
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#00A9FF] to-blue-600 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-sm bg-white/10 backdrop-blur-md rounded-xl shadow-lg p-6 space-y-6 text-center">
          <div className="flex flex-col items-center gap-4">
            <h2 className="text-2xl font-semibold text-white">
              Check your phone
            </h2>
            <p className="text-white/80">
              We've sent a verification code to your phone number.
            </p>
          </div>
          <Button
            onClick={() => navigate("/login")}
            className="w-full py-6 text-lg bg-white text-[#00A9FF] hover:bg-white/90"
          >
            Back to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#00A9FF] to-blue-600 flex flex-col items-center justify-center p-4">
      {/* Logo */}
      <div className="flex flex-col items-center gap-2 mb-8">
        <div className="bg-white p-3 rounded-full">
          <Compass className="h-8 w-8 text-[#00A9FF]" />
        </div>
        <div className="text-3xl font-bold text-white">
          <span>TUNI</span>
          <span className="text-red-500">GO</span>
        </div>
      </div>

      {/* Reset Form */}
      <div className="w-full max-w-sm bg-white/10 backdrop-blur-md rounded-xl shadow-lg p-6 space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-white">Reset Password</h2>
          <p className="text-sm text-white/80 mt-2">
            Enter your phone number and we'll send you a verification code to
            reset your password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="tel"
            placeholder="Phone number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full h-12 px-4 bg-white/20 border-white/20 text-white placeholder:text-white/60"
            required
            pattern="[0-9]*"
            maxLength={8}
          />

          <Button
            type="submit"
            className="w-full py-6 text-lg bg-white text-[#00A9FF] hover:bg-white/90"
          >
            Send Code
          </Button>
        </form>

        <div className="text-center text-sm">
          <button
            onClick={() => navigate("/login")}
            className="text-white hover:text-white/80 font-medium"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
