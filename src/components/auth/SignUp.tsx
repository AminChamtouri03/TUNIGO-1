import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/AuthContext";

const SignUp = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    nationality: "",
    otherNationality: "",
    password: "",
    confirmPassword: "",
    gender: "",
    termsAccepted: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add signup logic here
    login(formData.email, formData.password); // Auto login after signup
    navigate("/");
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
          <Input
            type="text"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={(e) =>
              setFormData({ ...formData, fullName: e.target.value })
            }
            className="h-12 px-4 bg-white/20 border-white/20 text-white placeholder:text-white/60"
          />

          <Input
            type="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="h-12 px-4 bg-white/20 border-white/20 text-white placeholder:text-white/60"
          />

          <div className="space-y-2">
            <Select
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  nationality: value,
                  otherNationality:
                    value === "other" ? "" : formData.otherNationality,
                })
              }
            >
              <SelectTrigger className="h-12 px-4 bg-white/20 border-white/20 text-white hover:bg-white/30">
                <SelectValue
                  placeholder="Select Nationality"
                  className="text-white/60"
                />
              </SelectTrigger>
              <SelectContent className="bg-white/90 backdrop-blur-md border-white/20">
                <SelectItem value="tunisian">Tunisian</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>

            {formData.nationality === "other" && (
              <Input
                type="text"
                placeholder="Enter your nationality"
                value={formData.otherNationality}
                onChange={(e) =>
                  setFormData({ ...formData, otherNationality: e.target.value })
                }
                className="h-12 px-4 bg-white/20 border-white/20 text-white placeholder:text-white/60"
              />
            )}
          </div>

          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="h-12 px-4 bg-white/20 border-white/20 text-white placeholder:text-white/60 pr-10"
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
          />

          <Select
            onValueChange={(value) =>
              setFormData({ ...formData, gender: value })
            }
          >
            <SelectTrigger className="h-12 px-4 bg-white/20 border-white/20 text-white hover:bg-white/30">
              <SelectValue
                placeholder="Select Gender"
                className="text-white/60"
              />
            </SelectTrigger>
            <SelectContent className="bg-white/90 backdrop-blur-md border-white/20">
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="terms"
              checked={formData.termsAccepted}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, termsAccepted: checked as boolean })
              }
              className="border-white/20 data-[state=checked]:bg-white data-[state=checked]:text-[#00A9FF]"
            />
            <label
              htmlFor="terms"
              className="text-sm text-white/80 leading-none"
            >
              I accept the terms and conditions
            </label>
          </div>

          <Button
            type="submit"
            className="w-full py-6 text-lg bg-white text-[#00A9FF] hover:bg-white/90"
          >
            Create Account
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
