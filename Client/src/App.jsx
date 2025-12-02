import { useSelector } from 'react-redux';
import { Navbar } from './features/home';
import AppRoutes from './routes/AppRoutes.jsx';
import useRealtimeAccount from './features/home/hooks/useRealtimeAccount';

const App = () => {
  useRealtimeAccount();
  const user = useSelector((state) => state.authReducer.authData);
  const isAuthenticated = Boolean(user);
  const shouldRenderNavbar = isAuthenticated;

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text-base)] transition-colors duration-200">
      {shouldRenderNavbar && <Navbar />}
      <main className={shouldRenderNavbar ? 'pt-6 sm:pt-10' : ''}>
        <AppRoutes isAuthenticated={isAuthenticated} />
      </main>
    </div>
  );
};

export default App;