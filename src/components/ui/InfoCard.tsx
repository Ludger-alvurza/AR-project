import Link from "next/link";

interface InfoCardProps {
  icon: string;
  title: string;
  description: string;
  linkHref?: string;
  linkText?: string;
  className?: string;
}

export default function InfoCard({
  icon,
  title,
  description,
  linkHref,
  linkText = "Pelajari Lebih Lanjut →",
  className = "",
}: InfoCardProps) {
  return (
    <div
      className={`bg-white rounded-2xl p-6 shadow-sm card-hover border border-green-light/50 ${className}`}
    >
      <div className="text-3xl mb-4">{icon}</div>
      <h3 className="font-display font-bold text-dark text-lg mb-2">
        {title}
      </h3>
      <p className="text-stone-candi text-sm leading-relaxed mb-4">
        {description}
      </p>
      {linkHref && (
        <Link
          href={linkHref}
          className="inline-flex items-center text-green-primary font-semibold text-sm hover:text-green-mid transition-colors group"
        >
          {linkText}
          <svg
            className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      )}
    </div>
  );
}
