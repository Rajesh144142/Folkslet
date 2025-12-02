import React, { StrictMode, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Skeleton } from '@mui/material';
import App from './App.jsx';
import store from './redux/store.js';
import './index.css';
import AppThemeProvider from './theme/AppThemeProvider.jsx';
import SnackbarProvider from './providers/SnackbarProvider.jsx';
import PostSkeleton from './features/home/components/middle/PostSkeleton.jsx';

const rootElement = document.getElementById('root');

ReactDOM.createRoot(rootElement).render(
  <StrictMode>
    <Provider store={store}>
      <AppThemeProvider>
        <SnackbarProvider>
          <BrowserRouter>
            <Suspense
              fallback={
                <div className="flex min-h-screen justify-center bg-background px-6 py-10">
                  <div className="flex w-full max-w-2xl flex-col gap-6">
                    <Skeleton variant="text" height={28} width="40%" />
                    {[0, 1].map((value) => (
                      <PostSkeleton key={value} />
                    ))}
                  </div>
                </div>
              }
            >
              <App />
            </Suspense>
          </BrowserRouter>
        </SnackbarProvider>
      </AppThemeProvider>
    </Provider>
  </StrictMode>
);