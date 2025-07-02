
import React from 'react';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-8">Privacy Policy</h1>
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p><strong>Last Updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</strong></p>
            
            <p>Welcome to SmartHealth. We are committed to protecting your privacy and ensuring that your personal information is handled in a safe and responsible manner. This Privacy Policy outlines how we collect, use, and protect your information when you use our platform.</p>

            <h3>1. Information We Collect</h3>
            <p>We may collect the following types of information:</p>
            <ul>
              <li><strong>Personal Identification Information:</strong> Name, email address, phone number, date of birth, etc.</li>
              <li><strong>Health Information:</strong> Symptoms, medical history, consultation records, and e-prescriptions.</li>
              <li><strong>Technical Information:</strong> IP address, browser type, device information, and usage data collected through cookies.</li>
            </ul>

            <h3>2. How We Use Your Information</h3>
            <p>Your information is used to:</p>
            <ul>
              <li>Provide, operate, and maintain our services.</li>
              <li>Connect you with healthcare professionals for consultations.</li>
              <li>Process payments and manage your account.</li>
              <li>Improve and personalize your experience on our platform.</li>
              <li>Communicate with you, including sending appointment reminders and updates.</li>
            </ul>

            <h3>3. Data Security</h3>
            <p>We implement a variety of security measures to maintain the safety of your personal information. All health information is encrypted and stored on secure servers, compliant with industry standards like HIPAA. Access to this information is restricted to authorized personnel only.</p>

            <h3>4. Sharing Your Information</h3>
            <p>We do not sell, trade, or otherwise transfer to outside parties your personally identifiable information except in the following cases:</p>
            <ul>
              <li>With your explicit consent.</li>
              <li>To trusted third parties who assist us in operating our platform, conducting our business, or serving you, so long as those parties agree to keep this information confidential.</li>
              <li>To comply with legal obligations.</li>
            </ul>
            
            <h3>5. Your Rights</h3>
            <p>You have the right to access, update, or delete your personal information. You can manage your profile information through your dashboard or by contacting our support team.</p>

            <h3>6. Changes to This Policy</h3>
            <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
