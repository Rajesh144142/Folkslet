import { useMemo, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { HiOutlineHome, HiOutlineBell, HiOutlineCog, HiOutlineBars3, HiOutlineChatBubbleLeftEllipsis } from 'react-icons/hi2';
import { BiSearch } from 'react-icons/bi';
import { GiWhaleTail } from 'react-icons/gi';
import { useSelector } from 'react-redux';
import InputBase from '@mui/material/InputBase';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import { assetUrl } from '../../../../utils/assets';

const Navbar = () => {
  const { user } = useSelector((state) => state.authReducer.authData);
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const unreadNotifications = useSelector((state) => state.notification.unread);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
  };

  if (!user) {
    return null;
  }

  const linkClasses =
    'inline-flex h-10 w-10 items-center justify-center rounded-full text-xl text-[var(--color-text-muted)] transition hover:text-[var(--color-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]';
  const activeClasses = 'text-[var(--color-primary)]';

  const navLinks = useMemo(
    () => [
      { to: '/home', label: 'Home', icon: <HiOutlineHome className="text-2xl" />, hidden: false },
      { to: '/chat', label: 'Messages', icon: <HiOutlineChatBubbleLeftEllipsis className="text-2xl" />, hidden: false },
      { to: '/notifications', label: 'Notifications', icon: <HiOutlineBell className="text-2xl" />, hidden: false },
      { to: '/settings', label: 'Settings', icon: <HiOutlineCog className="text-2xl" />, hidden: false },
    ],
    [],
  );

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="mx-auto flex max-w-screen-xl items-center gap-4 px-4 py-2 lg:px-8">
          <Link
            to="/home"
            className="flex items-center gap-2 text-lg font-semibold text-[var(--color-primary)] transition hover:opacity-90"
            aria-label="Folkslet home"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-primary)] text-2xl text-[var(--color-on-primary)]">
              <GiWhaleTail />
            </span>
            <span className="hidden sm:block">Folkslet</span>
          </Link>

          <Paper
            component="form"
            elevation={0}
            className="hidden flex-1 items-center gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] px-4 lg:flex"
            onSubmit={handleSearchSubmit}
            sx={{
              height: 44,
            }}
          >
            <BiSearch className="text-xl text-[var(--color-text-muted)]" />
            <InputBase
              fullWidth
              placeholder="Search posts, people, hashtags"
              inputProps={{ 'aria-label': 'Search posts, people, hashtags' }}
              sx={{
                fontSize: 14,
                color: 'var(--color-text-base)',
                '&::placeholder': {
                  color: 'var(--color-text-muted)',
                  opacity: 1,
                },
              }}
            />
          </Paper>

          <div className="ml-auto flex items-center gap-3">
            <div className="hidden items-center gap-3 lg:flex">
              {navLinks
                .filter((item) => !item.hidden)
                .map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) => `${linkClasses} ${isActive ? activeClasses : ''}`}
                    aria-label={item.label}
                  >
                    <span className="relative inline-flex">
                      {item.icon}
                      {item.to === '/notifications' && unreadNotifications > 0 && (
                        <span className="absolute -top-1 -right-1 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[var(--color-primary)] px-1 text-[10px] font-bold leading-none text-[var(--color-on-primary)]">
                          {unreadNotifications > 9 ? '9+' : unreadNotifications}
                        </span>
                      )}
                    </span>
                  </NavLink>
                ))}

            </div>

            <Link to={`/profile/${user._id}`} aria-label="Profile" className="hidden lg:flex">
              <img
                className="h-10 w-10 rounded-full border border-[var(--color-border)] object-cover"
                src={assetUrl(user.profilePicture, 'defaultProfile.png')}
                alt={user.username}
              />
            </Link>

            <IconButton
              edge="end"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
              size="large"
              sx={{ display: { lg: 'none' } }}
            >
              <HiOutlineBars3 className="text-2xl text-[var(--color-text-base)]" />
            </IconButton>

            <Link to={`/profile/${user._id}`} aria-label="Profile" className="flex items-center gap-2 lg:hidden">
              <img
                className="h-10 w-10 rounded-full border border-[var(--color-border)] object-cover"
                src={assetUrl(user.profilePicture, 'defaultProfile.png')}
                alt={user.username}
              />
            </Link>
          </div>
        </div>
      </nav>
      <SwipeableDrawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onOpen={() => setDrawerOpen(true)}
        disableDiscovery
        PaperProps={{
          sx: {
            width: 280,
            backgroundColor: 'var(--color-background)',
            color: 'var(--color-text-base)',
            borderLeft: '1px solid var(--color-border)',
          },
        }}
      >
        <div className="flex h-full flex-col">
          <List>
            {navLinks
              .filter((item) => !item.hidden)
              .map((item) => (
                <ListItem key={item.to} disablePadding>
                  <ListItemButton component={NavLink} to={item.to} onClick={() => setDrawerOpen(false)}>
                    <ListItemIcon className="text-[var(--color-text-base)] relative">
                      {item.icon}
                      {item.to === '/notifications' && unreadNotifications > 0 && (
                        <span className="absolute -top-1 -right-1 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[var(--color-primary)] px-1 text-[10px] font-bold leading-none text-[var(--color-on-primary)]">
                          {unreadNotifications > 9 ? '9+' : unreadNotifications}
                        </span>
                      )}
                    </ListItemIcon>
                    <ListItemText primary={item.label} />
                  </ListItemButton>
                </ListItem>
              ))}
            <ListItem disablePadding>
              <ListItemButton component={Link} to={`/profile/${user._id}`} onClick={() => setDrawerOpen(false)}>
                <ListItemIcon>
                  <img
                    className="h-10 w-10 rounded-full border border-[var(--color-border)] object-cover"
                    src={assetUrl(user.profilePicture, 'defaultProfile.png')}
                    alt={user.username}
                  />
                </ListItemIcon>
                <ListItemText primary="Profile" />
              </ListItemButton>
            </ListItem>
          </List>
        </div>
      </SwipeableDrawer>
    </>
  );
};

export default Navbar;

