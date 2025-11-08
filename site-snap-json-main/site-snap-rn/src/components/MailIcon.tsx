import React from 'react';
import Svg, { Rect, Path } from 'react-native-svg';

interface MailIconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export const MailIcon: React.FC<MailIconProps> = ({ 
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
      {/* Mail icon from Lucide */}
      <Rect width="20" height="16" x="2" y="4" rx="2" />
      <Path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </Svg>
  );
};

