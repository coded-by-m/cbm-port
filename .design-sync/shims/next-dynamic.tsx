// Substituto de next/dynamic para o bundle do design system.
//
// O next/dynamic real carrega o runtime de loadable do Next (que le process.env
// na carga). Aqui ele devolve o `loading` declarado, quando existe, e nada caso
// contrario — os dois usos em escopo (HeroLandscape e CaseHero) carregam fundos
// WebGL de components/zones, que estao deliberadamente fora deste design system.
//
// Ver .design-sync/NOTES.md: os cards de Hero e CaseHero mostram a composicao
// real sem a camada decorativa de canvas.

import type { ComponentType, ReactElement } from "react";

type DynamicOptions = {
  ssr?: boolean;
  loading?: ComponentType<Record<string, unknown>> | (() => ReactElement | null);
};

export default function dynamic(
  _loader: unknown,
  options?: DynamicOptions,
): ComponentType<Record<string, unknown>> {
  const Loading = options?.loading;
  const Placeholder = (props: Record<string, unknown>) =>
    Loading ? (Loading as ComponentType<Record<string, unknown>>)(props) : null;
  Placeholder.displayName = "DynamicPlaceholder";
  return Placeholder;
}

export const noSSR = dynamic;
