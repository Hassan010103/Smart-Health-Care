
import React, { useState } from 'react';
import { ChevronDownIcon } from './IconComponents';

interface AccordionItemProps {
  question: string;
  answer: string;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/50">
      <button
        className="w-full flex justify-between items-center text-left p-5 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className="text-lg font-semibold text-slate-800 dark:text-slate-100">{question}</span>
        <ChevronDownIcon
          className={`w-6 h-6 text-slate-500 dark:text-slate-400 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96' : 'max-h-0'}`}
      >
        <div className="px-5 pb-5 text-slate-600 dark:text-slate-300">
          <p>{answer}</p>
        </div>
      </div>
    </div>
  );
};

export default AccordionItem;
