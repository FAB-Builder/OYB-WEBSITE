"use client";

import { useEffect, useState } from "react";

interface DemoStatusSectionProps {
  title: string;
  desc: string;
  iframeSrc: string;
}

const DemoStatusSection = ({ title, desc, iframeSrc }: DemoStatusSectionProps) => {
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const msg = event.data;
      if (!msg || msg.source !== "pagepilot-demo-viewer") return;

      if (msg.type === "DEMO_STATUS") {
        setIsLive(msg.status === "live");
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  return (
    <section
      id="card-how-it-works"
      className="py-20 w-full bg-primary/5"
      style={{ display: isLive ? undefined : "none" }}
    >
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
          {title}
        </h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          {desc}
        </p>
        <iframe
          src={iframeSrc}
          className="text-xl text-muted-foreground mb-8 mx-auto"
          height="500"
          width="100%"
          title="Demo Viewer"
        />
      </div>
    </section>
  );
};

export default DemoStatusSection;
