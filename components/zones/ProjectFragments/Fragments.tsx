"use client";

import Fragment from "./Fragment";
import { FRAGMENTS, HOST_LAYER } from "./config";

/**
 * Conjunto de fragmentos.
 *
 * Posicionados no plano local da camada hospedeira do terreno (mesmo offset),
 * para que vivam sobre a superfície e compartilhem o fit responsivo da cena.
 */
export default function Fragments() {
  return (
    <group
      position={[HOST_LAYER.xOffset, HOST_LAYER.yOffset, HOST_LAYER.zOffset]}
    >
      {FRAGMENTS.map((fragment, index) => (
        <Fragment key={fragment.id} config={fragment} index={index} />
      ))}
    </group>
  );
}
