// i18n
import 'src/locales/i18n';

// highlight
import 'src/utils/highlight';

// scroll bar
import 'simplebar/src/simplebar.css';

// lightbox
import 'react-image-lightbox/style.css';

// editor
import 'react-quill/dist/quill.snow.css';

import 'public/fonts/index.css';

// slick-carousel
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// lazy image
import 'react-lazy-load-image-component/src/effects/blur.css';
import 'react-lazy-load-image-component/src/effects/opacity.css';
import 'react-lazy-load-image-component/src/effects/black-and-white.css';

import cookie from 'cookie';
import { ReactElement, ReactNode, useEffect } from 'react';
// next
import { NextPage } from 'next';
import Head from 'next/head';
import App, { AppProps, AppContext } from 'next/app';
//
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/lib/integration/react';
// @mui
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
// redux
import { store, persistor } from 'src/redux/store';
// utils
import { SettingsValueProps } from 'src/components/settings/type';
// contexts
import { SettingsProvider } from 'src/contexts/SettingsContext';
import { CollapseDrawerProvider } from 'src/contexts/CollapseDrawerContext';
// theme
import ThemeProvider from 'src/theme';
// components
// import Settings from 'src/components/settings';
import RtlLayout from 'src/components/RtlLayout';
import ProgressBar from 'src/components/ProgressBar';
import ThemeColorPresets from 'src/components/ThemeColorPresets';
import NotistackProvider from 'src/components/NotistackProvider';
import ThemeLocalization from 'src/components/ThemeLocalization';
import MotionLazyContainer from 'src/components/animate/MotionLazyContainer';

import { AuthProvider } from 'src/contexts/JWTContext';
import { SessionProvider } from 'next-auth/react';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

import Analytics from 'analytics';
import segmentPlugin from '@analytics/segment';
// import dynamic from 'next/dynamic';
// import { type } from '@tawk.to/tawk-messenger-react';
// // ----------------------------------------------------------------------
// // import TawkMessengerReact from '@tawk.to/tawk-messenger-react';
// const TawkMessengerReact = dynamic<type>(
//   () => import('@tawk.to/tawk-messenger-react')
// );

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

interface MyAppProps extends AppProps {
  Component: NextPageWithLayout;
}

export const analytics = Analytics({
  app: 'gardenOfLove',
  plugins: [
    segmentPlugin({
      writeKey: 'MeWYtqzWbEBMRLZPNMuomgJhJh72dQUw',
    }),
  ],
});

export default function MyApp(props: MyAppProps) {
  const { Component, pageProps } = props;

  const getLayout = Component.getLayout ?? ((page) => page);

  useEffect(() => {
    analytics.page();
  }, []);

  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      {/* <TawkMessengerReact propertyId="629c912b7b967b117992f8b6" widgetId="1g4ppe4ru" /> */}
      <AuthProvider>
        <ReduxProvider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <CollapseDrawerProvider>
                <ThemeProvider>
                  <NotistackProvider>
                    <MotionLazyContainer>
                      <ThemeColorPresets>
                        <ThemeLocalization>
                          <RtlLayout>
                            {/* <Settings /> */}
                            <ProgressBar />
                            {getLayout(<Component {...pageProps} />)}
                            <ToastContainer />
                          </RtlLayout>
                        </ThemeLocalization>
                      </ThemeColorPresets>
                    </MotionLazyContainer>
                  </NotistackProvider>
                </ThemeProvider>
              </CollapseDrawerProvider>
            </LocalizationProvider>
          </PersistGate>
        </ReduxProvider>
      </AuthProvider>
    </>
  );
}
