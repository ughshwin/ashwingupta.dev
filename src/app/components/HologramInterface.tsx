import type { ReactNode } from "react";

type HologramInterfaceProps = {
  children: ReactNode;
};

export function HologramInterface({
  children,
}: Readonly<HologramInterfaceProps>) {
  return (
    <div className="hologram-interface">
      <div className="hologram-content">{children}</div>
    </div>
  );
}
