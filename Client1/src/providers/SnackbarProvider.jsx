import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const SnackbarContext = createContext(null);

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar must be used within SnackbarProvider');
  }
  return context;
};

const SnackbarProvider = ({ children }) => {
  const [snackbarState, setSnackbarState] = useState({
    open: false,
    message: '',
    severity: 'info',
    duration: 4000,
  });

  const closeSnackbar = useCallback((_, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarState((prev) => ({ ...prev, open: false }));
  }, []);

  const showMessage = useCallback((message, options) => {
    setSnackbarState({
      open: true,
      message,
      severity: options?.severity || 'info',
      duration: options?.duration || 4000,
    });
  }, []);

  const contextValue = useMemo(
    () => ({
      showMessage,
    }),
    [showMessage],
  );

  return (
    <SnackbarContext.Provider value={contextValue}>
      {children}
      <Snackbar
        open={snackbarState.open}
        autoHideDuration={snackbarState.duration}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={closeSnackbar}
          severity={snackbarState.severity}
          elevation={6}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbarState.message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};

export default SnackbarProvider;

