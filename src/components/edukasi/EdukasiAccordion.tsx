"use client";

import { useState } from "react";

interface EdukasiAccordionProps {
  question: string;
  answer: string;
  index: number;
}

export default function EdukasiAccordion({
  question,
  answer,
  index,
}: EdukasiAccordionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="bg-white rounded-2xl border border-green-light/50 overflow-hidden shadow-sm card-hover"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 text-left touch-target group"
        aria-expanded={isOpen}
        id={`accordion-btn-${index}`}
      >
        <div className="flex items-start gap-3 pr-4">
          <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-green-light text-green-primary flex items-center justify-center font-bold text-sm">
            {index + 1}
          </span>
          <h3 className="font-display font-semibold text-dark text-base sm:text-lg group-hover:text-green-primary transition-colors">
            {question}
          </h3>
        </div>

        <div
          className={`flex-shrink-0 w-8 h-8 rounded-full bg-green-pale flex items-center justify-center transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          <svg
            className="w-4 h-4 text-green-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </button>

      <div
        className={`accordion-content ${isOpen ? "open" : ""}`}
        style={{ maxHeight: isOpen ? "500px" : "0px" }}
        id={`accordion-content-${index}`}
      >
        <div className="px-5 pb-5 pt-0">
          <div className="pl-11 border-l-2 border-green-light">
            <p className="text-stone-candi text-sm leading-relaxed whitespace-pre-line">
              {answer}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
