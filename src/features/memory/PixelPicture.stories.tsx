import type { Meta, StoryObj } from "@storybook/react-vite";

import { PICTURES } from "./pictures";
import PixelPicture from "./PixelPicture";

const meta = {
  title: "Memory/PixelPicture",
  component: PixelPicture,
  args: { picture: PICTURES[0], className: "h-12 w-16" },
  parameters: {
    docs: {
      description: {
        component:
          "One of the pictures under the blocks, forty-eight by thirty-six pixels in the Windows 3.1 palette, drawn crisp at any size.",
      },
    },
  },
} satisfies Meta<typeof PixelPicture>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AllPictures: Story = {
  parameters: {
    docs: { description: { story: "Every picture a block can hide, enough for an expert board." } },
  },
  render: () => (
    <div className="grid w-max grid-cols-6 gap-3">
      {PICTURES.map((picture) => (
        <figure
          key={picture.id}
          className="flex flex-col items-center gap-1 text-xs text-gray-600 dark:text-gray-400"
        >
          <span className="border border-black bg-white p-1.5">
            <PixelPicture picture={picture} className="h-9 w-12" />
          </span>
          {picture.id}
        </figure>
      ))}
    </div>
  ),
};
