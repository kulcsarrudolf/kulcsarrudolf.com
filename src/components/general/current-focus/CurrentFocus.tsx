"use client";

import { useTranslation } from "@/i18n/useTranslation";
import Title from "../typography/Title";
import Paragraph from "../typography/Paragraph";
import Link from "../typography/Link";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import programmingSvg from "./programming.svg";
import aiToolingSvg from "./ai-tooling.svg";
import openSourceSvg from "./open-source.svg";
import aiIntegrationSvg from "./ai-integration.svg";

const CurrentFocus = () => {
  const { t } = useTranslation();

  const TheBriefAILink = () => (
    <Link href="https://thebrief.ai">The Brief AI</Link>
  );
  const ReactLink = () => <Link href="https://react.dev">React</Link>;
  const NodeJSLink = () => <Link href="https://nodejs.org">Node.js</Link>;
  const PersonalProjectsLink = () => (
    <Link href="https://github.com/kulcsarrudolf">personal projects</Link>
  );

  const CursorLink = () => <Link href="https://cursor.sh">Cursor</Link>;
  const ClaudeCodeLink = () => (
    <Link href="https://www.anthropic.com/claude">Claude Code</Link>
  );
  const ZedLink = () => <Link href="https://zed.dev">Zed</Link>;

  const MastraAILink = () => <Link href="https://mastra.ai">Mastra AI</Link>;

  const ZimmeZoomLink = () => (
    <Link href="https://github.com/kulcsarrudolf/zimme-zoom">zimme-zoom</Link>
  );
  const SamsungDeviceHelperLink = () => (
    <Link href="https://github.com/kulcsarrudolf/samsung-device-helper">
      samsung-device-helper
    </Link>
  );

  const focusAreas = [
    {
      key: "fullStack",
      image: programmingSvg,
    },
    {
      key: "aiTooling",
      image: aiToolingSvg,
    },
    {
      key: "aiIntegration",
      image: aiIntegrationSvg,
    },
    {
      key: "openSource",
      image: openSourceSvg,
    },
  ];

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;

    // Check if the click target is a link or within a link
    const target = e.target as HTMLElement;
    if (target.closest("a")) {
      return; // Don't start dragging if clicking on a link
    }

    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!scrollContainerRef.current) return;

    // Check if the touch target is a link or within a link
    const target = e.target as HTMLElement;
    if (target.closest("a")) {
      return; // Don't start dragging if touching a link
    }

    setIsDragging(true);
    setStartX(e.touches[0].pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    const x = e.touches[0].pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const handleMouseLeave = () => {
      setIsDragging(false);
    };

    if (scrollContainerRef.current) {
      scrollContainerRef.current.addEventListener(
        "mouseleave",
        handleMouseLeave
      );
    }

    return () => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.removeEventListener(
          "mouseleave",
          handleMouseLeave
        );
      }
    };
  }, []);

  return (
    <div style={{ fontSize: "0.85em", lineHeight: "1.0" }}>
      <Title>{t("home.currentFocus.title")}</Title>

      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto overflow-y-hidden snap-x snap-mandatory cursor-grab active:cursor-grabbing"
        style={{
          WebkitOverflowScrolling: "touch",
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {focusAreas.map((area) => (
          <div
            key={area.key}
            className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col flex-shrink-0 snap-start"
            style={{ minWidth: "210px", maxWidth: "280px", width: "100%" }}
          >
            <div
              className="flex justify-center mb-4"
              style={{ width: "125px", height: "125px", margin: "0 auto" }}
            >
              <Image
                src={area.image}
                alt={t(`home.currentFocus.${area.key}.title`) as string}
                width={125}
                height={125}
                style={{ objectFit: "contain", width: "100%", height: "100%" }}
              />
            </div>
            <div className="flex-1">
              <h3
                className="text-lg font-semibold mb-2 text-center"
                style={{ color: "#4267b2" }}
              >
                {t(`home.currentFocus.${area.key}.title`)}
              </h3>
              <Paragraph>
                {area.key === "fullStack" &&
                  t(`home.currentFocus.${area.key}.description`, {
                    theBriefAI: <TheBriefAILink />,
                    react: <ReactLink />,
                    nodejs: <NodeJSLink />,
                    personalProjects: <PersonalProjectsLink />,
                  })}
                {area.key === "aiTooling" &&
                  t(`home.currentFocus.${area.key}.description`, {
                    cursor: <CursorLink />,
                    claudeCode: <ClaudeCodeLink />,
                    zed: <ZedLink />,
                  })}
                {area.key === "aiIntegration" &&
                  t(`home.currentFocus.${area.key}.description`, {
                    mastraAI: <MastraAILink />,
                  })}
                {area.key === "openSource" &&
                  t(`home.currentFocus.${area.key}.description`, {
                    zimmeZoom: <ZimmeZoomLink />,
                    samsungDeviceHelper: <SamsungDeviceHelperLink />,
                  })}
              </Paragraph>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CurrentFocus;
