"use client";
/* eslint-disable jsx-a11y/alt-text */

import { useMemo, useState } from "react";

import { Image, PhotoViewer, type ZZImage } from "zimme-zoom";

type PostImageProps = {
  src: string;
  alt: string;
  title?: string;
  maxWidth?: string;
};

const normalizeDimension = (value: string) => {
  return /^\d+$/.test(value) ? `${value}px` : value;
};

const PostImage = ({
  src,
  alt,
  title,
  maxWidth = "333",
}: PostImageProps) => {
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
      <div className="w-full" style={{ maxWidth: normalizeDimension(maxWidth) }}>
        <Image
          image={image}
          size={{ width: "100%" }}
          onClick={() => setSelectedImage(image)}
        />
      </div>
      <PhotoViewer
        images={[image]}
        selectedImage={selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </div>
  );
};

export default PostImage;
