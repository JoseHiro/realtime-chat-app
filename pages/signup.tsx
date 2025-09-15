// pages/signin.tsx
import React from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { startStripeSession } from "../lib/stripe/startSession";
import { AuthHeader } from "../component/ui/LandingHeader";
import { toast } from "sonner";

type SigninFormInputs = {
  email: string;
  password: string;
  username: string;
};

const Signup = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SigninFormInputs>();

  const { plan } = router.query;
  const onSubmit = async (data: SigninFormInputs) => {
    if (!plan) {
      return;
    }

    try {
      const response = await fetch("/api/auth/signup", {
        body: JSON.stringify({
          username: data.username,
          password: data.password,
          email: data.email,
          plan,
        }),
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const result = await response.json();
      if (!response.ok) {
        toast.error(result.message || "Signup failed", {
          position: "top-center",
        });
        return;
      } else {
        toast.success("Successfully signed up!", {
          position: "top-center",
        });
        if (plan === "trial") {
          router.push("/chat");
        } else {
          startStripeSession();
        }
      }
    } catch (error) {
      console.error("Signup error:", error);
    }
  };

  return (
    <>
      <AuthHeader />
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-full max-w-md p-8 border border-gray-200 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-6 text-green-600 text-center">
            Signup
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Email
              </label>
              <input
                placeholder="you@example.com"
                type="email"
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

            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                {...register("username", { required: "Username is required" })}
                placeholder="We will call with you this name!"
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
              <label className="block mb-1 font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                {...register("password", { required: "Password is required" })}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 text-black ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="cursor-pointer w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition"
            >
              Signup
            </button>
          </form>

          {/* Optional: forgot password link */}
          <p className="mt-4 text-center text-gray-600 text-sm">
            Forgot your password?{" "}
            <a href="#" className="text-green-600 hover:underline">
              Reset here
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default Signup;
