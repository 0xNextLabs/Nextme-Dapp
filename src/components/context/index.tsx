import { ReactNode, FC } from 'react'
import { Provider } from 'react-redux'
import { CacheProvider } from '@emotion/react'
import createCache from '@emotion/cache'
import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist'
import { createTheme, ThemeProvider, StyledEngineProvider } from '@mui/material'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RainbowKitProvider, darkTheme, getDefaultConfig } from '@rainbow-me/rainbowkit'
import { WagmiProvider } from 'wagmi'
import { ContextProvider } from '@/components/context/solana'
import { ModalProvider, modals } from '@/components/nm-modal/ModalContext'
import { CropModalProvider, cropModals } from '@/components/nm-crop/CropModalContext'
import { StudioContextProvider } from '@/components/context/studio'
import { TempContextProvider } from '@/components/context/temp'
import { CacheRequestProvider } from '@/lib/api/cache'
import { ProgressContainerProvider } from '@/components/widgets/progress'
import { SnackbarProvider } from '@/components/context/snackbar'
import { wagmiConfig } from '@/lib/chains'
import { store } from '@/lib/store'

import config from '@/config'

const { prefix, themes } = config

let persistor = persistStore(store)

const cache = createCache({
  key: `${prefix}-style`,
  prepend: true,
})

const rootElement = () => document.getElementById('__next')

const theme = createTheme({
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
    MuiPopover: {
      defaultProps: {
        container: rootElement,
      },
    },
    MuiPopper: {
      defaultProps: {
        container: rootElement,
      },
    },
    MuiModal: {
      defaultProps: {
        container: rootElement,
      },
    },
    MuiDrawer: {
      defaultProps: {
        container: rootElement,
      },
    },
    MuiSwipeableDrawer: {
      defaultProps: {
        container: rootElement,
      },
    },
    // ...
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
})

const walletConfig = getDefaultConfig(wagmiConfig)

const queryClient = new QueryClient()

export const GlobalContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <CacheProvider value={cache}>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <WagmiProvider config={walletConfig}>
            <QueryClientProvider client={queryClient}>
              <RainbowKitProvider
                showRecentTransactions
                theme={darkTheme({
                  accentColor: themes.primary,
                  overlayBlur: 'small',
                })}
              >
                <ContextProvider>
                  <Provider store={store}>
                    <PersistGate loading={null} persistor={persistor}>
                      <ProgressContainerProvider>
                        <TempContextProvider>
                          <CacheRequestProvider>
                            <StudioContextProvider>
                              <ModalProvider modals={modals}>
                                <SnackbarProvider>
                                  <CropModalProvider cropModals={cropModals}>{children}</CropModalProvider>
                                </SnackbarProvider>
                              </ModalProvider>
                            </StudioContextProvider>
                          </CacheRequestProvider>
                        </TempContextProvider>
                      </ProgressContainerProvider>
                    </PersistGate>
                  </Provider>
                </ContextProvider>
              </RainbowKitProvider>
            </QueryClientProvider>
          </WagmiProvider>
        </ThemeProvider>
      </StyledEngineProvider>
    </CacheProvider>
  )
}
