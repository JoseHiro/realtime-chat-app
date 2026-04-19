const PHI = 0.618033988749895;
const PETAL_COUNT = 10;

/** 先端にノッチ、縁に微細な「切れ端」風の揺らぎを入れたパス（viewBox 0 0 20 28） */
const PETAL_PATHS = [
  "M10 26.2C3.1 21.4.4 12.8 3.3 7.2 4.4 4.1 8.1 3.1 9.6 5.6 9.85 3.95 10 2.85 10.4 4.05 10.65 2.9 12.3 4.2 13.4 5.1 16.8 6.6 19.1 11.2 17.6 16.1 16.2 21.6 12.6 25.4 10 26.2Z",
  "M10 26C2.8 20.9.2 13.5 2.9 8.1 3.8 5.6 7.2 3.8 9.3 6.1 9.5 4.2 9.95 3.15 10.55 4.35 11.1 3.4 13.8 4.6 15.2 6.4 18.4 9.2 19.6 14.1 17.8 18.5 15.9 23.2 12.4 25.8 10 26Z",
  "M10 26.4C3.6 22.1.8 14.2 3.5 7.8 4.5 5 7.9 3.5 9.4 5.9 9.7 4 10.05 2.7 10.5 3.9 10.75 2.75 12.5 3.8 14.1 5.3 17.2 7.8 18.5 12.4 17 17.2 15.5 22 12.2 25.6 10 26.4Z",
  "M10 25.9C3.4 21.2.6 12.6 3.4 7.4 4.5 4.3 8.3 3.4 9.7 5.7 9.9 3.8 10.1 2.6 10.45 3.85 10.7 2.65 12.8 4.4 14 5.8 17.5 7.2 19 11.8 17.4 16.5 15.8 21.3 12.5 25.2 10 25.9Z",
] as const;

function petalConfig(i: number) {
  const s = (i + 1) * 2654435761;
  const u = (n: number) => ((s >>> n) % 1000) / 1000;
  const hue = 330 + Math.floor(u(23) * 28);
  const sat = 72 + Math.floor(u(29) * 18);
  const lightTop = 93 - Math.floor(u(31) * 6);
  const lightMid = 82 - Math.floor(u(33) * 8);
  const lightDeep = 68 - Math.floor(u(35) * 10);
  const durationS = 11 + u(7) * 10;
  const swayPeriodS = 2.4 + u(13) * 2.2;
  /** 層化 + ジッターで縦位相を均等に散らす（枚数が少なくても画面全体に分布） */
  const stratum = i / PETAL_COUNT;
  const phase = (stratum + u(11) * 0.22 + u(43) * 0.08) % 1;
  const fallDelayS = -phase * durationS * 0.99;
  const swayDelayS = -u(41) * swayPeriodS * 0.98;
  /** 黄金比列 + 小ジッターで横位置のクラスタを避ける */
  const leftPct = 3 + (((i + 1) * PHI) % 1) * 94 + (u(3) - 0.5) * 7;
  const swayPx = (u(47) > 0.5 ? 1 : -1) * (20 + Math.floor(u(48) * 26));
  return {
    leftPct: Math.min(96, Math.max(2, leftPct)),
    durationS,
    fallDelayS,
    swayPeriodS,
    swayDelayS,
    swayPx,
    sizePx: 11 + Math.floor(u(17) * 12),
    rot: Math.floor(u(19) * 360),
    skew: (u(37) - 0.5) * 18,
    pathIndex: i % PETAL_PATHS.length,
    colors: {
      tip: `hsl(${hue} ${sat}% ${lightTop}%)`,
      mid: `hsl(${hue - 2} ${sat + 4}% ${lightMid}%)`,
      base: `hsl(${hue - 6} ${sat - 6}% ${lightDeep}%)`,
      vein: `hsl(${hue} 40% 98% / 0.38)`,
      edge: `hsl(${hue - 12} ${sat}% ${lightDeep - 12}% / 0.22)`,
    },
  };
}

export function SakuraFall() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      {Array.from({ length: PETAL_COUNT }, (_, i) => {
        const c = petalConfig(i);
        const gradId = `sakura-fall-grad-${i}`;
        const w = c.sizePx;
        const h = Math.round(c.sizePx * 1.35);
        const d = PETAL_PATHS[c.pathIndex];
        return (
          <div
            key={i}
            className="sakura-fall-track absolute top-0"
            style={{
              left: `${c.leftPct}%`,
              animationDuration: `${c.durationS}s`,
              animationDelay: `${c.fallDelayS}s`,
            }}
          >
            <div
              className="sakura-fall-sway"
              style={{
                animationDuration: `${c.swayPeriodS}s`,
                animationDelay: `${c.swayDelayS}s`,
                ["--sakura-sway-px" as string]: `${c.swayPx}px`,
              }}
            >
              <svg
                width={w}
                height={h}
                viewBox="0 0 20 28"
                className="sakura-petal-svg overflow-visible opacity-[0.92] dark:opacity-[0.78]"
                style={{
                  transform: `rotate(${c.rot}deg) skewX(${c.skew}deg)`,
                  filter: "drop-shadow(0 1px 1.5px rgb(0 0 0 / 0.12))",
                }}
              >
                <defs>
                  <linearGradient id={gradId} x1="15%" y1="0%" x2="85%" y2="100%">
                    <stop offset="0%" stopColor={c.colors.tip} />
                    <stop offset="42%" stopColor={c.colors.mid} />
                    <stop offset="100%" stopColor={c.colors.base} />
                  </linearGradient>
                </defs>
                <path
                  d={d}
                  fill={`url(#${gradId})`}
                  stroke={c.colors.edge}
                  strokeWidth={0.4}
                  strokeLinejoin="round"
                />
                <path
                  d="M10 23 Q10 14 10 6"
                  fill="none"
                  stroke={c.colors.vein}
                  strokeWidth={0.28}
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        );
      })}
    </div>
  );
}
