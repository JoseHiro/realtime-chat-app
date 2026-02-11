import React from "react";

type Testimonial = {
  id: string;
  initial: string;
  name: string;
  role: string;
  quote: string;
  rating: number;
};

const TESTIMONIALS: Testimonial[] = [
  {
    id: "sarah",
    initial: "S",
    name: "Sarah M.",
    role: "Intermediate Learner",
    quote:
      "Kaiwa Kun has been amazing for my Japanese practice. The conversations feel natural, and the grammar feedback helps me understand my mistakes. Highly recommend!",
    rating: 5,
  },
  {
    id: "tomoya",
    initial: "T",
    name: "Tomoya K.",
    role: "Advanced Learner",
    quote:
      "As someone preparing for JLPT, the detailed feedback and conversation summaries are incredibly valuable. It's like having a personal tutor available anytime.",
    rating: 5,
  },
  {
    id: "emily",
    initial: "E",
    name: "Emily R.",
    role: "Beginner Learner",
    quote:
      "I was nervous about speaking Japanese, but the platform is so supportive. Starting with easy conversations built my confidence, and now I'm having longer chats!",
    rating: 5,
  },
];

const StarIcon = () => (
  <svg
    className="w-4 h-4 text-gray-900 fill-current mr-0.5"
    viewBox="0 0 20 20"
    aria-hidden
  >
    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
  </svg>
);

const StarRating = ({ count = 5 }: { count?: number }) => (
  <div className="flex mb-4" role="img" aria-label={`${count} out of 5 stars`}>
    {Array.from({ length: count }, (_, i) => (
      <StarIcon key={i} />
    ))}
  </div>
);

const TestimonialCard = ({ initial, name, role, quote, rating }: Testimonial) => (
  <article className="bg-white p-8 rounded-lg border border-transparent hover:border-gray-300 transition-colors duration-200">
    <div className="flex items-start mb-6">
      <div className="w-14 h-14 bg-gray-900 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
        <span className="text-white font-semibold text-lg">{initial}</span>
      </div>
      <div>
        <h3 className="font-semibold text-gray-500 text-sm mb-1 font-serif italic">
          {name}
        </h3>
        <p className="text-xs text-gray-500">{role}</p>
      </div>
    </div>
    <StarRating count={rating} />
    <p className="text-sm text-gray-600 leading-relaxed font-serif italic">
      &ldquo;{quote}&rdquo;
    </p>
  </article>
);

export const FeedbackSection = () => (
  <section
    className="py-20 bg-gray-50 border-t border-gray-200"
    aria-labelledby="feedback-heading"
  >
    <div className="max-w-7xl mx-auto px-6 lg:px-8">
      <header className="font-quicksand text-center mb-16">
        <h2 id="feedback-heading" className="text-4xl font-bold mb-4 text-gray-900">
          What Students Say
        </h2>
        <p className="text-sm text-gray-500">
          Hear from learners who are improving their Japanese with Kaiwa Kun
        </p>
      </header>

      <div className="grid md:grid-cols-3 gap-6">
        {TESTIMONIALS.map((testimonial) => (
          <TestimonialCard key={testimonial.id} {...testimonial} />
        ))}
      </div>
    </div>
  </section>
);

export default FeedbackSection;
