import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  BriefcaseIcon,
  CalendarIcon,
  CodeIcon,
  EasterEggIcon,
  EnvelopeIcon,
  GrowthIcon,
  IdeaIcon,
  ShipIcon,
  TeamIcon,
} from "./icons";

const ICONS = [
  { name: "IdeaIcon", Icon: IdeaIcon },
  { name: "GrowthIcon", Icon: GrowthIcon },
  { name: "ShipIcon", Icon: ShipIcon },
  { name: "TeamIcon", Icon: TeamIcon },
  { name: "BriefcaseIcon", Icon: BriefcaseIcon },
  { name: "CodeIcon", Icon: CodeIcon },
  { name: "EasterEggIcon", Icon: EasterEggIcon },
  { name: "EnvelopeIcon", Icon: EnvelopeIcon },
  { name: "CalendarIcon", Icon: CalendarIcon },
];

const meta = {
  title: "General/LetsTalkIcons",
  parameters: {
    docs: {
      description: {
        component:
          "The Let's Talk row icons, drawn by hand rather than pulled from Font Awesome: the free set is solid only, and solid glyphs at 22px read heavier than the hairline rules they sit between. The last two are the smaller pair that goes inside the buttons.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Gallery: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-6 text-brand">
      {ICONS.map(({ name, Icon }) => (
        <div key={name} className="flex flex-col items-center gap-2">
          <Icon />
          <span className="text-xs text-gray-500">{name}</span>
        </div>
      ))}
    </div>
  ),
};
