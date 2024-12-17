import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";

const SignUp = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const { error: signupError } = await signup(
        formData.email,
        formData.password,
      );

      if (signupError) {
        setError(signupError.message);
        return;
      }

      // Show success message and redirect to login
      navigate("/login", {
        state: {
          message: "Please check your email to confirm your account",
        },
      });
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#00A9FF] to-blue-600 flex flex-col items-center justify-center p-4">
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

      {/* Signup Form */}
      <div className="w-full max-w-sm bg-white/10 backdrop-blur-md rounded-xl shadow-lg p-6 space-y-6">
        <h2 className="text-2xl font-semibold text-center text-white">
          Create your Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Input
            type="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="h-12 px-4 bg-white/20 border-white/20 text-white placeholder:text-white/60"
            required
          />

          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="h-12 px-4 bg-white/20 border-white/20 text-white placeholder:text-white/60 pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>

          <Input
            type="password"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData({ ...formData, confirmPassword: e.target.value })
            }
            className="h-12 px-4 bg-white/20 border-white/20 text-white placeholder:text-white/60"
            required
          />

          <Button
            type="submit"
            className="w-full py-6 text-lg bg-white text-[#00A9FF] hover:bg-white/90"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </Button>
        </form>

        <div className="text-center text-sm">
          <span className="text-white/80">Already have an account? </span>
          <button
            onClick={() => navigate("/login")}
            className="text-white hover:text-white/80 font-medium"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
