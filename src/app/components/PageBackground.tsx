import { useEffect } from "react";
import { AIBackground } from "./AIBackground";
import { Cursor } from "./Cursor";
import { useIsMobile } from "../../hooks/useMediaQuery";

export function PageBackground() {
  const isMobile = useIsMobile();

  // Hide default cursor on desktop so the custom cursor shows
  useEffect(() => {
    if (!isMobile) {
      document.body.style.cursor = "none";
      return () => { document.body.style.cursor = ""; };
    }
  }, [isMobile]);

  return (
    <>
      <AIBackground />
      {!isMobile && <Cursor />}
    </>
  );
}
