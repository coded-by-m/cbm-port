// Substituto de @/lib/analytics para o bundle do design system.
//
// Dois motivos, ambos importantes:
//
// 1. O modulo real le process.env.NEXT_PUBLIC_* no escopo do modulo. Fora do
//    Next nao existe `process`, e isso derrubava o bundle inteiro na carga —
//    nao so o LpCta, que e quem importa trackLead.
// 2. IDs de GA e do pixel da Meta nao tem o que fazer num design system: todo
//    design gerado pelo agente carrega este bundle, e nenhum deles deveria
//    disparar evento na conta de analytics do estudio.
//
// A superficie exportada e a mesma; o que sai daqui nao rastreia nada.

export const GA_ID = "";
export const META_PIXEL_ID = "";
export const CONSENT_KEY = "cbm-cookie-consent";
export const CONSENT_EVENT = "cbm-consent-change";

export type ConsentValue = "granted" | "denied";

export function getConsent(): ConsentValue | null {
  return null;
}

export function setConsent(_value: ConsentValue) {}

export function trackLead(_source: string) {}
