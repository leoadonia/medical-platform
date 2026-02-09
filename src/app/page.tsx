"use client";

import { Box } from "@mui/material";
import { VideoPlayer } from "./_components/VideoPlayer";

const Home = () => {
  return (
    <Box display={"flex"}>
      <VideoPlayer />
    </Box>
  );
};

export default Home;
