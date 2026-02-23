import React from "react";
import { LandingHeader } from "../component/ui/LandingPage/LandingHeader";
import { LandingFooter } from "../component/ui/LandingPage/LandingFooter";

const PrivacyPolicy = () => {
  return (
    <div className="bg-white text-gray-900 min-h-screen">
      <LandingHeader />

      <section className="pt-24 pb-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-8 text-gray-900">
            Privacy Policy
          </h1>
          <p className="text-sm text-gray-500 mb-8">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <div className="prose prose-lg max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4 text-gray-900">
                1. Introduction
              </h2>
              <p className="text-base text-gray-600 leading-relaxed mb-4">
                Welcome to Kaiwa Kun ("we," "our," or "us"). We are committed to
                protecting your privacy and ensuring the security of your
                personal information. This Privacy Policy explains how we
                collect, use, disclose, and safeguard your information when you
                use our Japanese learning platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-gray-900">
                2. Information We Collect
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">
                    2.1 Information You Provide
                  </h3>
                  <ul className="list-disc pl-6 space-y-2 text-base text-gray-600">
                    <li>
                      Account information (email address, username, password)
                    </li>
                    <li>
                      Conversation data (voice recordings, transcripts,
                      conversation history)
                    </li>
                    <li>
                      Payment information (processed securely through Stripe)
                    </li>
                    <li>Feedback and support communications</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">
                    2.2 Automatically Collected Information
                  </h3>
                  <ul className="list-disc pl-6 space-y-2 text-base text-gray-600">
                    <li>Usage data and analytics</li>
                    <li>Device information and browser type</li>
                    <li>
                      IP address and location data (general geographic area
                      only)
                    </li>
                    <li>Cookies and similar tracking technologies</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-gray-900">
                3. How We Use Your Information
              </h2>
              <p className="text-base text-gray-600 leading-relaxed mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-base text-gray-600">
                <li>Provide, maintain, and improve our services</li>
                <li>Process transactions and manage your subscription</li>
                <li>Generate conversation summaries and feedback</li>
                <li>Send you important updates and notifications</li>
                <li>Respond to your inquiries and provide customer support</li>
                <li>Analyze usage patterns to improve user experience</li>
                <li>Ensure platform security and prevent fraud</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-gray-900">
                4. Data Storage and Security
              </h2>
              <p className="text-base text-gray-600 leading-relaxed mb-4">
                We implement appropriate technical and organizational measures
                to protect your personal information against unauthorized
                access, alteration, disclosure, or destruction. However, no
                method of transmission over the internet is 100% secure, and we
                cannot guarantee absolute security.
              </p>
              <p className="text-base text-gray-600 leading-relaxed">
                Your conversation data is stored securely and is only accessible
                to you and our system for the purpose of providing our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-gray-900">
                5. Data Sharing and Disclosure
              </h2>
              <p className="text-base text-gray-600 leading-relaxed mb-4">
                We do not sell your personal information. We may share your
                information only in the following circumstances:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-base text-gray-600">
                <li>
                  With service providers who assist us in operating our platform
                  (e.g., Stripe for payments, cloud hosting providers)
                </li>
                <li>
                  When required by law or to protect our rights and safety
                </li>
                <li>
                  In connection with a business transfer or merger (with prior
                  notice)
                </li>
                <li>With your explicit consent</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-gray-900">
                6. Your Rights and Choices
              </h2>
              <p className="text-base text-gray-600 leading-relaxed mb-4">
                You have the right to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-base text-gray-600">
                <li>Access and review your personal information</li>
                <li>Update or correct your account information</li>
                <li>Delete your account and associated data</li>
                <li>Request a copy of your data</li>
                <li>
                  Opt-out of marketing communications (you can manage this in
                  your account settings)
                </li>
              </ul>
              <p className="text-base text-gray-600 leading-relaxed mt-4">
                To exercise these rights, please contact us using the
                information provided in the "Contact Us" section below.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-gray-900">
                7. Cookies and Tracking Technologies
              </h2>
              <p className="text-base text-gray-600 leading-relaxed mb-4">
                We use cookies and similar technologies to enhance your
                experience, analyze usage, and assist with security. You can
                control cookies through your browser settings, but disabling
                cookies may affect the functionality of our platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-gray-900">
                8. Children's Privacy
              </h2>
              <p className="text-base text-gray-600 leading-relaxed">
                Our service is not intended for children under the age of 13. We
                do not knowingly collect personal information from children
                under 13. If you believe we have collected information from a
                child under 13, please contact us immediately.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-gray-900">
                9. Changes to This Privacy Policy
              </h2>
              <p className="text-base text-gray-600 leading-relaxed">
                We may update this Privacy Policy from time to time. We will
                notify you of any material changes by posting the new Privacy
                Policy on this page and updating the "Last updated" date. You
                are advised to review this Privacy Policy periodically for any
                changes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-gray-900">
                10. Contact Us
              </h2>
              <p className="text-base text-gray-600 leading-relaxed">
                If you have any questions about this Privacy Policy or our data
                practices, please contact us at:
              </p>
              <p className="text-base text-gray-600 leading-relaxed mt-4">
                Email: support@kaiwakun.com
                <br />
                (Please replace with your actual contact email)
              </p>
            </section>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
};

export default PrivacyPolicy;
