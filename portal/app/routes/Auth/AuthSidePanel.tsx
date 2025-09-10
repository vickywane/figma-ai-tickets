export default function AuthSidePanel() {
  return (
    <div className="flex-1 relative overflow-hidden bg-gradient-to-br from-purple-900 via-pink-600 to-blue-600 rounded-r-3xl">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-800/80 via-pink-500/60 to-blue-500/80"></div>

      <div className="absolute inset-0 opacity-60">
        <svg
          className="w-full h-full"
          viewBox="0 0 400 600"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="wave1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ec4899" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.4" />
            </linearGradient>
          </defs>
          <path
            d="M0,100 C150,200 250,0 400,100 L400,200 C250,300 150,100 0,200 Z"
            fill="url(#wave1)"
          />
          <path
            d="M0,200 C150,300 250,100 400,200 L400,300 C250,400 150,200 0,300 Z"
            fill="url(#wave1)"
            opacity="0.7"
          />
          <path
            d="M0,300 C150,400 250,200 400,300 L400,400 C250,500 150,300 0,400 Z"
            fill="url(#wave1)"
            opacity="0.5"
          />
        </svg>
      </div>

      <div className="relative z-10 p-12 flex flex-col justify-between h-full text-white">
        <div className="space-y-6">
          <h1 className="text-6xl font-bold leading-tight">
            Create Tickets <br /> In Seconds
          </h1>
        </div>
      </div>
    </div>
  );
}
