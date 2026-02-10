"use client";

import { Box, Divider } from "@mui/material";
import { ArticleList } from "./_components/ArticleList";
import { VideoPlayer } from "./_components/VideoPlayer";

const Home = () => {
  return (
    <Box display={"flex"} flexDirection={"column"} gap={8}>
      <VideoPlayer />
      <Divider />
      <ArticleList />
    </Box>
  );
};

export default Home;
