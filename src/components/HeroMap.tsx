"use client";

import { useEffect, useRef, useState } from "react";

// Example booking animation: the helper rides between stops while
// updates drop into the family's feed.

const STOPS = [0, 0.1851, 0.3675, 0.528, 1.0];
const MSGS: [string, string][] = [
  ["10:02", "Ravi reached home and picked up the prescription"],
  ["10:41", "Medicines bought · ₹1,240 · bill photo sent"],
  ["11:20", "Blood test report collected and shared"],
  ["11:58", "Vegetables bought · ₹275 · bill photo sent"],
  ["12:42", "Back home · 2 h 40 m used · receipts sent"],
];

export function HeroMap() {
  const routeRef = useRef<SVGPathElement>(null);
  const riderRef = useRef<SVGGElement>(null);
  const [done, setDone] = useState(1); // stops reached, 1..5
  const [feed, setFeed] = useState<number[]>([0]);

  useEffect(() => {
    const route = routeRef.current!;
    const rider = riderRef.current!;
    const L = route.getTotalLength();
    route.style.strokeDasharray = String(L);
    const place = (f: number) => {
      const p = route.getPointAtLength(f * L);
      rider.setAttribute("transform", `translate(${p.x},${p.y})`);
      route.style.strokeDashoffset = String(L * (1 - f));
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      place(1);
      setDone(5);
      setFeed([4, 3, 2]);
      return;
    }

    let seg = 0, t0 = 0, pausing = true, pauseStart = performance.now(), raf = 0;
    place(0);
    const tick = (now: number) => {
      if (pausing) {
        if (now - pauseStart > (seg === 4 ? 3200 : 1200)) {
          pausing = false;
          t0 = now;
          if (seg === 4) {
            seg = 0;
            place(0);
            setDone(1);
            setFeed([0]);
            pausing = true;
            pauseStart = now;
          }
        }
      } else {
        const legMs = 2400 * Math.max(1, (STOPS[seg + 1] - STOPS[seg]) / 0.2);
        const k = Math.min(1, (now - t0) / legMs);
        const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
        place(STOPS[seg] + (STOPS[seg + 1] - STOPS[seg]) * e);
        if (k === 1) {
          seg++;
          const reached = seg;
          setDone(reached + 1);
          setFeed((f) => [reached, ...f].slice(0, 3));
          pausing = true;
          pauseStart = now;
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const stops = [
    { cx: 80, cy: 240, label: "Home", tx: 104, ty: 246 },
    { cx: 300, cy: 95, label: "Pharmacy", tx: 262, ty: 138 },
    { cx: 540, cy: 205, label: "Hospital", tx: 505, ty: 248 },
    { cx: 720, cy: 62, label: "Market", tx: 650, ty: 104 },
  ];

  return (
    <div
      className="live"
      role="img"
      aria-label="Example booking: a helper picks up a prescription from home, buys medicines, collects reports at the hospital, buys vegetables and sends updates to the family."
    >
      <div className="live-top">
        <b>Amma’s errands · 3 hrs booked</b>
        <span className="pill">Live</span>
      </div>
      <svg viewBox="0 0 800 300" aria-hidden="true">
        <path className="road" d="M80 240 C 180 240, 200 100, 300 95 S 460 215, 540 205 S 690 70, 720 62" />
        <path className="road" d="M720 62 C 600 20, 300 10, 80 240" style={{ strokeWidth: 7, opacity: 0.7 }} />
        <path ref={routeRef} className="trail" d="M80 240 C 180 240, 200 100, 300 95 S 460 215, 540 205 S 690 70, 720 62 C 600 20, 300 10, 80 240" />
        {stops.map((s, i) => (
          <g key={s.label} className={"stop" + (i < done ? " done" : "")}>
            <circle cx={s.cx} cy={s.cy} r="14" />
            <text x={s.tx} y={s.ty}>{s.label}</text>
          </g>
        ))}
        <g ref={riderRef} className="rider" transform="translate(80,240)">
          <circle r="16" />
          <text x="-11" y="7" fontSize="19">🛵</text>
        </g>
      </svg>
      <ul className="feed" aria-hidden="true">
        {feed.map((i) => (
          <li key={i}>
            <time>{MSGS[i][0]}</time>
            <span className="msg">{MSGS[i][1]}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
