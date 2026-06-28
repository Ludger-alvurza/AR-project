export default function LoadingScreen({ message = "Memuat..." }: { message?: string }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center permission-gate" id="loading-screen">
      <div className="flex flex-col items-center gap-6">
        {/* Spinner */}
        <div className="relative">
          <div className="spinner w-12 h-12" />
          <span className="absolute inset-0 flex items-center justify-center text-xl">
            🏛️
          </span>
        </div>
        
        {/* Message */}
        <div className="text-center">
          <p className="font-display font-semibold text-green-primary text-lg">
            {message}
          </p>
          <p className="text-stone-candi text-sm mt-1">
            Jelajah Edukasi AR Candi Klodangan
          </p>
        </div>

        {/* Animated dots */}
        <div className="flex gap-1.5">
          <div className="w-2 h-2 rounded-full bg-green-mid animate-bounce" style={{ animationDelay: "0ms" }} />
          <div className="w-2 h-2 rounded-full bg-green-mid animate-bounce" style={{ animationDelay: "150ms" }} />
          <div className="w-2 h-2 rounded-full bg-green-mid animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  );
}
