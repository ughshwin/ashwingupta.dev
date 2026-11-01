import { chromeCopy } from '../../content/portfolio/chrome';
import { profile } from '../../content/portfolio/profile';
import airports from '../../content/portfolio/airports.json';
import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";

const BLR_TZ = profile.homeTimeZone;

type Airport = { code: string; lat: number; lng: number; tz: string };

const AIRPORTS: Airport[] = airports;

function haversine(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function nearestAirport(lat: number, lng: number): Airport {
  return AIRPORTS.reduce((best, a) =>
    haversine(lat, lng, a.lat, a.lng) < haversine(lat, lng, best.lat, best.lng)
      ? a
      : best,
  );
}

function useClockTime(tz: string) {
  const [time, setTime] = useState(() =>
    new Intl.DateTimeFormat("en-GB", {
      timeZone: tz,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(new Date()),
  );

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone: tz,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    const tick = () => setTime(fmt.format(new Date()));
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
    if (!navigator.geolocation) {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const match = AIRPORTS.find((a) => a.tz === tz);
      setUserAirport(match ?? null);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setUserAirport(nearestAirport(coords.latitude, coords.longitude));
      },
      () => {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const match = AIRPORTS.find((a) => a.tz === tz);
        setUserAirport(match ?? null);
      },
      { timeout: 6000, maximumAge: 300_000 },
    );
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
