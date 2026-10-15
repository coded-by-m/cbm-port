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
  trackEvent,
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

  // Contato e formulário → Coded Insights sempre (first-party, sem cookie).
  // GA4/Meta continuam atrás do consentimento, dentro de `trackEvent`.
  //
  // O listener fica em `window` na captura: roda antes do autocapture do
  // tracker (que escuta `document`). `stopPropagation` evita o evento em
  // dobro. O default do link segue — a navegação não é cancelada. Se o
  // tracker ainda não carregou, o clique segue e o autocapture cobre.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.type === "auxclick" && e.button !== 1) return;
      const link = (e.target as Element | null)?.closest?.("a[href]");
      if (!link) return;
      const kind = contactKind(link.getAttribute("href") ?? "");
      if (!kind) return;
      const location =
        link.getAttribute("data-cm-id") ??
        link.closest("[data-cm-section]")?.getAttribute("data-cm-section") ??
        "unknown";
      const section =
        link.closest("[data-cm-section]")?.getAttribute("data-cm-section") ?? undefined;
      trackContact(kind, location, section);
      if (window.__codedInsightsInternals?.emit) e.stopPropagation();
    };
    const onSubmit = (e: Event) => {
      const form = e.target;
      if (!(form instanceof HTMLFormElement)) return;
      if (form.getAttribute("role") === "search" || form.querySelector('input[type="password"]')) {
        return;
      }
      trackEvent("form_submit", {
        form_id: form.getAttribute("data-cm-id") || form.id || form.getAttribute("name") || undefined,
        form_role: form.getAttribute("data-cm-role") || undefined,
        section: form.closest("[data-cm-section]")?.getAttribute("data-cm-section") || undefined,
      });
      if (window.__codedInsightsInternals?.emit) e.stopPropagation();
    };
    window.addEventListener("click", onClick, true);
    window.addEventListener("auxclick", onClick, true);
    window.addEventListener("submit", onSubmit, true);
    return () => {
      window.removeEventListener("click", onClick, true);
      window.removeEventListener("auxclick", onClick, true);
      window.removeEventListener("submit", onSubmit, true);
    };
  }, []);

  // `?debug_mode=true` liga o DebugView do GA4 depois do consentimento,
  // sem mudar o HTML do servidor. O gtag chega depois do script, então
  // espera ele aparecer.
  useEffect(() => {
    if (consent !== "granted") return;
    if (new URLSearchParams(window.location.search).get("debug_mode") !== "true") return;
    let tries = 0;
    const id = window.setInterval(() => {
      tries += 1;
      if (window.gtag) {
        window.gtag("config", GA_ID, { debug_mode: true });
        window.clearInterval(id);
      } else if (tries > 20) {
        window.clearInterval(id);
      }
    }, 250);
    return () => window.clearInterval(id);
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
