"use client";

import { getVideo } from "@/lib/apis/media";
import { Skeleton } from "@mui/material";
import {
  MediaControlBar,
  MediaController,
  MediaFullscreenButton,
  MediaMuteButton,
  MediaPlayButton,
  MediaTimeDisplay,
  MediaTimeRange,
  MediaVolumeRange,
} from "media-chrome/react";
import { useEffect, useRef, useState, useTransition } from "react";

export const VideoPlayer = () => {
  const [video, setVideo] = useState<string | undefined>(undefined);
  const videoRef = useRef(null);

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const video = await getVideo();
      setVideo(video);
    });
  }, []);

  if (isPending || !video) {
    return (
      <Skeleton
        sx={{
          minHeight: 320,
          maxHeight: 480,
        }}
        animation="wave"
        variant="rounded"
        className="rounded-lg"
      />
    );
  }

  return (
    <MediaController
      style={{ width: "100%", aspectRatio: "16/9" }}
      className="rounded-xl border border-white shadow-xl shadow-gray-500"
    >
      <video
        ref={videoRef}
        src={video}
        slot="media"
        playsInline
        controls={false}
        className="full-width"
      />
      <MediaControlBar className="media-control-group">
        <MediaPlayButton noTooltip />
        <MediaTimeRange />
        <MediaTimeDisplay showDuration />
        <MediaMuteButton noTooltip />
        <MediaVolumeRange />
        <MediaFullscreenButton noTooltip />
      </MediaControlBar>
    </MediaController>
  );
};
