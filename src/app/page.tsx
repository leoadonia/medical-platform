"use client";

import { Divider } from "@mui/material";
import { ArticleList } from "./_components/ArticleList";
import { VideoPlayer } from "./_components/VideoPlayer";

const Home = () => {
  return (
    <div className="flex flex-col gap-4">
      <VideoPlayer />
      <Divider />
      <ArticleList />
    </div>
  );
};

export default Home;
