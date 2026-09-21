// Substituto de next/link para o bundle do design system.
//
// O agente de design nao roda dentro do Next: nao existe AppRouterContext nem
// basePath. O next/link real le process.env.__NEXT_MANUAL_CLIENT_BASE_PATH no
// escopo do modulo e derrubava o bundle inteiro com "process is not defined".
//
// O que um Link e, no fim, e uma ancora — e e isso que ele vira aqui, com as
// props de roteamento do Next aceitas e descartadas para nao vazarem pro DOM.

import { forwardRef, type AnchorHTMLAttributes, type ReactNode } from "react";

type NextLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: string | { pathname?: string; query?: unknown; hash?: string };
  as?: unknown;
  replace?: boolean;
  scroll?: boolean;
  shallow?: boolean;
  passHref?: boolean;
  prefetch?: boolean | null;
  locale?: string | false;
  legacyBehavior?: boolean;
  children?: ReactNode;
};

const Link = forwardRef<HTMLAnchorElement, NextLinkProps>(function Link(
  {
    href,
    as: _as,
    replace: _replace,
    scroll: _scroll,
    shallow: _shallow,
    passHref: _passHref,
    prefetch: _prefetch,
    locale: _locale,
    legacyBehavior: _legacyBehavior,
    children,
    ...rest
  },
  ref,
) {
  const resolved =
    typeof href === "string"
      ? href
      : `${href?.pathname ?? ""}${href?.hash ?? ""}` || "#";
  return (
    <a ref={ref} href={resolved} {...rest}>
      {children}
    </a>
  );
});

export default Link;
