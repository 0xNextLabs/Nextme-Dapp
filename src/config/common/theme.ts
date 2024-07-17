import config from '..'
const { themes } = config

export const theme = {
  palette: {
    primary: {
      main: themes.primary,
    },
    success: {
      main: themes.success,
      contrastText: '#fff',
    },
    warning: {
      main: themes.warning,
      contrastText: '#fff',
    },
    error: {
      main: themes.error,
    },
    secondary: {
      main: themes.secondary,
    },
  },
  components: {
    MuiButton: {
      variants: [
        {
          props: { variant: 'contained', color: 'primary' },
          style: {
            color: themes.light,
            backgroundColor: themes.primary,
            ':hover': {
              opacity: 0.999,
              backgroundColor: themes.primary,
            },
          },
        },
      ],
      styleOverrides: {
        root: {
          textTransform: 'initial',
        },
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 768,
      lg: 1024,
      xl: 1536,
    },
  },
}
