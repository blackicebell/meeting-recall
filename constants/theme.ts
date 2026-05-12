export const theme = {
  colors: {
    primary: "#4b7de6",
    primarySoft: "#eef3ff",
    recording: "#ef233c",
    background: "#ffffff",
    surface: "#ffffff",
    text: "#101318",
    textMuted: "#6f7785",
    textSubtle: "#9aa1ad",
    divider: "#dfe3e8",
    black: "#101318",
    white: "#ffffff"
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    "2xl": 48,
    "3xl": 64
  },
  typography: {
    display: {
      fontSize: 60,
      lineHeight: 68,
      fontWeight: "300" as const
    },
    title: {
      fontSize: 34,
      lineHeight: 42,
      fontWeight: "700" as const
    },
    section: {
      fontSize: 13,
      lineHeight: 18,
      fontWeight: "700" as const,
      letterSpacing: 3
    },
    body: {
      fontSize: 18,
      lineHeight: 28,
      fontWeight: "400" as const
    },
    label: {
      fontSize: 16,
      lineHeight: 22,
      fontWeight: "700" as const
    },
    metadata: {
      fontSize: 15,
      lineHeight: 22,
      fontWeight: "400" as const
    }
  },
  radii: {
    sm: 6,
    md: 8,
    lg: 16,
    pill: 999
  }
};

export type Theme = typeof theme;
