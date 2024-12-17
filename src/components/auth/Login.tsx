import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(formData.username, formData.password);
    navigate("/");
  };

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

      {/* Login Form */}
      <div className="w-full max-w-sm bg-white/10 backdrop-blur-md rounded-xl shadow-lg p-6 space-y-6">
        <h2 className="text-2xl font-semibold text-center text-white">
          Sign in to continue
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Username"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              className="w-full h-12 px-4 bg-white/20 border-white/20 text-white placeholder:text-white/60"
            />
          </div>

          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full h-12 px-4 bg-white/20 border-white/20 text-white placeholder:text-white/60 pr-10"
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

          <div className="text-right">
            <button
              type="button"
              onClick={() => navigate("/reset-password")}
              className="text-sm text-white hover:text-white/80"
            >
              Forgot Password?
            </button>
          </div>

          <Button
            type="submit"
            className="w-full py-6 text-lg bg-white text-[#00A9FF] hover:bg-white/90"
          >
            LOGIN
          </Button>
        </form>

        <div className="text-center text-sm">
          <span className="text-white/80">Don't have an account? </span>
          <button
            onClick={() => navigate("/signup")}
            className="text-white hover:text-white/80 font-medium"
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
