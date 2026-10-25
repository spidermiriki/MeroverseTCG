import Image from "next/image";

interface MeroverseAvatarProps {
  size?: "sm" | "md" | "lg";
}

const CONFIG = {
  sm: { photo: 76,  ring: 3, halo: 90  },
  md: { photo: 92,  ring: 4, halo: 202 },
  lg: { photo: 112, ring: 4, halo: 246 },
};

export function MeroverseAvatar({ size = "lg" }: MeroverseAvatarProps) {
  const { photo, ring, halo } = CONFIG[size];

  return (
    <div className="relative flex items-center justify-center" style={{ width: halo, height: halo }}>
      {/* Radial glow behind (md/lg only) */}
      {size !== "sm" && (
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at center, rgba(249,35,47,0.3) 0%, rgba(234,67,22,0.15) 42%, transparent 68%)",
          }}
        />
      )}
      {/* Conic gradient ring wrapping the photo */}
      <div
        className="relative rounded-full"
        style={{
          width: photo + ring * 2,
          height: photo + ring * 2,
          background:
            "conic-gradient(from 0deg, #f9232f 0%, #ea4316 25%, #f9232f 50%, #ea4316 75%, #f9232f 100%)",
          padding: ring,
          boxShadow:
            "0 0 16px rgba(234,67,22,0.8), 0 0 40px rgba(249,35,47,0.35)",
        }}
      >
        <div className="w-full h-full rounded-full overflow-hidden relative">
          <Image
            src="/brand/meroverse.jpg"
            alt="@meroverse"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
    </div>
  );
}
