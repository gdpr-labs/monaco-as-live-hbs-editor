'use client';

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#60a5fa', // blue-400
      light: '#93c5fd', // blue-300
      dark: '#3b82f6', // blue-500
    },
    secondary: {
      main: '#34d399', // emerald-400
      light: '#6ee7b7', // emerald-300
      dark: '#10b981', // emerald-500
    },
    background: {
      default: '#0f172a', // slate-900
      paper: '#1e293b', // slate-800
    },
    text: {
      primary: '#f1f5f9', // slate-100
      secondary: '#94a3b8', // slate-400
      disabled: '#64748b', // slate-500
    },
    error: {
      main: '#f87171', // red-400
      light: '#fca5a5', // red-300
      dark: '#ef4444', // red-500
    },
    warning: {
      main: '#fbbf24', // amber-400
      light: '#fcd34d', // amber-300
      dark: '#f59e0b', // amber-500
    },
    success: {
      main: '#34d399', // emerald-400
      light: '#6ee7b7', // emerald-300
      dark: '#10b981', // emerald-500
    },
    info: {
      main: '#38bdf8', // sky-400
      light: '#7dd3fc', // sky-300
      dark: '#0ea5e9', // sky-500
    },
    divider: 'rgba(148, 163, 184, 0.12)', // slate-400 with opacity
  },
  typography: {
    fontFamily: 'var(--font-geist-sans), -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    fontFamilyMonospace: 'var(--font-geist-mono), "Courier New", monospace',
    h3: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h6: {
      fontWeight: 600,
    },
    overline: {
      fontWeight: 600,
      letterSpacing: '0.1em',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'uppercase',
          fontWeight: 600,
          letterSpacing: '0.05em',
          borderRadius: '9999px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '9999px',
          fontWeight: 500,
        },
      },
    },
  },
});

export default theme;
