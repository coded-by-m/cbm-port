// Substituto de next/image para o bundle do design system.
//
// O otimizador de imagem do Next e um servico de servidor (/_next/image?url=...)
// que nao existe no runtime do agente de design — e o modulo real le
// process.env.NEXT_DEPLOYMENT_ID na carga, quebrando o bundle.
//
// Aqui a imagem e servida direta. `width`/`height` continuam saindo no DOM
// porque sao o que segura a proporcao e evita layout shift; `fill` vira o
// posicionamento absoluto que o Next aplica via CSS.

import { forwardRef, type ImgHTMLAttributes, type CSSProperties } from "react";

type StaticLike = { src: string; width?: number; height?: number };

type NextImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  src: string | StaticLike;
  alt?: string;
  width?: number | string;
  height?: number | string;
  fill?: boolean;
  priority?: boolean;
  quality?: number;
  placeholder?: string;
  blurDataURL?: string;
  loader?: unknown;
  unoptimized?: boolean;
  onLoadingComplete?: unknown;
};

const FILL_STYLE: CSSProperties = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

const Image = forwardRef<HTMLImageElement, NextImageProps>(function Image(
  {
    src,
    alt,
    width,
    height,
    fill,
    priority,
    quality: _quality,
    placeholder: _placeholder,
    blurDataURL: _blurDataURL,
    loader: _loader,
    unoptimized: _unoptimized,
    onLoadingComplete: _onLoadingComplete,
    style,
    ...rest
  },
  ref,
) {
  const resolved = typeof src === "string" ? src : src?.src ?? "";
  return (
    <img
      ref={ref}
      src={resolved}
      alt={alt ?? ""}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      style={fill ? { ...FILL_STYLE, ...style } : style}
      {...rest}
    />
  );
});

export default Image;
