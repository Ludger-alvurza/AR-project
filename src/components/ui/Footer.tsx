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
              Yogyakarta. Didanai oleh Pemerintah DIY.
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
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-white/40 text-xs">
            © {new Date().getFullYear()} Jelajah Edukasi AR Candi Klodangan.
            Didanai oleh Pemerintah Daerah Istimewa Yogyakarta.
          </p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-mid animate-pulse-soft" />
            <span className="text-white/40 text-xs">PWA Ready</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
