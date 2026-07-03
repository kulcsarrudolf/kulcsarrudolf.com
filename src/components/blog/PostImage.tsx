"use client";

import { useMemo, useState } from "react";

import { PhotoViewer, Image, type ZZImage, ImageRatio } from "zimme-zoom";

type PostImageProps = {
  src: string;
  alt: string;
  title?: string;
};

const PostImage = ({ src, alt, title }: PostImageProps) => {
  const [selectedImage, setSelectedImage] = useState<ZZImage | null>(null);

  const image = useMemo<ZZImage>(
    () => ({
      id: src,
      src,
      alt,
      title,
    }),
    [alt, src, title]
  );

  return (
    <div className="my-6 flex justify-center">
      {/* eslint-disable-next-line jsx-a11y/alt-text -- zimme-zoom's Image takes alt via the image object, not an alt prop */}
      <Image
        image={image}
        size={{
          maxWidth: 400,
          ratio: ImageRatio.Classic,
          width: "100%",
        }}
        onClick={() => setSelectedImage(image)}
      />
      <PhotoViewer
        images={selectedImage ? [selectedImage] : []}
        selectedImage={selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </div>
  );
};

export default PostImage;
