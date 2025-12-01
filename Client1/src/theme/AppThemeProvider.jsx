import { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';

import palette from './palette.js';

const AppThemeProvider = ({ children }) => {
  const mode = useSelector((state) => state.theme?.mode || 'light');
  const isDark = mode === 'dark';

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }
    document.documentElement.dataset.theme = mode;
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('folkslet-theme', mode);
      const computed = getComputedStyle(document.documentElement);
      document.body.style.backgroundColor = computed.getPropertyValue('--color-background').trim();
      document.body.style.color = computed.getPropertyValue('--color-text-base').trim();
    }
  }, [mode]);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: palette.primary,
            contrastText: palette.onPrimary,
          },
          secondary: {
            main: palette.secondary,
            contrastText: palette.onSecondary,
          },
          background: {
            default: isDark ? palette.background.dark : palette.background.light,
            paper: isDark ? palette.surface.dark : palette.surface.light,
          },
          text: {
            primary: isDark ? palette.text.dark : palette.text.light,
            secondary: isDark ? palette.muted.dark : palette.muted.light,
          },
          divider: isDark ? palette.border.dark : palette.border.light,
        },
        typography: {
          fontFamily: 'Inter, system-ui, sans-serif',
        },
        shape: {
          borderRadius: 12,
        },
        components: {
          MuiButton: {
            defaultProps: {
              disableElevation: true,
            },
            styleOverrides: {
              root: {
                textTransform: 'none',
                fontWeight: 600,
              },
            },
          },
        },
      }),
    [isDark, mode],
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

export default AppThemeProvider;

