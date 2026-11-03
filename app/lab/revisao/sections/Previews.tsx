"use client";

import { itemsOf, type PreviewGroup } from "../registry";
import { Item } from "../Item";

/** Um grupo de previews do design-sync, uma moldura por variante. */
export function Previews({ group }: { group: PreviewGroup }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 420px), 1fr))",
        gap: 16,
        alignItems: "start",
      }}
    >
      {itemsOf(group).map(({ id, name, wide, Render }) => (
        <Item key={id} id={id} name={name} wide={wide}>
          <Render />
        </Item>
      ))}
    </div>
  );
}
