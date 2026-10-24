"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type AvatarSize = "xs" | "sm" | "md" | "lg";

interface AvatarProps {
  src?: string | null;
  name?: string;
  size?: AvatarSize;
  className?: string;
}

const SIZES: Record<AvatarSize, { px: number; cls: string; text: string }> = {
  xs: { px: 28, cls: "size-7",  text: "text-xs"  },
  sm: { px: 36, cls: "size-9",  text: "text-sm"  },
  md: { px: 48, cls: "size-12", text: "text-base" },
  lg: { px: 64, cls: "size-16", text: "text-xl"  },
};

function getInitial(name?: string) {
  return name?.charAt(0).toUpperCase() ?? "?";
}

export function Avatar({ src, name, size = "md", className }: AvatarProps) {
  const [imgError, setImgError] = useState(false);
  const { px, cls, text } = SIZES[size];
  const showImage = Boolean(src) && !imgError;

  return (
    <div
      className={cn(
        "relative rounded-full flex items-center justify-center overflow-hidden shrink-0",
        cls,
        className,
      )}
      style={{
        background: showImage ? undefined : "var(--color-accent)",
        border: "2px solid var(--color-border)",
      }}
    >
      {showImage ? (
        <Image
          src={src!}
          alt={name ?? "avatar"}
          width={px}
          height={px}
          className="object-cover w-full h-full"
          onError={() => setImgError(true)}
        />
      ) : (
        <span className={cn("font-bold font-unbounded text-white", text)}>
          {getInitial(name)}
        </span>
      )}
    </div>
  );
}
