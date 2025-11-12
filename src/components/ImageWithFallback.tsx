"use client";

import Image, { ImageProps } from "next/image";
import { useState } from "react";

export default function ImageWithFallback(props: ImageProps) {
  const [src, setSrc] = useState<string>(
    typeof props.src === "string" ? props.src : ""
  );

  console.log('ImageWithFallback rendering with src:', src);
  console.log('Props src:', props.src);

  return (
    <Image
      {...props}
      src={src}
      onError={(e) => {
        console.error('Image failed to load:', src);
        console.error('Error event:', e);
        setSrc("/images/no-image.png");
      }}
      onLoad={() => {
        console.log('Image loaded successfully:', src);
      }}
      unoptimized
    />
  );
}