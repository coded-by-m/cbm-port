// Substituto de next/navigation para o bundle do design system.
//
// Os hooks de rota do App Router leem contextos que so existem dentro do Next.
//
// O caminho devolvido NAO e "/" de proposito. O WhatsAppFab se esconde em "/",
// em "/experiencia" e em "/lp/*" — na home o header ja tem contato fixo, e nas
// landings o CTA proprio disputaria a mesma acao. Devolver "/" fazia o
// componente renderizar `null`, e o card saia vazio sem que nada estivesse
// quebrado. "/projetos" e uma rota real onde ele aparece, que e o estado util
// tanto para o card quanto para um design montado com ele.

export function usePathname(): string {
  return "/projetos";
}

export function useSearchParams(): URLSearchParams {
  return new URLSearchParams();
}

export function useParams<T = Record<string, string>>(): T {
  return {} as T;
}

export function useSelectedLayoutSegment(): string | null {
  return null;
}

export function useSelectedLayoutSegments(): string[] {
  return [];
}

const noop = () => {};

export function useRouter() {
  return {
    push: noop,
    replace: noop,
    back: noop,
    forward: noop,
    refresh: noop,
    prefetch: noop,
  };
}

export function redirect(_url: string): never {
  throw new Error("redirect() nao esta disponivel fora do Next.");
}

export function notFound(): never {
  throw new Error("notFound() nao esta disponivel fora do Next.");
}
