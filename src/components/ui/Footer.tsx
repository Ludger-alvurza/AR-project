import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-dark text-white/80" id="footer">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🏛️</span>
              <span className="font-display font-bold text-white text-lg">
                Jelajah Edukasi AR
              </span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              Aplikasi web AR edukasi-arkeologi untuk Candi Klodangan, Sleman,
              Yogyakarta. Didanai DPPM Diktisaintek.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-display font-semibold text-white mb-4">
              Navigasi
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-white/60 hover:text-green-mid transition-colors text-sm"
                >
                  Beranda
                </Link>
              </li>
              <li>
                <Link
                  href="/timeline"
                  className="text-white/60 hover:text-green-mid transition-colors text-sm"
                >
                  Timeline Situs
                </Link>
              </li>
              <li>
                <Link
                  href="/#tentang"
                  className="text-white/60 hover:text-green-mid transition-colors text-sm"
                >
                  Tentang Candi
                </Link>
              </li>
            </ul>
          </div>

          {/* Credits */}
          <div>
            <h4 className="font-display font-semibold text-white mb-4">
              Sumber Data
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://jogjacagar.jogjaprov.go.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-green-mid transition-colors text-sm"
                >
                  JogjaCagar — Pemprov DIY ↗
                </a>
              </li>
              <li>
                <a
                  href="https://id.wikipedia.org/wiki/Candi_Klodangan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-green-mid transition-colors text-sm"
                >
                  Wikipedia — Candi Klodangan ↗
                </a>
              </li>
              <li>
                <span className="text-white/40 text-sm">
                  BPCB Daerah Istimewa Yogyakarta
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col items-center gap-4">
          <div className="flex flex-col sm:flex-row justify-between items-center w-full gap-4">
            <p className="text-white/40 text-xs text-center sm:text-left">
              © {new Date().getFullYear()} Jelajah Edukasi AR Candi Klodangan.
              Didanai oleh DPPM Diktisaintek.
            </p>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-mid animate-pulse-soft" />
              <span className="text-white/40 text-xs">PWA Ready</span>
            </div>
          </div>

          {/* Developer Credit */}
          <div className="pt-4 border-t border-white/10 w-full text-center">
            <p className="text-white/50 text-sm">
              Develop by{" "}
              <span className="font-semibold text-white/70">Tim PkM UKRIM</span>
            </p>
            <a
              href="https://ukrim.ac.id/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-2 text-green-mid hover:text-white transition-colors text-sm font-medium group"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5a17.92 17.92 0 01-8.716-2.247m0 0A9.015 9.015 0 003 12c0-1.605.42-3.113 1.157-4.418"
                />
              </svg>
              ukrim.ac.id
              <svg
                className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
