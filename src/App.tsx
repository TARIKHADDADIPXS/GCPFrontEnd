import React, { useState, useEffect } from "react";
import UploadView from "./UploadView";
import appConfig from "./config/app.config";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MenuIcon from "@mui/icons-material/Menu";
import useMediaQuery from "@mui/material/useMediaQuery";
import {
  GoogleOAuthProvider,
  GoogleLogin,
  CredentialResponse,
} from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useTheme } from "@mui/material/styles";
import { Paper } from "@mui/material";

const LOCAL_STORAGE_KEY = "google_user_credential";

const App: React.FC = () => {
  const [user, setUser] = useState<CredentialResponse | null>(null);
  const [profile, setProfile] = useState<{
    name?: string;
    picture?: string;
    email?: string;
  } | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const logoSrc = "/cactus.png";


  const handleHomeClick = () => {
    // For SPA, you can use react-router's navigate or just reload/redirect
    window.location.href = "/";
  };


  useEffect(() => {
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
  }, []);

  const handleLoginSuccess = (credentialResponse: CredentialResponse) => {
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

  const handleLogout = () => {
    setUser(null);
    setProfile(null);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    handleMenuClose();
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <GoogleOAuthProvider clientId={appConfig.googleClientId}>
      <AppBar position="fixed" color="inherit" elevation={3} sx={{ boxShadow: 2 }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="home"
            onClick={handleHomeClick}
            sx={{
              mr: 1,
              borderRadius: 0, // No rounding
              padding: 0,      // Remove extra padding if you want a tight fit
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
                borderRadius: 0, // No rounding
                display: "block",

              }}
            />
          </IconButton>

          <Typography variant="h6" sx={{ flexGrow: 1 }} color="primary">
            GCP Cactus AI
          </Typography>
          {user &&
            profile &&
            (isMobile ? (
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

      {!user ? (
        <Box
          position="relative"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="100vh"
          sx={{
            backgroundImage:
              "url('https://assets.paperjam.lu/images/articles/plus-economique-au-plus-chic-s/0.5/0.5/640/426/667445.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            width: "100%",
            height: "100vh",
            p: 0,
            m: 0,
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100vh",
              bgcolor: "#ffffff80", // Adjust opacity here (0.4 = 40% black overlay)
              zIndex: 1,
            }}
          />
          <Paper
            elevation={6}
            sx={{
              p: 4,
              borderRadius: 4,
              background: "rgba(255,255,255,0.85)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              boxShadow: 6,
              maxWidth: 400,
              width: "90%",
              zIndex: 2,
              position: "relative",
            }}
          >
            <Typography variant="h4" fontWeight={700} mb={3} color="primary">
              Welcome to GCP Cactus
            </Typography>
            {/* Hide the default GoogleLogin button but keep it in the DOM for auth */}
            <Box >
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
            </Box>
          </Paper>
        </Box>
      ) : (
        <UploadView user={user} />
      )}
    </GoogleOAuthProvider>
  );
};

export default App;
