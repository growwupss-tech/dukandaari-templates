import React from 'react';
import Svg, { Line, Polyline } from 'react-native-svg';

interface ArrowRightIconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export const ArrowRightIcon: React.FC<ArrowRightIconProps> = ({ 
  size = 24, 
  color = '#000000',
  strokeWidth = 2 
}) => {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* ArrowRight icon from Lucide */}
      <Line x1="5" y1="12" x2="19" y2="12" />
      <Polyline points="12 5 19 12 12 19" />
    </Svg>
  );
};

