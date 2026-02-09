"use client";

import { ArticleSection } from "./_components/ArticleSection";
import { DataSection } from "./_components/DataSection";
import { VideoSection } from "./_components/VideoSection";

const Section = ({
  id,
  children,
  className,
  first,
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
  first?: boolean;
}) => (
  <section
    id={id}
    className={`rounded-t-2xl p-4 pt-8 pb-28 ${className} ${first ? "" : "-mt-10"}`}
  >
    {children}
  </section>
);

const SettingsPage = () => {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Section id="article" className="bg-white/60" first>
        <ArticleSection />
      </Section>
      <Section id="video" className="bg-info-100">
        <VideoSection />
      </Section>
      <Section id="data" className="rounded-b-2xl bg-pink-100">
        <DataSection />
      </Section>
    </div>
  );
};

export default SettingsPage;
