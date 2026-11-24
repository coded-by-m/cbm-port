"use client";

import Image from "next/image";
import type React from "react";
import { Outros } from "./Outros";
import { QR_DIVE_BOOT, QrDive } from "./QrDive";
import {
  BbClosing,
  BbHeader,
  BbLead,
  ProjectLinks,
  status,
  type BbOther,
  type BbProject,
} from "./shared";

/**
 * A bobina. Cada site aparece inteiro, de cima a baixo, no fluxo da página:
 * rolar é desenrolar o print. O nome fica preso ao lado (desktop) ou numa
 * faixa no topo (celular) enquanto o site passa. Sem JS de rolagem: a régua
 * de progresso usa scroll-driven animation e, sem suporte, simplesmente não
 * aparece.
 */
export function Bobina({
  projects,
  others,
}: {
  projects: BbProject[];
  others: BbOther[];
}) {
  return (
    <div className="bb bb-roll">
      {/* Decide o mergulho antes do primeiro quadro (ver QrDive). */}
      <script dangerouslySetInnerHTML={{ __html: QR_DIVE_BOOT }} />
      <QrDive />
      <BbHeader />
      <main data-cm-section="projects">
        <BbLead className="bb-roll-lead" />

        {projects.map((p, i) => (
          <section
            key={p.slug}
            className="bb-roll-item"
            data-cm-section={`projeto-${p.slug}`}
          >
            <div className="bb-roll-side">
              <div className="bb-roll-sticky">
                <h2
                  className="bb-roll-name"
                  style={
                    {
                      "--len": Math.max(
                        ...p.title.split(" ").map((w) => w.length),
                      ),
                    } as React.CSSProperties
                  }
                >
                  {p.title}
                </h2>
                <p className="bb-meta">
                  {p.setor} · <span className="bb-keep">{status(p)}</span>
                </p>
                <p className="bb-roll-line">{p.line}</p>
                <ProjectLinks p={p} />
              </div>
            </div>

            <div className="bb-roll-sheet">
              <div className="bb-roll-bar" aria-hidden>
                <b>{p.title}</b>
                <span>{status(p)}</span>
                <i className="bb-roll-progress" />
              </div>
              <Image
                src={p.tall.src}
                width={p.tall.w}
                height={p.tall.h}
                alt={`Página inicial inteira do site ${p.title}`}
                sizes="(min-width: 960px) 58vw, 100vw"
                quality={80}
                priority={i === 0}
                className="bb-roll-img"
              />
            </div>
          </section>
        ))}

        <Outros others={others} />
      </main>

      <BbClosing />
    </div>
  );
}
