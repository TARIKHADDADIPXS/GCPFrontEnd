import React from "react";
import UploadView from "./UploadView";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";

const App: React.FC = () => {
  const logoSrc = "/cactus.png";

  const handleHomeClick = () => {
    window.location.href = "/";
  };

  return (
    <>
      <AppBar position="fixed" color="inherit" elevation={3} sx={{ boxShadow: 2 }}>
        <Toolbar>
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
        </Toolbar>
      </AppBar>
      <UploadView />
    </>
  );
};

export default App;