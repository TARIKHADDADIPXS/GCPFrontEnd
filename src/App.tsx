import React, { useEffect, useState } from "react";
import UploadView from "./UploadView";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import appConfig from "./config/app.config";
import { GoogleOAuthProvider, GoogleLogin, CredentialResponse, googleLogout } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { Avatar, Box, Button, Menu, MenuItem, useMediaQuery, useTheme } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

const LOCAL_STORAGE_KEY = "google_user_credential";

const AppContent: React.FC = () => {
  const [user, setUser] = useState<CredentialResponse | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const logoSrc = "/cactus.png";
  const [profile, setProfile] = useState<{
    name?: string;
    picture?: string;
    email?: string;
  } | null>(null);

  const isDev = appConfig.node_env.toLocaleLowerCase() === "development";
  const handleHomeClick = () => {
    window.location.href = "/";
  };

  useEffect(() => {
    if (!isDev) return;
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      try {
        const decoded: {
          exp: number;
          name?: string;
          picture?: string;
          email?: string;
        } = jwtDecode(parsed.credential);
        if (decoded.exp * 1000 > Date.now()) {
          setUser(parsed);
          setProfile({
            name: decoded.name,
            picture: decoded.picture,
            email: decoded.email,
          });
        } else {
          localStorage.removeItem(LOCAL_STORAGE_KEY);
        }
      } catch {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      }
    }
  }, [isDev]);

  const handleLoginSuccess = (credentialResponse: CredentialResponse) => {
    if (!isDev) return;
    setUser(credentialResponse);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(credentialResponse));

    try {
      if (credentialResponse.credential) {
        const decoded: { name?: string; picture?: string; email?: string } =
          jwtDecode(credentialResponse.credential);
        setProfile({
          name: decoded.name,
          picture: decoded.picture,
          email: decoded.email,
        });
      }
    } catch {
      setProfile(null);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    if (!isDev) return;
    googleLogout();
    setUser(null);
    setProfile(null);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    handleMenuClose();
  };

  return (
    <div>
        <div style={{
        backgroundImage:
          "url('https://assets.paperjam.lu/images/articles/plus-economique-au-plus-chic-s/0.5/0.5/640/426/667445.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        opacity:.1,
        zIndex:-99,
        position:"absolute",
        left:0,
        top:0
      }}>
        </div>

      <AppBar position="fixed" color="default" elevation={3}>

        <Toolbar sx={{background:"white"}}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="home"
            onClick={handleHomeClick}
            sx={{
              mr: 1,
              borderRadius: 0,
              padding: 0,
              width: 46,
              height: 46,
              overflow: "hidden",
              transition: "all .3s ease-in-out"
            }}
            size="medium"
          >
            <img
              src={logoSrc}
              alt="App Logo"
              style={{
                width: 46,
                height: 46,
                borderRadius: 0,
                display: "block",
              }}
            />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }} color="primary">
            GCP Cactus AI
          </Typography>
          {isDev && user && profile && (isMobile ? (
            <>
              <IconButton
                color="inherit"
                edge="end"
                onClick={handleMenuOpen}
                aria-label="menu"
                size="large"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
              >
                <MenuItem disabled>
                  {profile.picture && (
                    <Avatar
                      alt={profile.name}
                      src={profile.picture}
                      sx={{ mr: 1 }}
                    />
                  )}
                  {profile.name || profile.email}
                </MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <Box display="flex" alignItems="center" gap={2}>
              {profile.picture && (
                <Avatar alt={profile.name} src={profile.picture} />
              )}
              <Typography variant="body1">
                {profile.name || profile.email}
              </Typography>
              <Button color="error" variant="contained" onClick={handleLogout}>
                Logout
              </Button>
            </Box>
          ))}
        </Toolbar>
      </AppBar>
      <div style={{ marginTop: 80, display: "flex", justifyContent: "center", flex:1, minHeight:"80vh", alignItems:"center" }}>
        {isDev ? (
          !user ? (
            <GoogleLogin
              shape="circle"
              onSuccess={handleLoginSuccess}
              onError={() => {
                alert("Login Failed");
              }}
              // @ts-ignore
              buttonText="Sign in with Google"
              theme="filled_blue"
              id="google-login-btn"
            />
          ) : (
            <UploadView />
          )
        ) : (
          <UploadView />
        )}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  if (appConfig.node_env.toLocaleLowerCase() === "development") {
    return (
      <GoogleOAuthProvider clientId={appConfig.googleClientId}>
        <AppContent />
      </GoogleOAuthProvider>
    );
  }
  return <AppContent />;
};

export default App;