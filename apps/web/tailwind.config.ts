import type { Config } from 'tailwindcss'
import { colors, typography, spacing, borderRadius, shadows, transitions, zIndex } from './src/styles/design-tokens'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    colors,
    fontFamily: typography.fontFamily,
    fontSize: typography.fontSize,
    fontWeight: typography.fontWeight,
    lineHeight: typography.lineHeight,
    spacing,
    borderRadius,
    boxShadow: shadows,
    extend: {
      transitionDuration: transitions.duration,
      transitionTimingFunction: transitions.timing,
      zIndex,
    },
  },
  plugins: [],
}
export default config
