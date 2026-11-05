import { chromeCopy } from '../../content/portfolio/chrome';
import { profile } from '../../content/portfolio/profile';
import airports from '../../content/portfolio/airports.json';
import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";

const BLR_TZ = profile.homeTimeZone;

type Airport = { code: string; tz: string };

const AIRPORTS: Airport[] = airports;

function useClockTime(tz: string) {
  const [time, setTime] = useState("--:--:--");

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone: tz,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [tz]);

  return time;
}

function ClockRow({ code, tz }: { code: string; tz: string }) {
  const time = useClockTime(tz);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.45rem",
        lineHeight: 1,
      }}
    >
      <MapPin
        size={12}
        strokeWidth={1.8}
        style={{ flexShrink: 0, opacity: 0.7 }}
      />
      <span
        style={{ letterSpacing: "0.04em", opacity: 0.75, fontSize: "0.65rem" }}
      >
        {code}
      </span>
      <span
        style={{ fontVariantNumeric: "tabular-nums", letterSpacing: "0.03em" }}
      >
        {time}
      </span>
    </div>
  );
}

export function ClockWidget() {
  const [userAirport, setUserAirport] = useState<Airport | null>(null);

  useEffect(() => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setUserAirport(AIRPORTS.find((airport) => airport.tz === tz) ?? null);
  }, []);

  const userTz =
    userAirport?.tz ?? Intl.DateTimeFormat().resolvedOptions().timeZone;
  const userCode = userAirport?.code ?? chromeCopy.runtime.unknownAirport;
  const sameAsBLR = userAirport?.code === profile.homeAirport;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "1.25rem",
        left: "1.25rem",
        zIndex: 49,
        color: "white",
        fontFamily: "'SF Mono', 'Fira Mono', 'Consolas', monospace",
        fontSize: "0.82rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.45rem",
        pointerEvents: "none",
        userSelect: "none",
      }}
    >
      <ClockRow code={profile.homeAirport} tz={BLR_TZ} />
      {!sameAsBLR && <ClockRow code={userCode} tz={userTz} />}
    </div>
  );
}
