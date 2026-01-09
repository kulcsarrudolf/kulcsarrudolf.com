"use client";

import { useTranslation } from "@/i18n/useTranslation";
import Title from "../typography/Title";
import Paragraph from "../typography/Paragraph";
import Link from "../typography/Link";
import Image from "next/image";
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

  return (
    <div style={{ fontSize: "0.85em", lineHeight: "1.0" }}>
      <Title>{t("home.currentFocus.title")}</Title>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {focusAreas.map((area) => (
          <div
            key={area.key}
            className="border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col"
          >
            <div className="flex justify-center mb-4">
              <Image
                src={area.image}
                alt={t(`home.currentFocus.${area.key}.title`) as string}
                width={125}
                height={125}
              />
            </div>
            <div className="flex-1">
              <h3
                className="text-lg font-semibold mb-2"
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
