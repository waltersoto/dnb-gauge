
import React from 'react'; 

interface GaugeProps {
    value: number;
    min: number;
    max: number;
    numTicks?: number;
}

const Gauge: React.FC<GaugeProps> = ({ value, min, max, numTicks = 11 }) => {
    // Dimensions and constants
    const width = 200;
    const height = 100;
    const centerX = width / 2;
    const centerY = height;
    const radius = 80;
    const gaugeAngleRange = 180; // Full semi-circle

    // Convert value to angle within gauge range
    const range = max - min;
    const valuePercentage = (value - min) / range;
    const needleAngle = (valuePercentage * gaugeAngleRange) - 90; // Correctly align the needle with the ticks

    // Needle style with transition
    const needleStyle: React.CSSProperties = {
        transformOrigin: `${centerX}px ${centerY}px`,
        transform: `rotate(${needleAngle}deg)`,
        transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        strokeWidth: 2,
        stroke: 'tomato'
    };

    // Function to calculate tick position
    const calculateTickPosition = (tickValue: number) => {
        const tickPercentage = (tickValue - min) / range;
        const tickAngle = (tickPercentage * gaugeAngleRange) - 90;

        const svgTickAngle = 90 - tickAngle;

        const innerTickRadius = radius * 0.85;
        const outerTickRadius = radius * 0.95;

        return {
            x1: centerX + innerTickRadius * Math.cos(svgTickAngle * Math.PI / 180),
            y1: centerY - innerTickRadius * Math.sin(svgTickAngle * Math.PI / 180),
            x2: centerX + outerTickRadius * Math.cos(svgTickAngle * Math.PI / 180),
            y2: centerY - outerTickRadius * Math.sin(svgTickAngle * Math.PI / 180)
        };
    };

    return (
        <div style={{ textAlign: 'center' }}>
            <svg width={width} height={height}>
                {/* Arc */}
                <path
                    d={`M ${centerX - radius} ${centerY} A ${radius} ${radius} 0 0 1 ${centerX + radius} ${centerY}`}
                    fill="none"
                    stroke="#aaa"
                    strokeWidth="4"
                />

                {/* Ticks */}
                {Array.from({ length: numTicks }).map((_, index) => {
                    const tickValue = min + (range / (numTicks - 1)) * index;
                    const { x1, y1, x2, y2 } = calculateTickPosition(tickValue);

                    let strokeColor = '#4CAF50';
                    if (index > 3 && index < 7) {
                        strokeColor = '#CDDC39';
                    } else if (index >= 7) {
                        strokeColor = '#D84315';
                    }

                    return (
                        <line key={index} x1={x1} y1={y1} x2={x2} y2={y2} stroke={strokeColor} strokeWidth="1" />
                    );
                })}

                {/* Pointer (needle) */}
                <line
                    x1={centerX}
                    y1={centerY}
                    x2={centerX}
                    y2={centerY - radius * 0.8}
                    style={needleStyle}
                />
            </svg> 
            <div>
                <div style={{ textAlign: 'center' }}>{value}</div>
            </div>
        </div>
    );
};

export default Gauge;
