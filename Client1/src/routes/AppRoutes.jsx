import { lazy, memo, useMemo } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import NotFound from '../components/common/NotFound.jsx';

const HomePage = lazy(() => import('../components/home'));
const AuthPage = lazy(() => import('../components/Auth'));
const ProfilePage = lazy(() => import('../Home/Profile/profile'));
const FollowersListPage = lazy(() => import('../Home/Profile/FollowersList'));
const FollowingListPage = lazy(() => import('../Home/Profile/FollowingList'));
const MessagePage = lazy(() => import('../Home/Message/Message'));
const UpcomingPage = lazy(() => import('../Home/NewFeatures/Upcomingfeatures'));
const SettingsPage = lazy(() => import('../components/Settings/settings.jsx'));
const NotificationsPage = lazy(() => import('../features/home/pages/NotificationsPage.jsx'));

const AppRoutes = ({ isAuthenticated }) => {
  const privateRoute = useMemo(
    () =>
      (Component) =>
        isAuthenticated ? (
          <Component />
        ) : (
          <Navigate to="/auth" replace />
        ),
    [isAuthenticated],
  );

  return (
    <Routes>
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to="/home" replace />
          ) : (
            <Navigate to="/auth" replace />
          )
        }
      />
      <Route path="/home" element={privateRoute(HomePage)} />
      <Route
        path="/auth"
        element={
          isAuthenticated ? <Navigate to="/home" replace /> : <AuthPage />
        }
      />
      <Route path="/profile/:id" element={privateRoute(ProfilePage)} />
      <Route path="/profile/:id/followers" element={privateRoute(FollowersListPage)} />
      <Route path="/profile/:id/following" element={privateRoute(FollowingListPage)} />
      <Route path="/settings" element={privateRoute(SettingsPage)} />
      <Route path="/notifications" element={privateRoute(NotificationsPage)} />
      <Route path="/chat" element={privateRoute(MessagePage)} />
      <Route path="/upcoming" element={privateRoute(UpcomingPage)} />
      <Route path="/Upcoming" element={privateRoute(UpcomingPage)} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default memo(AppRoutes);

