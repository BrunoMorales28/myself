"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Box from "@mui/material/Box";
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "./LanguageSwitcher";

const navKeys = [
  "studies",
  "experience",
  "skills",
  "about",
  "contact",
] as const;

function navHref(key: (typeof navKeys)[number]) {
  return key === "skills" ? "/experience#skills" : `/${key}`;
}

export function Header() {
  const t = useTranslations("nav");
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <AppBar position="static" elevation={0}>
      <Toolbar
        sx={{
          justifyContent: "space-between",
          minHeight: { xs: 72, sm: 88 },
        }}
      >
        <Typography
          component={Link}
          href="/"
          variant="h6"
          sx={{
            textDecoration: "none",
            color: "primary.contrastText",
            fontSize: { xs: "1.375rem", sm: "1.5rem" },
          }}
        >
          {t("home")}
        </Typography>

        <Stack
          direction="row"
          spacing={1}
          sx={{ alignItems: "center", display: { xs: "none", sm: "flex" } }}
        >
          <Stack
            component="nav"
            aria-label={t("mainNavigation")}
            direction="row"
            spacing={1}
          >
            {navKeys.map((key) => (
              <Button
                key={key}
                component={Link}
                href={navHref(key)}
                sx={{
                  color: "primary.contrastText",
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.12)",
                  },
                }}
              >
                {t(key)}
              </Button>
            ))}
          </Stack>
          <LanguageSwitcher onDark />
        </Stack>

        <Box sx={{ display: { xs: "flex", sm: "none" } }}>
          <IconButton
            aria-label={t("openMenu")}
            onClick={() => setDrawerOpen(true)}
            sx={{ color: "primary.contrastText" }}
            size="large"
          >
            <MenuIcon fontSize="large" />
          </IconButton>
        </Box>
      </Toolbar>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box role="presentation" sx={{ width: 240 }}>
          <Box component="nav" aria-label={t("mainNavigation")}>
            <List>
              {navKeys.map((key) => (
                <ListItem key={key} disablePadding>
                  <ListItemButton
                    component={Link}
                    href={navHref(key)}
                    onClick={() => setDrawerOpen(false)}
                  >
                    <ListItemText primary={t(key)} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
          <Box sx={{ p: 2 }}>
            <LanguageSwitcher />
          </Box>
        </Box>
      </Drawer>
    </AppBar>
  );
}
