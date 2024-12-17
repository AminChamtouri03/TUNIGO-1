import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { error: resetError } = await resetPassword(email);

      if (resetError) {
        setError(resetError.message);
        return;
      }

      setIsSubmitted(true);
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#00A9FF] to-blue-600 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-sm bg-white/10 backdrop-blur-md rounded-xl shadow-lg p-6 space-y-6 text-center">
          <div className="flex flex-col items-center gap-4">
            <h2 className="text-2xl font-semibold text-white">
              Check your email
            </h2>
            <p className="text-white/80">
              We've sent a password reset link to your email address.
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
            Enter your email address and we'll send you a verification code to
            reset your password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-12 px-4 bg-white/20 border-white/20 text-white placeholder:text-white/60"
            required
          />

          <Button
            type="submit"
            className="w-full py-6 text-lg bg-white text-[#00A9FF] hover:bg-white/90"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Link"}
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
