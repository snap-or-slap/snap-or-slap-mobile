import React from 'react';
import type { ColorValue } from 'react-native';
import Svg, { Path } from 'react-native-svg';

type WaveBackgroundSvgProps = {
  width: number;
  height: number;
  color?: ColorValue;
  secondaryColor?: ColorValue;
  testID?: string;
};

export function WaveBackgroundSvg({
  width,
  height,
  color, // will be passed from AnimatedWaveBackground
  secondaryColor,
  testID,
}: WaveBackgroundSvgProps) {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 2407 219"
      fill="none"
      preserveAspectRatio="none"
      testID={testID}
    >
      <Path
        d="M1881.14 131.731C1737.91 19.7272 1659.37 201.351 1507.01 201.351C1354.65 201.351 1359.29 126.098 1180.72 126.098C1002.16 126.098 980.193 201.351 844.983 201.351C709.772 201.351 658.258 126.098 532.885 126.098C407.511 126.098 376.842 201.351 253.887 201.351C130.932 201.351 1.10238e-05 126.098 1.10238e-05 126.098L0 0.000240896L2406.45 0C2406.45 0 2406.45 62.8031 2406.45 126.098C2406.45 189.393 2249.58 249.275 2121.75 201.35C1993.92 153.426 2024.36 243.736 1881.14 131.731Z"
        fill={color}
      />
    </Svg>
  );
}