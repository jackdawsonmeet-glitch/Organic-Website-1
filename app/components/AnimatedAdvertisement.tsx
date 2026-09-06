"use client";

import { useEffect, useRef, useState } from "react";

type Props = { src: string; fallbackSrc: string; poster: string };
const description = "Animated casino jackpot advertisement";

export default function AnimatedAdvertisement({ src, fallbackSrc, poster }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [failedSource, setFailedSource] = useState<string>();
  const isVideo = /\.(mp4|webm)(?:[?#]|$)/i.test(src);
  const useFallback = failedSource === src;

  useEffect(() => {
    const video = videoRef.current;
    if (!isVideo || useFallback || !video) return;
    let active = true;
    video.muted = true;
    // Keep the animation available when autoplay or video decoding is blocked.
    void video.play().catch(() => {
      if (active) setFailedSource(src);
    });
    return () => { active = false; };
  }, [src, isVideo, useFallback]);

  if (!isVideo || useFallback) {
    // The surrounding advertisement link owns navigation and click handling.
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={isVideo ? fallbackSrc : src} alt={description} width={970} height={90} decoding="async" />;
  }

  return <video
    ref={videoRef}
    src={src}
    poster={poster}
    width={970}
    height={90}
    autoPlay
    muted
    loop
    playsInline
    disablePictureInPicture
    disableRemotePlayback
    aria-label={description}
    onError={() => setFailedSource(src)}
  />;
}
