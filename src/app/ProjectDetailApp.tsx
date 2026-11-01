import { Cursor } from "./components/Cursor";
import { EnvironmentLayer } from "./components/EnvironmentLayer";
import { AIBackground } from "./components/AIBackground";
import { HologramInterface } from "./components/HologramInterface";
import { ProjectPage } from "./components/ProjectPage";
import { useIsMobile } from "../hooks/useMediaQuery";
import { LazyMotion, domAnimation } from "motion/react";

export default function ProjectDetailApp({ slug }: Readonly<{ slug: string }>) {
  const isMobile = useIsMobile();

  const backHref = (() => {
    if (typeof window === "undefined") return "/#projects";
    const from = new URLSearchParams(window.location.search).get("from");
    if (from === "featured") return "/#featured";
    if (from === "research") return "/#projects";
    return "/#projects";
  })();

  return (
    <div className="spatial-scene" style={{ cursor: isMobile ? "auto" : "none" }}>
      <EnvironmentLayer />
      <AIBackground />
      <Cursor />
      <HologramInterface>
        <LazyMotion features={domAnimation}>
          <ProjectPage slug={slug} backHref={backHref} />
        </LazyMotion>
      </HologramInterface>
    </div>
  );
}
