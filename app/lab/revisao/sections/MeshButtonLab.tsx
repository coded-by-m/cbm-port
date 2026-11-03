"use client";

import type { ComponentType, ReactNode } from "react";
import { MeshButton } from "@/components/ui/MeshButton";
import { cbm } from "@/lib/palette";
import { Item } from "../Item";
import {
  ConceptA,
  ConceptB,
  ConceptC,
  ConceptD,
  ConceptRow,
  ConceptStyles,
  type Size,
} from "../prototipos/MeshButtonConcepts";
import { FillMesh, FillStyles, FillWedge, type Tone } from "../prototipos/FillButtonConcepts";

const CONCEPTS: [string, string, ComponentType<{ label: string; size?: Size }>][] = [
  ["X-A", "Malha que acorda: parada e apagada; acende sob o cursor · ESCOLHIDO", ConceptA],
  ["X-B", "Corte diagonal: canto do logo, varredura vermelha no hover", ConceptB],
  ["X-C", "Triângulo protagonista: avança e deixa contorno-fantasma", ConceptC],
  ["X-D", "Facetas: low-poly, a luz segue o cursor", ConceptD],
];

type FillProps = { label: string; size?: Size; tone?: Tone };
const FILLS: [string, string, ComponentType<FillProps>][] = [
  ["X-E", "Preenchimento em cascata: os triângulos pintam da esquerda para a direita", (p) => <FillMesh {...p} mode="cascata" />],
  ["X-F", "Preenchimento a partir do cursor: espalha do ponto de entrada", (p) => <FillMesh {...p} mode="cursor" />],
  ["X-G", "Triângulo único: cresce do canto inferior esquerdo na diagonal", FillWedge],
];

const Hint = ({ children }: { children: ReactNode }) => (
  <span style={{ fontSize: 12, color: cbm("gray-500") }}>{children}</span>
);

/** Seção X: direções para o novo MeshButton e o botão de preenchimento. */
export function MeshButtonLab() {
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <ConceptStyles />
      <FillStyles />
      <Item id="X-00" name="Atual: MeshButton (referência)" wide>
        <ConceptRow>
          <MeshButton label="Começar meu projeto" />
          <MeshButton label="Ver site ao vivo" className="!px-6 !py-3 !text-xs" />
        </ConceptRow>
      </Item>
      {CONCEPTS.map(([id, name, Concept]) => (
        <Item key={id} id={id} name={name} wide>
          <ConceptRow>
            <Concept label="Começar meu projeto" />
            <Concept label="Ver site ao vivo" size="sm" />
            <Hint>passe o mouse · Tab para foco</Hint>
          </ConceptRow>
        </Item>
      ))}
      {FILLS.map(([id, name, Fill]) => (
        <Item key={id} id={id} name={name} wide>
          <ConceptRow>
            <Fill label="Começar meu projeto" tone="red" />
            <Fill label="Ver site ao vivo" size="sm" tone="red" />
            <Fill label="Ver projetos" tone="white" />
            <Fill label="Saiba mais" size="sm" tone="white" />
            <Hint>vermelho = ação principal · off-white = secundária</Hint>
          </ConceptRow>
        </Item>
      ))}
    </div>
  );
}
