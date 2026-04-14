'use client';

interface Props {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function ArchitectureScoreGauge({ score, size = 'md', showLabel = false }: Props) {
  const radius = size === 'sm' ? 18 : size === 'md' ? 28 : 40;
  const strokeW = size === 'sm' ? 3 : 4;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (score / 100) * circumference;
  const svgSize = (radius + strokeW) * 2 + 4;

  const color =
    score >= 80 ? '#4ADE80' :
    score >= 60 ? '#FACC15' : '#F87171';

  const textSize = size === 'sm' ? '8px' : size === 'md' ? '11px' : '16px';

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={svgSize} height={svgSize} className="rotate-[-90deg]">
        {/* Background track */}
        <circle
          cx={svgSize / 2} cy={svgSize / 2} r={radius}
          fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={strokeW}
        />
        {/* Score arc */}
        <circle
          cx={svgSize / 2} cy={svgSize / 2} r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeW}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          style={{
            transition: 'stroke-dashoffset 0.8s ease-out, stroke 0.3s',
            filter: `drop-shadow(0 0 4px ${color}60)`,
          }}
        />
        {/* Score text */}
        <text
          x="50%" y="50%"
          dominantBaseline="middle" textAnchor="middle"
          fill={color}
          fontSize={textSize}
          fontWeight="700"
          style={{ transform: 'rotate(90deg)', transformOrigin: '50% 50%' }}
        >
          {score}
        </text>
      </svg>
      {showLabel && (
        <div className="text-xs text-text-secondary text-center">
          Architecture Score
        </div>
      )}
    </div>
  );
}
