import Image from "next/image";
import { productImageSrc } from "@/lib/images";
import type { ArtView } from "@/lib/products";

interface ProductImageProps {
  slug: string;
  colorName: string;
  view?: ArtView;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}

/**
 * A pre-rendered product image. The parent must be `relative` and reserve its own aspect ratio,
 * so the image never causes layout shift.
 */
export function ProductImage({
  slug,
  colorName,
  view = "studio",
  alt,
  sizes,
  priority = false,
  className = "",
}: ProductImageProps) {
  return (
    <Image
      src={productImageSrc(slug, colorName, view)}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={`object-cover ${className}`}
    />
  );
}
