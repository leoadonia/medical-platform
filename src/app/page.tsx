"use client";

import { getVideo } from "@/lib/apis/media";
import { Box } from "@mui/material";
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
import { useEffect, useRef, useState } from "react";

const Home = () => {
  const [video, setVideo] = useState<string | undefined>(undefined);
  const videoRef = useRef(null);

  useEffect(() => {
    const init = async () => {
      const video = await getVideo();
      setVideo(video);
    };

    init();
  }, []);

  return (
    <Box display={"flex"}>
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
    </Box>
  );
};

export default Home;
