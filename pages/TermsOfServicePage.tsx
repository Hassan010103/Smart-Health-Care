
import React from 'react';

const TermsOfServicePage: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-8">Terms of Service</h1>
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p><strong>Last Updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</strong></p>

            <p>Please read these Terms of Service ("Terms", "Terms of Service") carefully before using the SmartHealth application (the "Service") operated by us.</p>

            <h3>1. Agreement to Terms</h3>
            <p>By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the Service.</p>
            
            <h3>2. Service Description</h3>
            <p>SmartHealth provides a platform for online medical consultations, an AI-powered symptom checker for preliminary insights, and an encyclopedia of wellness information. The Service is not a substitute for emergency medical services. In a medical emergency, please contact local emergency services immediately.</p>
            
            <h3>3. User Accounts</h3>
            <p>When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service. You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password.</p>

            <h3>4. Medical Disclaimer</h3>
            <p>The content provided on SmartHealth, including the AI Symptom Checker, is for informational purposes only and does not constitute medical advice, diagnosis, or treatment. Always seek the advice of a qualified healthcare provider with any questions you may have regarding a medical condition.</p>

            <h3>5. Payments and Subscriptions</h3>
            <p>Some parts of the Service are billed on a subscription basis ("Subscription(s)") or as a one-time payment. You will be billed in advance on a recurring and periodic basis for subscriptions. All payments are processed through a secure third-party payment processor.</p>

            <h3>6. Limitation of Liability</h3>
            <p>In no event shall SmartHealth, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.</p>

            <h3>7. Governing Law</h3>
            <p>These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfServicePage;
