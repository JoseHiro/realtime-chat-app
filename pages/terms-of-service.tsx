import React from "react";
import { LandingHeader } from "../component/ui/LandingPage/LandingHeader";
import { LandingFooter } from "../component/ui/LandingPage/LandingFooter";

const TermsOfService = () => {
  return (
    <div className="bg-white text-gray-900 min-h-screen">
      <LandingHeader />

      <section className="pt-24 pb-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-8 text-gray-900">
            Terms of Service
          </h1>
          <p className="text-sm text-gray-500 mb-8">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <div className="prose prose-lg max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4 text-gray-900">
                1. Acceptance of Terms
              </h2>
              <p className="text-base text-gray-600 leading-relaxed mb-4">
                By accessing or using Kaiwa Kun ("the Service"), you agree to be
                bound by these Terms of Service ("Terms"). If you disagree with
                any part of these terms, then you may not access the Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-gray-900">
                2. Description of Service
              </h2>
              <p className="text-base text-gray-600 leading-relaxed mb-4">
                Kaiwa Kun is a Japanese language learning platform that provides
                AI-powered conversation practice, grammar feedback, and learning
                analytics. The Service is currently in beta/prototype phase and
                may be subject to changes, updates, or temporary unavailability.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-gray-900">
                3. User Accounts
              </h2>
              <div className="space-y-4">
                <p className="text-base text-gray-600 leading-relaxed">
                  To use certain features of the Service, you must register for
                  an account. You agree to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-base text-gray-600">
                  <li>
                    Provide accurate, current, and complete information during
                    registration
                  </li>
                  <li>
                    Maintain and update your account information to keep it
                    accurate
                  </li>
                  <li>Maintain the security of your password and account</li>
                  <li>
                    Accept responsibility for all activities that occur under
                    your account
                  </li>
                  <li>
                    Notify us immediately of any unauthorized use of your
                    account
                  </li>
                  <li>
                    Be at least 13 years of age (or the age of majority in your
                    jurisdiction)
                  </li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-gray-900">
                4. Free Trial and Subscription
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">
                    4.1 Free Trial
                  </h3>
                  <p className="text-base text-gray-600 leading-relaxed">
                    We offer a free trial period with limited features. The free
                    trial is provided "as is" and may be modified or
                    discontinued at any time without notice.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">
                    4.2 Paid Subscriptions
                  </h3>
                  <p className="text-base text-gray-600 leading-relaxed mb-2">
                    Paid subscriptions are billed on a recurring basis. By
                    subscribing, you authorize us to charge your payment method
                    on a recurring basis until you cancel.
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-base text-gray-600">
                    <li>
                      Subscription fees are non-refundable except as required by
                      law
                    </li>
                    <li>
                      You may cancel your subscription at any time through your
                      account settings
                    </li>
                    <li>
                      Cancellation takes effect at the end of the current
                      billing period
                    </li>
                    <li>
                      We reserve the right to change subscription prices with 30
                      days notice
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-gray-900">
                5. User Conduct
              </h2>
              <p className="text-base text-gray-600 leading-relaxed mb-4">
                You agree not to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-base text-gray-600">
                <li>Use the Service for any illegal or unauthorized purpose</li>
                <li>Violate any laws in your jurisdiction</li>
                <li>Infringe upon the rights of others</li>
                <li>
                  Attempt to gain unauthorized access to the Service or related
                  systems
                </li>
                <li>Interfere with or disrupt the Service or servers</li>
                <li>
                  Use automated systems (bots, scrapers) to access the Service
                </li>
                <li>Share your account credentials with others</li>
                <li>
                  Use the Service to generate harmful, offensive, or
                  inappropriate content
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-gray-900">
                6. Intellectual Property
              </h2>
              <p className="text-base text-gray-600 leading-relaxed mb-4">
                The Service and its original content, features, and
                functionality are owned by Kaiwa Kun and are protected by
                international copyright, trademark, and other intellectual
                property laws.
              </p>
              <p className="text-base text-gray-600 leading-relaxed">
                You retain ownership of your conversation data and content. By
                using the Service, you grant us a license to use, store, and
                process your content solely for the purpose of providing and
                improving the Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-gray-900">
                7. Beta/Prototype Disclaimer
              </h2>
              <p className="text-base text-gray-600 leading-relaxed mb-4">
                The Service is currently in beta/prototype phase. As such:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-base text-gray-600">
                <li>The Service may contain bugs, errors, or inaccuracies</li>
                <li>
                  Features may change, be removed, or added without notice
                </li>
                <li>The Service may be unavailable from time to time</li>
                <li>We do not guarantee uninterrupted or error-free service</li>
                <li>
                  Data may be lost, though we make efforts to prevent this
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-gray-900">
                8. Limitation of Liability
              </h2>
              <p className="text-base text-gray-600 leading-relaxed mb-4">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, KAIWA KUN SHALL NOT BE
                LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR
                PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER
                INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE,
                GOODWILL, OR OTHER INTANGIBLE LOSSES.
              </p>
              <p className="text-base text-gray-600 leading-relaxed">
                Our total liability for any claims arising from or related to
                the Service shall not exceed the amount you paid us in the
                twelve (12) months preceding the claim.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-gray-900">
                9. Termination
              </h2>
              <p className="text-base text-gray-600 leading-relaxed mb-4">
                We may terminate or suspend your account and access to the
                Service immediately, without prior notice, for conduct that we
                believe violates these Terms or is harmful to other users, us,
                or third parties, or for any other reason.
              </p>
              <p className="text-base text-gray-600 leading-relaxed">
                You may terminate your account at any time by contacting us or
                using the account deletion feature in settings. Upon
                termination, your right to use the Service will cease
                immediately.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-gray-900">
                10. Changes to Terms
              </h2>
              <p className="text-base text-gray-600 leading-relaxed">
                We reserve the right to modify or replace these Terms at any
                time. If a revision is material, we will provide at least 30
                days notice prior to any new terms taking effect. What
                constitutes a material change will be determined at our sole
                discretion.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-gray-900">
                11. Governing Law
              </h2>
              <p className="text-base text-gray-600 leading-relaxed">
                These Terms shall be interpreted and governed by the laws of
                [Your Jurisdiction], without regard to its conflict of law
                provisions. Any disputes arising under these Terms shall be
                subject to the exclusive jurisdiction of the courts located in
                [Your Jurisdiction].
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-gray-900">
                12. Contact Information
              </h2>
              <p className="text-base text-gray-600 leading-relaxed">
                If you have any questions about these Terms of Service, please
                contact us at:
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

export default TermsOfService;
