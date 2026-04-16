/**
 * SkeletonCard — animated shimmer placeholder that matches PhotoCard dimensions.
 * Shown while the image is loading or before the card enters the viewport.
 */
export default function SkeletonCard() {
  return (
    <div className="glass-card rounded-2xl overflow-hidden border border-purple-500/10">
      {/* Image area — 1:1 square aspect ratio */}
      <div className="relative aspect-square bg-purple-950/60 overflow-hidden">
        {/* Shimmer sweep */}
        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-purple-900/40 via-purple-800/20 to-purple-900/40" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(105deg, transparent 40%, rgba(232,121,249,0.08) 50%, transparent 60%)",
            backgroundSize: "200% 100%",
            animation: "shimmer-sweep 1.6s linear infinite",
          }}
        />

        {/* Fake tag chip top-left */}
        <div className="absolute top-3 left-3">
          <div className="h-5 w-20 rounded-full bg-purple-800/40 animate-pulse" />
        </div>

        {/* Fake action buttons top-right */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <div className="w-9 h-9 rounded-full bg-purple-800/40 animate-pulse" />
          <div className="w-9 h-9 rounded-full bg-purple-800/40 animate-pulse" />
        </div>

        {/* Fake name bar — bottom of image */}
        <div className="absolute bottom-3 left-3 right-12">
          <div className="h-5 w-24 rounded-lg bg-purple-700/40 animate-pulse" />
        </div>
      </div>

      {/* Text area */}
      <div className="p-4 space-y-2.5">
        {/* Wish text — 3 lines */}
        <div className="h-3 rounded-full bg-purple-800/40 animate-pulse w-full" />
        <div className="h-3 rounded-full bg-purple-800/30 animate-pulse w-4/5" />
        <div className="h-3 rounded-full bg-purple-800/20 animate-pulse w-3/5" />
        {/* Read more button stub */}
        <div className="h-3 w-16 rounded-full bg-purple-700/30 animate-pulse mt-1" />
      </div>
    </div>
  );
}
