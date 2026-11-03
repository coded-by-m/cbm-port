"use client";

import type { ComponentType } from "react";
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

const CONCEPTS: [string, string, ComponentType<{ label: string; size?: Size }>][] = [
  ["X-A", "Malha que acorda: parada e apagada; acende sob o cursor", ConceptA],
  ["X-B", "Corte diagonal: canto do logo, varredura vermelha no hover", ConceptB],
  ["X-C", "Triângulo protagonista: avança e deixa contorno-fantasma", ConceptC],
  ["X-D", "Facetas: low-poly, a luz segue o cursor", ConceptD],
];

/** Seção X: direções para o novo MeshButton, ao lado do atual. */
export function MeshButtonLab() {
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <ConceptStyles />
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
            <span style={{ fontSize: 12, color: cbm("gray-500") }}>passe o mouse · Tab para foco</span>
          </ConceptRow>
        </Item>
      ))}
    </div>
  );
}
