import { useMemo, useState } from "react";

import { PhotoViewer, Image, type ImageSize, type ZZImage, ImageRatio } from "zimme-zoom";

type PostImageProps = {
  src: string;
  alt: string;
  title?: string;
  /**
   * `photo` is a small 4:3 preview. `diagram` takes the full column in a
   * square box, so a detailed drawing stays readable before it is zoomed.
   */
  variant?: "photo" | "diagram";
};

const SIZES = {
  photo: { maxWidth: 400, ratio: ImageRatio.Classic, width: "100%" },
  diagram: { ratio: ImageRatio.Square, width: "100%" },
} satisfies Record<NonNullable<PostImageProps["variant"]>, ImageSize>;

const PostImage = ({ src, alt, title, variant = "photo" }: PostImageProps) => {
  const [selectedImage, setSelectedImage] = useState<ZZImage | null>(null);

  const image = useMemo<ZZImage>(
    () => ({
      id: src,
      src,
      alt,
      title,
    }),
    [alt, src, title],
  );

  return (
    <div className="my-6 flex justify-center">
      {/* zimme-zoom's Image takes alt via the image object, not an alt prop */}
      <Image image={image} size={SIZES[variant]} onClick={() => setSelectedImage(image)} />
      <PhotoViewer
        images={selectedImage ? [selectedImage] : []}
        selectedImage={selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </div>
  );
};

export default PostImage;
