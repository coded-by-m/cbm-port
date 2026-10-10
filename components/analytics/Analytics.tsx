"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  GA_ID,
  META_PIXEL_ID,
  CONSENT_EVENT,
  getConsent,
  contactKind,
  trackContact,
  type ConsentValue,
} from "@/lib/analytics";

/**
 * Carrega GA4 + Meta Pixel APENAS após consentimento (LGPD).
 *
 * Os <Script> só entram no DOM quando o consentimento é "granted" — antes disso
 * nenhum request de rastreamento sai. Reage à mudança de consentimento sem
 * reload (via CONSENT_EVENT) e dispara page_view em navegações client-side
 * (o App Router não faz isso sozinho).
 */
export function Analytics() {
  const [consent, setConsentState] = useState<ConsentValue | null>(null);
  const pathname = usePathname();
  const firstRun = useRef(true);

  // Estado inicial + escuta mudanças de consentimento.
  useEffect(() => {
    setConsentState(getConsent());
    const onChange = (e: Event) =>
      setConsentState((e as CustomEvent<ConsentValue>).detail);
    window.addEventListener(CONSENT_EVENT, onChange);
    return () => window.removeEventListener(CONSENT_EVENT, onChange);
  }, []);

  // page_view em troca de rota (o primeiro é enviado pelo próprio init).
  useEffect(() => {
    if (consent !== "granted") return;
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    window.gtag?.("event", "page_view", { page_path: pathname });
    window.fbq?.("track", "PageView");
  }, [pathname, consent]);

  // Cliques de contato → GA4. Um listener só, em captura: pega todo link
  // `wa.me`/`mailto:` sem cada botão ter que lembrar de chamar nada, e roda
  // antes da navegação (o beacon sobrevive à saída da página).
  useEffect(() => {
    if (consent !== "granted") return;
    const onClick = (e: MouseEvent) => {
      if (e.type === "auxclick" && e.button !== 1) return;
      const link = (e.target as Element | null)?.closest?.("a[href]");
      if (!link) return;
      const kind = contactKind(link.getAttribute("href") ?? "");
      if (!kind) return;
      const location =
        link.closest("[data-cm-id]")?.getAttribute("data-cm-id") ??
        link.closest("[data-cm-section]")?.getAttribute("data-cm-section") ??
        "unknown";
      trackContact(kind, location);
    };
    document.addEventListener("click", onClick, { capture: true });
    document.addEventListener("auxclick", onClick, { capture: true });
    return () => {
      document.removeEventListener("click", onClick, { capture: true });
      document.removeEventListener("auxclick", onClick, { capture: true });
    };
  }, [consent]);

  if (consent !== "granted") return null;

  return (
    <>
      {/* Google Analytics 4 */}
      <Script
        id="ga-src"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}
      </Script>

      {/* Meta Pixel */}
      <Script id="meta-pixel" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${META_PIXEL_ID}');
          fbq('track', 'PageView');
        `}
      </Script>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          alt=""
          src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  );
}
