import React from "react";
import { RoundedButton } from "../../../shared/button";
import { useRouter } from "next/router";

const Index = () => {
  const router = useRouter();
  return (
    <div className="py-20 bg-white border-t border-gray-200 max-w-4xl mx-auto px-6 lg:px-8 text-center font-quicksand">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 ">
        Ready to Master Japanese?
      </h2>
      <p className="text-sm mb-8 text-gray-400">
        Join thousands of learners who are improving their Japanese skills
        through natural conversations.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <RoundedButton
          onClick={() => router.push("/signup?plan=trial")}
          className="bg-black text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-gray-800 hover:scale-105 hover:shadow-lg shadow-md transition-all"
        >
          Start Your Free Trial
        </RoundedButton>
        <RoundedButton
          onClick={() => router.push("/how-it-works")}
          variant="white"
        >
          Learn More
        </RoundedButton>
      </div>
    </div>
  );
};

export default Index;
