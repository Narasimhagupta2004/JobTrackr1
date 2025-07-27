import React, { useState, useEffect } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  AppBar,
  IconButton,
  CssBaseline,
  Avatar,
  Divider,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Add as AddIcon,
  ListAlt as ListAltIcon,
  AccountCircle as AccountCircleIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 240;

const Navbar = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUsername(payload.name || 'User');
        setIsLoggedIn(true);
      } catch {
        setUsername('User');
        setIsLoggedIn(false);
      }
    } else {
      setIsLoggedIn(false);
    }
  }, [location]); // re-run on route change to update login status if needed

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/login');
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Add Job', icon: <AddIcon />, path: '/add-job' },
    { text: 'Job List', icon: <ListAltIcon />, path: '/jobs' }, // Optional
    { text: 'Profile', icon: <AccountCircleIcon />, path: '/profile' }, // Optional
  ];

  // If user is not logged in, render only children (or redirect in routes)
  if (!isLoggedIn) {
    return <>{children}</>;
  }

  const drawer = (
    <div>
      <Toolbar sx={{ justifyContent: 'center', mb: 2 }}>
        <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56, fontSize: 28 }}>
          {username[0]?.toUpperCase()}
        </Avatar>
      </Toolbar>
      <Typography variant="h6" align="center" gutterBottom>
        {username}
      </Typography>
      <Divider />
      <List>
        {menuItems.map(({ text, icon, path }) => (
          <ListItemButton
            key={text}
            selected={location.pathname === path}
            onClick={() => {
              navigate(path);
              setMobileOpen(false);
            }}
          >
            <ListItemIcon sx={{ color: location.pathname === path ? 'primary.main' : 'inherit' }}>
              {icon}
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItemButton>
        ))}
        <Divider sx={{ my: 1 }} />
        <ListItemButton onClick={handleLogout} sx={{ mt: 1 }}>
          <ListItemIcon sx={{ color: 'error.main' }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: 'primary.main',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            JobTrackr
          </Typography>
          <Typography variant="subtitle1" sx={{ mr: 1, display: { xs: 'none', sm: 'block' } }}>
            {username}
          </Typography>
          <Avatar sx={{ bgcolor: 'secondary.main' }}>{username[0]?.toUpperCase()}</Avatar>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="sidebar navigation"
      >
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>

        {/* Desktop Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` }, mt: 8 }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Navbar;
