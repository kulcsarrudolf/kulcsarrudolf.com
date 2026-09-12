import type { Meta, StoryObj } from "@storybook/react-vite";

import FloatingHearts, { FULL_RISE } from "./FloatingHearts";
import { ATMOSPHERE_HEARTS, ATMOSPHERE_WASH } from "./LovingAtmosphere";

// The two grounds the two tunings are drawn against, so each set can be judged
// against the thing it actually sits on.
const CREAM = "linear-gradient(to bottom, #fbf7f1 0%, #f7ece3 50%, #efdcd2 100%)";

const meta = {
  title: "Wedding/FloatingHearts",
  component: FloatingHearts,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof FloatingHearts>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The wedding page's six: straight up, slow, rose, over its cream gradient. */
export const WeddingPage: Story = {
  decorators: [
    (Story) => (
      <div className="fixed inset-0" style={{ background: CREAM }}>
        <Story />
      </div>
    ),
  ],
};

/** The loving atmosphere's twenty: faster, brighter, swaying, over the wash. */
export const Atmosphere: Story = {
  args: {
    hearts: ATMOSPHERE_HEARTS,
    rise: FULL_RISE,
    className: "drop-shadow-[0_1px_5px_rgba(190,18,60,0.3)]",
    stillWhenReduced: true,
  },
  decorators: [
    (Story) => (
      <div className="fixed inset-0 bg-surface">
        <div className="fixed inset-0" style={{ background: ATMOSPHERE_WASH }} />
        <Story />
      </div>
    ),
  ],
};

/**
 * The same twenty with the drifting off. Only differs from `Atmosphere` for a
 * visitor whose system asks for reduced motion; turn the preference on to see
 * the hearts hold the heights they were given instead of rising.
 */
export const StillUnderReducedMotion: Story = {
  ...Atmosphere,
  args: { ...Atmosphere.args, stillWhenReduced: true },
};
