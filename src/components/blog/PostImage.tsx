"use client";

import { useMemo, useState } from "react";

import { PhotoViewer, Image, type ZZImage } from "zimme-zoom";

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
      <Image image={image} onClick={() => setSelectedImage(image)} />
      <PhotoViewer
        images={selectedImage ? [selectedImage] : []}
        selectedImage={selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </div>
  );
};

export default PostImage;
