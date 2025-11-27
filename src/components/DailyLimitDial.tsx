import { useState, useRef, useEffect } from "react";

interface DialProps {
    value: number; // minutes
    onChange: (v: number) => void;
    max?: number; // default 600 minutes
}

const clamp = (v: number, min: number, max: number) =>
    Math.min(max, Math.max(min, v));

export const DailyLimitDial = ({ value, onChange, max = 600 }: DialProps) => {
    const radius = 70;
    const stroke = 11;
    const circumference = 2 * Math.PI * radius;

    const svgRef = useRef<SVGSVGElement | null>(null);
    const [dragging, setDragging] = useState(false);

    // Convert angle → minutes
    const angleToValue = (angle: number) => {
        const fraction = angle / 360;
        return clamp(Math.round(fraction * max), 0, max);
    };

    // Convert minutes → stroke offset
    const valueToOffset = (v: number) => {
        const fraction = v / max;
        return circumference - fraction * circumference;
    };

    // Get angle from mouse position
    const getAngleFromEvent = (e: MouseEvent | TouchEvent) => {
        const svg = svgRef.current;
        if (!svg) return 0;

        const rect = svg.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;

        const x = "touches" in e ? e.touches[0].clientX : e.clientX;
        const y = "touches" in e ? e.touches[0].clientY : e.clientY;

        // Calculate angle from center (0° at top)
        const angle = Math.atan2(y - cy, x - cx) * (180 / Math.PI) + 90;

        return (angle + 360) % 360; // normalize
    };

    const startDrag = (e: any) => {
        e.preventDefault();
        setDragging(true);
    };

    const moveDrag = (e: any) => {
        if (!dragging) return;
        const angle = getAngleFromEvent(e);
        const newValue = angleToValue(angle);
        onChange(newValue);
    };

    const stopDrag = () => setDragging(false);

    useEffect(() => {
        if (dragging) {
            window.addEventListener("mousemove", moveDrag);
            window.addEventListener("mouseup", stopDrag);
            window.addEventListener("touchmove", moveDrag);
            window.addEventListener("touchend", stopDrag);
        }
        return () => {
            window.removeEventListener("mousemove", moveDrag);
            window.removeEventListener("mouseup", stopDrag);
            window.removeEventListener("touchmove", moveDrag);
            window.removeEventListener("touchend", stopDrag);
        };
    }, [dragging]);

    const offset = valueToOffset(value);

    return (
        <div className="flex flex-col items-center">
            <svg
                ref={svgRef}
                width={160}
                height={160}
                onMouseDown={startDrag}
                onTouchStart={startDrag}
                className="cursor-pointer select-none"
            >
                {/* Background ring */}
                <circle
                    cx="80"
                    cy="80"
                    r={radius}
                    stroke="hsl(var(--muted))"
                    strokeWidth={stroke}
                    fill="none"
                />

                {/* Active arc */}
                <circle
                    cx="80"
                    cy="80"
                    r={radius}
                    stroke="hsl(200 90% 50%)"
                    strokeWidth={stroke}
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    transform="rotate(-90 80 80)"
                    style={{
                        transition: dragging
                            ? "none"
                            : "stroke-dashoffset 0.2s",
                    }}
                />
            </svg>

            <p className="text-3xl font-semibold mt-3">{value}m</p>

            <p className="text-xs text-muted-foreground">Daily limit</p>
        </div>
    );
};
