// pages/signin.tsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { AuthHeader } from "../component/ui/LandingPage/LandingHeader";
import { toast } from "sonner";
import { RoundedButton } from "../component/shared/button";
import { Eye, EyeOff } from "lucide-react";

type LoginFormInputs = {
  email: string;
  password: string;
  // username: string;
};

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();

  const onSubmit = async (data: LoginFormInputs) => {
    // Here you can call your API to signin
    setLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        body: JSON.stringify({
          password: data.password,
          email: data.email,
        }),
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const result = await response.json();
        return toast.error(result.message || "Login failed", {
          position: "top-center",
        });
      }

      toast.success("Successfully logged in!", {
        position: "top-center",
      });
      router.push("/new_chat");
    } catch (error: any) {
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }

    // const result = await response.json();

    // console.log(result);
  };

  return (
    <>
      <AuthHeader />
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-full max-w-md p-8 border border-gray-200 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-6 text-black text-center">
            Login
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block mb-1 text-sm text-gray-500">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                {...register("email", { required: "Email is required" })}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 text-black ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block mb-1 text-sm text-gray-500">
                Password
              </label>
              <div className="relative">
                <input
                  placeholder="••••••••"
                  type={showPassword ? "text" : "password"}
                  {...register("password", {
                    required: "Password is required",
                  })}
                  className={`w-full px-4 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 text-black ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <RoundedButton
              // type="submit"
              loading={loading}
              className="w-full cursor-pointer bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition"
            >
              Login
            </RoundedButton>
          </form>

          {/* Optional: forgot password link */}
          {/* <p className="mt-4 text-center text-gray-600 text-sm">
            Forgot your password?{" "}
            <a href="#" className="text-green-600 hover:underline">
              Reset here
            </a>
          </p> */}
          <p className="mt-4 text-center text-gray-600 text-sm">
            Welcome back! Please enter your details.
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
