/**
 * Métrica vertical do StrokeText, em unidades do próprio corpo.
 *
 * Mora fora do componente de propósito: o StrokeText é `"use client"`, e uma
 * constante exportada de lá chega como referência de cliente (undefined) pra
 * quem importa de um server component. Quem só precisa do número — o Hero,
 * pra acertar o entrelinha — importa daqui.
 */

/** Acima da linha de base. Cobre a ascendente da Panchang com folga. */
export const ASCENT = 0.88;

/** Abaixo da linha de base. Cobre o rabo do "y". */
export const DESCENT = 0.26;

/** Altura da caixa de uma linha, em `em`. */
export const STROKE_LINE_HEIGHT = ASCENT + DESCENT;
