import { useTranslation } from "@/i18n/useTranslation";

import Link from "../typography/Link";

import aiIntegrationSvg from "./ai-integration.svg";
import aiToolingSvg from "./ai-tooling.svg";
import openSourceSvg from "./open-source.svg";
import programmingSvg from "./programming.svg";

export const FOCUS_AREAS = [
  { key: "fullStack", image: programmingSvg },
  { key: "aiTooling", image: aiToolingSvg },
  { key: "aiIntegration", image: aiIntegrationSvg },
  { key: "openSource", image: openSourceSvg },
] as const;

export type FocusAreaKey = (typeof FOCUS_AREAS)[number]["key"];

// Static links are plain elements: the translation helper clones them into
// the sentence, so nothing here needs to be a component.
const innovatorSparkLink = <Link href="https://innovatorspark.com/">InnovatorSpark</Link>;
const reactLink = <Link href="https://react.dev">React</Link>;
const nodeJsLink = <Link href="https://nodejs.org">Node.js</Link>;
const personalProjectsLink = <Link href="https://github.com/kulcsarrudolf">personal projects</Link>;
const claudeCodeLink = <Link href="https://www.anthropic.com/claude">Claude Code</Link>;
const zimmeZoomLink = <Link href="https://github.com/kulcsarrudolf/zimme-zoom">zimme-zoom</Link>;
const samsungDeviceHelperLink = (
  <Link href="https://github.com/kulcsarrudolf/samsung-device-helper">samsung-device-helper</Link>
);

// Which links each card's sentence weaves in. Keyed the same as the card, so
// adding a card is one entry here and one in FOCUS_AREAS.
const LINKS: Record<FocusAreaKey, Record<string, React.ReactNode>> = {
  fullStack: {
    innovatorSpark: innovatorSparkLink,
    react: reactLink,
    nodejs: nodeJsLink,
    personalProjects: personalProjectsLink,
  },
  aiTooling: { claudeCode: claudeCodeLink },
  aiIntegration: {},
  openSource: {
    zimmeZoom: zimmeZoomLink,
    samsungDeviceHelper: samsungDeviceHelperLink,
  },
};

/** Renders one card's description with its links woven into the sentence. */
export function useFocusDescriptions() {
  const { t } = useTranslation();

  return (key: FocusAreaKey) => t(`home.currentFocus.${key}.description`, LINKS[key]);
}
