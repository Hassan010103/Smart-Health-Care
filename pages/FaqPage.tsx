
import React from 'react';
import AccordionItem from '../components/AccordionItem';

const faqs = [
  {
    question: 'How do online consultations work?',
    answer: 'Once you book an appointment, you will receive a link to join a secure video call with your chosen doctor at the scheduled time. You can join from your computer or smartphone. After the consultation, the doctor will issue an e-prescription if necessary, which will be available in your dashboard.'
  },
  {
    question: 'Are the doctors qualified?',
    answer: 'Absolutely. We verify the credentials of every doctor on our platform. All doctors are registered medical practitioners with extensive experience in their respective fields from reputable hospitals across India.'
  },
  {
    question: 'What is the AI Symptom Checker?',
    answer: 'The AI Symptom Checker is a tool powered by Google\'s Gemini to provide preliminary insights based on the symptoms you describe. It is not a diagnostic tool but can help you understand potential causes and suggest whether you should see a doctor. It is always recommended to consult a healthcare professional for an accurate diagnosis.'
  },
  {
    question: 'Can I get a refund if I miss my appointment?',
    answer: 'We have a flexible cancellation policy. You can cancel or reschedule your appointment up to 2 hours before the scheduled time for a full refund. Unfortunately, we cannot offer refunds for missed appointments without prior notice.'
  },
  {
    question: 'Is my data secure?',
    answer: 'Yes, protecting your data is our top priority. We use industry-standard encryption for all communications and data storage. Our platform is HIPAA compliant, ensuring your personal and health information is always kept confidential and secure.'
  }
];

const FaqPage: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-900 min-h-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="mt-6 text-lg text-slate-600 dark:text-slate-400">
            Have questions? We have answers. If you can't find what you're looking for, feel free to contact us.
          </p>
        </div>

        <div className="mt-16 max-w-3xl mx-auto">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaqPage;
