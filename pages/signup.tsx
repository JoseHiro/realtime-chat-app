// pages/signup.tsx
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { startStripeSession } from "../lib/stripe/startSession";
import { AuthHeader } from "../component/ui/LandingPage/LandingHeader";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { RoundedButton } from "../component/shared/button";
import { Eye, EyeOff, Check, X } from "lucide-react";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";

const signupSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(1, { message: "Password is required" })
    .min(6, { message: "Password must be at least 6 characters" })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[@$!%*?&]/, {
      message: "Password must contain at least one special character",
    }),
  username: z
    .string()
    .min(1, { message: "Username is required" })
    .min(3, { message: "Username must be at least 3 characters" }),
});

type SignupFormInputs = z.infer<typeof signupSchema>;

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { plan } = router.query;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormInputs>({
    resolver: zodResolver(signupSchema),
  });

  const password = watch("password");

  // パスワード強度チェック
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { strength: 0, text: "", color: "" };

    let strength = 0;
    if (pwd.length >= 6) strength += 25;
    if (pwd.length >= 8) strength += 25;
    if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) strength += 25;
    if (/[0-9]/.test(pwd)) strength += 12.5;
    if (/[@$!%*?&]/.test(pwd)) strength += 12.5;

    let text = "";
    let color = "";
    if (strength < 40) {
      text = "Weak";
      color = "bg-red-500";
    } else if (strength < 70) {
      text = "Medium";
      color = "bg-yellow-500";
    } else {
      text = "Strong";
      color = "bg-green-500";
    }

    return { strength, text, color };
  };

  const passwordStrength = getPasswordStrength(password);

  // プラン情報
  const planInfo = {
    trial: {
      name: "Free Trial",
      price: "Free",
      description: "3 free conversations",
      features: [
        "3 conversation sessions",
        "Grammar feedback",
        "Conversation skill feedback",
        "All difficulty levels",
        "Standard conversation themes",
      ],
      badge: "🎉",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      textColor: "text-blue-800",
    },
    pro: {
      name: "Pro Plan",
      price: "$15/month",
      description: "Unlimited conversations",
      features: [
        "Unlimited conversations",
        "Grammar feedback",
        "Conversation skill feedback",
        "All difficulty levels",
        "Various conversation themes",
        "Custom conversation scenarios",
        "Mistake pattern analysis",
      ],
      badge: "⭐",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      textColor: "text-green-800",
    },
  };

  const currentPlan =
    plan === "trial" || plan === "pro" ? planInfo[plan] : null;

  // プランが選択されていない場合はリダイレクト
  useEffect(() => {
    if (plan && plan !== "trial" && plan !== "pro") {
      toast.error("Invalid plan selected");
      router.push("/pricing");
    }
  }, [plan, router]);

  useEffect(() => {
    if (!router.isReady) return;
    const msg = router.query.message;
    const err = router.query.error;
    if (err && typeof msg === "string") {
      toast.error(decodeURIComponent(msg.replace(/\+/g, " ")));
      void router.replace({ pathname: "/signup", query: { plan } }, undefined, {
        shallow: true,
      });
    }
  }, [router.isReady, router, plan]);

  const onSubmit = async (data: SignupFormInputs) => {
    if (!plan) {
      toast.error("Plan is not selected");
      return;
    }

    setLoading(true);

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
        toast.error(result.error || "Signup failed");
        return;
      } else {
        toast.success("Successfully signed up!");
        if (plan === "trial") {
          router.push("/chat");
        } else {
          startStripeSession();
        }
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (!currentPlan) {
    return (
      <>
        <AuthHeader />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600 mb-4">Loading...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <AuthHeader />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50/30 to-white py-12 px-4 mt-8">
        <div className="w-full max-w-md">
          {/* プラン表示 */}
          <div
            className={`mb-6 p-4 ${currentPlan.bgColor} border ${currentPlan.borderColor} rounded-lg`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{currentPlan.badge}</span>
                <h3 className={`font-semibold ${currentPlan.textColor}`}>
                  {currentPlan.name}
                </h3>
              </div>
              <span className={`font-bold ${currentPlan.textColor}`}>
                {currentPlan.price}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              {currentPlan.description}
            </p>
            <ul className="text-sm text-gray-700 space-y-1">
              {currentPlan.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/pricing"
              className="text-sm text-green-600 hover:underline mt-3 inline-block"
            >
              ← Change plan
            </Link>
          </div>

          {/* サインアップフォーム */}
          <div className="bg-white p-8 border border-gray-200 rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold mb-2 text-black text-center">
              Create Your Account
            </h1>
            <p className="text-center text-gray-600 text-sm mb-6">
              Start your Japanese learning journey today
            </p>

            <button
              type="button"
              onClick={() => {
                if (plan === "trial" || plan === "pro") {
                  window.location.href = `/api/auth/google/start?plan=${plan}`;
                } else {
                  void router.push("/pricing");
                }
              }}
              className="mb-6 flex w-full items-center justify-center gap-2 rounded-md border border-gray-300 bg-white py-3 px-4 text-sm font-medium text-gray-800 shadow-sm transition hover:bg-gray-50"
            >
              <FcGoogle className="h-5 w-5" />
              Continue with Google
            </button>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Or sign up with email</span>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block mb-1 font-medium text-gray-700 text-sm">
                  Email
                </label>
                <input
                  placeholder="you@example.com"
                  type="email"
                  {...register("email")}
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

              {/* Username */}
              <div>
                <label className="block mb-1 font-medium text-gray-700 text-sm">
                  Username
                </label>
                <input
                  type="text"
                  {...register("username")}
                  placeholder="Choose a username"
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 text-black ${
                    errors.username ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.username && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.username.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block mb-1 font-medium text-gray-700 text-sm">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("password")}
                    className={`w-full px-4 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 text-black ${
                      errors.password ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {/* パスワード強度インジケーター */}
                {password && (
                  <div className="mt-2">
                    <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                        style={{ width: `${passwordStrength.strength}%` }}
                      />
                    </div>
                    <p className="text-xs mt-1 text-gray-600">
                      Password strength:{" "}
                      <span className="font-medium">
                        {passwordStrength.text}
                      </span>
                    </p>
                  </div>
                )}

                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}

                {/* パスワード要件 */}
                <div className="mt-2 text-xs text-gray-600 space-y-1">
                  <p className="font-medium mb-1">Password must contain:</p>
                  <div className="flex items-center gap-1">
                    {password?.length >= 6 ? (
                      <Check className="w-3 h-3 text-green-600" />
                    ) : (
                      <X className="w-3 h-3 text-gray-400" />
                    )}
                    <span>At least 6 characters</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {/[A-Z]/.test(password || "") ? (
                      <Check className="w-3 h-3 text-green-600" />
                    ) : (
                      <X className="w-3 h-3 text-gray-400" />
                    )}
                    <span>One uppercase letter</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {/[0-9]/.test(password || "") ? (
                      <Check className="w-3 h-3 text-green-600" />
                    ) : (
                      <X className="w-3 h-3 text-gray-400" />
                    )}
                    <span>One number</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {/[@$!%*?&]/.test(password || "") ? (
                      <Check className="w-3 h-3 text-green-600" />
                    ) : (
                      <X className="w-3 h-3 text-gray-400" />
                    )}
                    <span>One special character (@$!%*?&)</span>
                  </div>
                </div>
              </div>

              {/* Pro プラン専用の注意事項 */}
              {plan === "pro" && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-sm text-yellow-800">
                    <strong>Next step:</strong> You will be redirected to enter
                    payment information. Your subscription will start after
                    payment confirmation.
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <RoundedButton
                type="submit"
                loading={loading}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition font-semibold"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </RoundedButton>
            </form>

            {/* ログインリンク */}
            <p className="mt-6 text-center text-gray-600 text-sm">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-green-600 hover:underline font-medium"
              >
                Log in
              </Link>
            </p>
          </div>

          {/* プラン比較リンク */}
          <div className="mt-6 text-center">
            <Link
              href="/pricing#compare"
              className="text-sm text-gray-600 hover:text-green-600"
            >
              Compare all plans →
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
