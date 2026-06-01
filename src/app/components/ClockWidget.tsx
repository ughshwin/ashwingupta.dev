import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";

const BLR_TZ = "Asia/Kolkata";

type Airport = { code: string; lat: number; lng: number; tz: string };

const AIRPORTS: Airport[] = [
  // India
  { code: "BLR", lat: 13.1986, lng: 77.7066, tz: "Asia/Kolkata" },
  { code: "DEL", lat: 28.5562, lng: 77.1, tz: "Asia/Kolkata" },
  { code: "BOM", lat: 19.0896, lng: 72.8656, tz: "Asia/Kolkata" },
  { code: "MAA", lat: 12.9941, lng: 80.1709, tz: "Asia/Kolkata" },
  { code: "HYD", lat: 17.2403, lng: 78.4294, tz: "Asia/Kolkata" },
  { code: "CCU", lat: 22.6547, lng: 88.4467, tz: "Asia/Kolkata" },
  { code: "PNQ", lat: 18.5822, lng: 73.9197, tz: "Asia/Kolkata" },
  { code: "AMD", lat: 23.0772, lng: 72.6347, tz: "Asia/Kolkata" },
  { code: "JAI", lat: 26.8242, lng: 75.8122, tz: "Asia/Kolkata" },
  { code: "LKO", lat: 26.7606, lng: 80.8893, tz: "Asia/Kolkata" },
  { code: "GOI", lat: 15.3808, lng: 73.8314, tz: "Asia/Kolkata" },
  { code: "COK", lat: 10.152, lng: 76.4019, tz: "Asia/Kolkata" },
  { code: "TRV", lat: 8.4821, lng: 76.9201, tz: "Asia/Kolkata" },
  { code: "IXC", lat: 30.6735, lng: 76.7885, tz: "Asia/Kolkata" },
  { code: "PAT", lat: 25.5913, lng: 85.0877, tz: "Asia/Kolkata" },
  { code: "BHO", lat: 23.2875, lng: 77.3374, tz: "Asia/Kolkata" },
  { code: "NAG", lat: 21.0922, lng: 79.047, tz: "Asia/Kolkata" },
  { code: "SXR", lat: 33.9871, lng: 74.7742, tz: "Asia/Kolkata" },
  // South Asia
  { code: "CMB", lat: 7.1808, lng: 79.8841, tz: "Asia/Colombo" },
  { code: "DAC", lat: 23.8433, lng: 90.3978, tz: "Asia/Dhaka" },
  { code: "KTM", lat: 27.6966, lng: 85.3591, tz: "Asia/Kathmandu" },
  { code: "KHI", lat: 24.9065, lng: 67.1608, tz: "Asia/Karachi" },
  { code: "LHE", lat: 31.5216, lng: 74.4036, tz: "Asia/Karachi" },
  // Middle East
  { code: "DXB", lat: 25.2532, lng: 55.3657, tz: "Asia/Dubai" },
  { code: "AUH", lat: 24.433, lng: 54.6511, tz: "Asia/Dubai" },
  { code: "DOH", lat: 25.2731, lng: 51.6082, tz: "Asia/Qatar" },
  { code: "RUH", lat: 24.9578, lng: 46.6989, tz: "Asia/Riyadh" },
  { code: "KWI", lat: 29.2267, lng: 47.9689, tz: "Asia/Kuwait" },
  { code: "BAH", lat: 26.2708, lng: 50.6336, tz: "Asia/Bahrain" },
  { code: "MCT", lat: 23.5933, lng: 58.2844, tz: "Asia/Muscat" },
  { code: "TLV", lat: 32.0114, lng: 34.8867, tz: "Asia/Jerusalem" },
  { code: "IST", lat: 41.2753, lng: 28.7519, tz: "Europe/Istanbul" },
  { code: "AMM", lat: 31.7226, lng: 35.9932, tz: "Asia/Amman" },
  // Southeast Asia
  { code: "SIN", lat: 1.3644, lng: 103.9915, tz: "Asia/Singapore" },
  { code: "KUL", lat: 2.7456, lng: 101.7099, tz: "Asia/Kuala_Lumpur" },
  { code: "BKK", lat: 13.69, lng: 100.7501, tz: "Asia/Bangkok" },
  { code: "CGK", lat: -6.1256, lng: 106.6559, tz: "Asia/Jakarta" },
  { code: "MNL", lat: 14.5086, lng: 121.0194, tz: "Asia/Manila" },
  { code: "SGN", lat: 10.8188, lng: 106.652, tz: "Asia/Ho_Chi_Minh" },
  { code: "HAN", lat: 21.2187, lng: 105.8047, tz: "Asia/Bangkok" },
  { code: "RGN", lat: 16.9073, lng: 96.1332, tz: "Asia/Rangoon" },
  // East Asia
  { code: "HKG", lat: 22.308, lng: 113.9185, tz: "Asia/Hong_Kong" },
  { code: "PVG", lat: 31.1443, lng: 121.8083, tz: "Asia/Shanghai" },
  { code: "PEK", lat: 40.0801, lng: 116.5846, tz: "Asia/Shanghai" },
  { code: "CAN", lat: 23.3924, lng: 113.299, tz: "Asia/Shanghai" },
  { code: "CTU", lat: 30.5785, lng: 103.9469, tz: "Asia/Shanghai" },
  { code: "ICN", lat: 37.4691, lng: 126.4505, tz: "Asia/Seoul" },
  { code: "NRT", lat: 35.772, lng: 140.3929, tz: "Asia/Tokyo" },
  { code: "KIX", lat: 34.4348, lng: 135.2441, tz: "Asia/Tokyo" },
  // Oceania
  { code: "SYD", lat: -33.9399, lng: 151.1753, tz: "Australia/Sydney" },
  { code: "MEL", lat: -37.669, lng: 144.841, tz: "Australia/Melbourne" },
  { code: "BNE", lat: -27.3842, lng: 153.1175, tz: "Australia/Brisbane" },
  { code: "PER", lat: -31.9403, lng: 115.9669, tz: "Australia/Perth" },
  { code: "AKL", lat: -37.0082, lng: 174.7917, tz: "Pacific/Auckland" },
  // Europe
  { code: "LHR", lat: 51.47, lng: -0.4543, tz: "Europe/London" },
  { code: "CDG", lat: 49.0097, lng: 2.5479, tz: "Europe/Paris" },
  { code: "FRA", lat: 50.0379, lng: 8.5622, tz: "Europe/Berlin" },
  { code: "AMS", lat: 52.3105, lng: 4.7683, tz: "Europe/Amsterdam" },
  { code: "MAD", lat: 40.4983, lng: -3.5676, tz: "Europe/Madrid" },
  { code: "BCN", lat: 41.2971, lng: 2.0785, tz: "Europe/Madrid" },
  { code: "FCO", lat: 41.8003, lng: 12.2389, tz: "Europe/Rome" },
  { code: "MXP", lat: 45.6306, lng: 8.7231, tz: "Europe/Rome" },
  { code: "ZRH", lat: 47.4582, lng: 8.5555, tz: "Europe/Zurich" },
  { code: "VIE", lat: 48.1103, lng: 16.5697, tz: "Europe/Vienna" },
  { code: "BRU", lat: 50.9014, lng: 4.4844, tz: "Europe/Brussels" },
  { code: "MUC", lat: 48.3538, lng: 11.7861, tz: "Europe/Berlin" },
  { code: "ARN", lat: 59.6519, lng: 17.9186, tz: "Europe/Stockholm" },
  { code: "CPH", lat: 55.618, lng: 12.656, tz: "Europe/Copenhagen" },
  { code: "OSL", lat: 60.1939, lng: 11.1004, tz: "Europe/Oslo" },
  { code: "HEL", lat: 60.3172, lng: 24.9633, tz: "Europe/Helsinki" },
  { code: "WAW", lat: 52.1657, lng: 20.9671, tz: "Europe/Warsaw" },
  { code: "PRG", lat: 50.1008, lng: 14.26, tz: "Europe/Prague" },
  { code: "BUD", lat: 47.4298, lng: 19.2611, tz: "Europe/Budapest" },
  { code: "ATH", lat: 37.9364, lng: 23.9445, tz: "Europe/Athens" },
  { code: "LIS", lat: 38.7813, lng: -9.136, tz: "Europe/Lisbon" },
  // Africa
  { code: "CAI", lat: 30.1219, lng: 31.4056, tz: "Africa/Cairo" },
  { code: "JNB", lat: -26.1367, lng: 28.2411, tz: "Africa/Johannesburg" },
  { code: "NBO", lat: -1.3192, lng: 36.9275, tz: "Africa/Nairobi" },
  { code: "LOS", lat: 6.5774, lng: 3.3214, tz: "Africa/Lagos" },
  { code: "CPT", lat: -33.9648, lng: 18.6017, tz: "Africa/Johannesburg" },
  { code: "CMN", lat: 33.3675, lng: -7.5898, tz: "Africa/Casablanca" },
  { code: "ADD", lat: 8.9779, lng: 38.799, tz: "Africa/Addis_Ababa" },
  // Americas - North
  { code: "JFK", lat: 40.6413, lng: -73.7781, tz: "America/New_York" },
  { code: "LAX", lat: 33.9416, lng: -118.4085, tz: "America/Los_Angeles" },
  { code: "ORD", lat: 41.9742, lng: -87.9073, tz: "America/Chicago" },
  { code: "SFO", lat: 37.6213, lng: -122.379, tz: "America/Los_Angeles" },
  { code: "MIA", lat: 25.7959, lng: -80.287, tz: "America/New_York" },
  { code: "SEA", lat: 47.4502, lng: -122.3088, tz: "America/Los_Angeles" },
  { code: "BOS", lat: 42.3656, lng: -71.0096, tz: "America/New_York" },
  { code: "DFW", lat: 32.8998, lng: -97.0403, tz: "America/Chicago" },
  { code: "ATL", lat: 33.6407, lng: -84.4277, tz: "America/New_York" },
  { code: "DEN", lat: 39.8561, lng: -104.6737, tz: "America/Denver" },
  { code: "LAS", lat: 36.084, lng: -115.1537, tz: "America/Los_Angeles" },
  { code: "PHX", lat: 33.4373, lng: -112.0078, tz: "America/Phoenix" },
  { code: "IAD", lat: 38.9531, lng: -77.4565, tz: "America/New_York" },
  { code: "YYZ", lat: 43.6777, lng: -79.6248, tz: "America/Toronto" },
  { code: "YVR", lat: 49.1967, lng: -123.1815, tz: "America/Vancouver" },
  { code: "YUL", lat: 45.4706, lng: -73.7408, tz: "America/Toronto" },
  { code: "MEX", lat: 19.4363, lng: -99.0721, tz: "America/Mexico_City" },
  // Americas - South
  { code: "GRU", lat: -23.4356, lng: -46.4731, tz: "America/Sao_Paulo" },
  { code: "GIG", lat: -22.8099, lng: -43.2506, tz: "America/Sao_Paulo" },
  {
    code: "EZE",
    lat: -34.8222,
    lng: -58.5358,
    tz: "America/Argentina/Buenos_Aires",
  },
  { code: "SCL", lat: -33.3928, lng: -70.7856, tz: "America/Santiago" },
  { code: "BOG", lat: 4.7016, lng: -74.1469, tz: "America/Bogota" },
  { code: "LIM", lat: -12.0219, lng: -77.1143, tz: "America/Lima" },
];

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

function getGMTOffset(tz: string): string {
  const parts = new Intl.DateTimeFormat("en", {
    timeZone: tz,
    timeZoneName: "shortOffset",
  }).formatToParts(new Date());
  return parts.find((p) => p.type === "timeZoneName")?.value ?? "GMT";
}

function useGMTOffset(tz: string) {
  const [offset, setOffset] = useState(() => getGMTOffset(tz));
  useEffect(() => {
    setOffset(getGMTOffset(tz));
    const id = setInterval(() => setOffset(getGMTOffset(tz)), 60_000);
    return () => clearInterval(id);
  }, [tz]);
  return offset;
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
  const offset = useGMTOffset(tz);
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
        style={{ letterSpacing: "0.04em", opacity: 0.45, fontSize: "0.6rem" }}
      >
        {offset}
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
  const userCode = userAirport?.code ?? "···";
  const sameAsBLR = userAirport?.code === "BLR";

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
      <ClockRow code="BLR" tz={BLR_TZ} />
      {!sameAsBLR && <ClockRow code={userCode} tz={userTz} />}
    </div>
  );
}
