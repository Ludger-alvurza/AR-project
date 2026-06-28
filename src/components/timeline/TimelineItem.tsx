"use client";

import { useEffect, useRef } from "react";

interface TimelineItemProps {
  title: string;
  year: string;
  description: string;
  icon: string;
  index: number;
  isLast?: boolean;
}

export default function TimelineItem({
  title,
  year,
  description,
  icon,
  index,
  isLast = false,
}: TimelineItemProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      },
      { threshold: 0.2 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const isEven = index % 2 === 0;

  return (
    <div
      ref={ref}
      className={`reveal relative flex items-start gap-4 md:gap-0 mb-12 ${
        isLast ? "" : ""
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {/* Mobile Layout */}
      <div className="md:hidden flex gap-4 w-full">
        {/* Dot */}
        <div className="relative flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-green-primary flex items-center justify-center text-lg shadow-lg shadow-green-primary/25 z-10 relative">
            {icon}
          </div>
          {!isLast && (
            <div className="absolute top-10 left-1/2 -translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-green-mid to-green-light" />
          )}
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-green-light/50 flex-1 card-hover">
          <span className="inline-block bg-green-light text-green-primary text-xs font-bold px-3 py-1 rounded-full mb-3">
            {year}
          </span>
          <h3 className="font-display font-bold text-dark text-lg mb-2">
            {title}
          </h3>
          <p className="text-stone-candi text-sm leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex items-center w-full">
        {/* Left side */}
        <div className={`w-[calc(50%-24px)] ${isEven ? "text-right pr-8" : ""}`}>
          {isEven && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-green-light/50 card-hover inline-block text-left">
              <span className="inline-block bg-green-light text-green-primary text-xs font-bold px-3 py-1 rounded-full mb-3">
                {year}
              </span>
              <h3 className="font-display font-bold text-dark text-lg mb-2">
                {title}
              </h3>
              <p className="text-stone-candi text-sm leading-relaxed">
                {description}
              </p>
            </div>
          )}
        </div>

        {/* Center dot */}
        <div className="relative flex-shrink-0 mx-2">
          <div className="w-12 h-12 rounded-full bg-green-primary flex items-center justify-center text-xl shadow-lg shadow-green-primary/25 z-10 relative">
            {icon}
          </div>
        </div>

        {/* Right side */}
        <div className={`w-[calc(50%-24px)] ${!isEven ? "pl-8" : ""}`}>
          {!isEven && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-green-light/50 card-hover inline-block text-left">
              <span className="inline-block bg-green-light text-green-primary text-xs font-bold px-3 py-1 rounded-full mb-3">
                {year}
              </span>
              <h3 className="font-display font-bold text-dark text-lg mb-2">
                {title}
              </h3>
              <p className="text-stone-candi text-sm leading-relaxed">
                {description}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
