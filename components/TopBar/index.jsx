import React, { useEffect, useState } from "react";
import {
  AppBar,
  Box,
  CircularProgress,
  Toolbar,
  Typography,
} from "@mui/material";
import { useLocation, matchPath } from "react-router-dom";
import api from "../../lib/api";

import "./styles.css";

function TopBar() {
  const location = useLocation();
  const [contextText, setContextText] = useState("Photo Sharing App");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function updateContext() {
      const photoMatch = matchPath("/users/:userId/photos", location.pathname);
      const detailMatch = matchPath("/users/:userId", location.pathname);

      if (photoMatch?.params.userId || detailMatch?.params.userId) {
        const matchedUserId =
          photoMatch?.params.userId || detailMatch?.params.userId;

        try {
          setLoading(true);
          const response = await api.get(`/user/${matchedUserId}`);
          const fullName = `${response.data.first_name} ${response.data.last_name}`;

          if (!ignore) {
            setContextText(photoMatch ? `Photos of ${fullName}` : fullName);
          }
        } catch (err) {
          if (!ignore) {
            setContextText("User not found");
          }
        } finally {
          if (!ignore) {
            setLoading(false);
          }
        }
        return;
      }

      if (!ignore) {
        setLoading(false);
        setContextText(
          location.pathname === "/users" ? "User List" : "Photo Sharing App",
        );
      }
    }

    updateContext();

    return () => {
      ignore = true;
    };
  }, [location.pathname]);

  return (
    <AppBar className="topbar-appBar" position="fixed">
      <Toolbar className="topbar-toolbar">
        <Typography variant="h6" color="inherit">
          Laurenne Oliver and Paola Reyes
        </Typography>
        <Box className="topbar-context">
          {loading ? (
            <CircularProgress color="inherit" size={22} />
          ) : (
            <Typography variant="h6" color="inherit">
              {contextText}
            </Typography>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
