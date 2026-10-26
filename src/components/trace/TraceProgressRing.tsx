import { GUIDE_COLORS } from '@/lib/trace/traceTheme';

const R = 22;
const CIRCUMFERENCE = 2 * Math.PI * R;

interface TraceProgressRingProps {
  progress: number;
  color: string;
  side?: 'left' | 'right';
}

/**
 * The percentage ring in the corner of the trace paper — the right corner
 * by default; Arabic paper, whose margin runs down the right, puts it left.
 */
export default function TraceProgressRing({ progress, color, side = 'right' }: TraceProgressRingProps) {
  return (
    <div
      className={`absolute top-3 pointer-events-none ${
        side === 'left' ? 'left-3' : 'right-3'
      }`}
    >
      <div className="relative w-14 h-14">
        <svg viewBox="0 0 52 52" className="w-full h-full -rotate-90">
          <circle
            cx="26"
            cy="26"
            r={R}
            fill="none"
            stroke={GUIDE_COLORS.road}
            strokeWidth="6"
          />
          <circle
            cx="26"
            cy="26"
            r={R}
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={CIRCUMFERENCE * (1 - progress)}
            style={{ transition: 'stroke-dashoffset 0.1s linear' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-xs font-extrabold text-slate-500 tabular-nums">
          {Math.round(progress * 100)}%
        </div>
      </div>
    </div>
  );
}
