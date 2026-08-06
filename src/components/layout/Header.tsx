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

export function Header() {
  const t = useTranslations("nav");
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <AppBar position="static" color="default" elevation={0}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography
          component={Link}
          href="/"
          variant="h6"
          sx={{ textDecoration: "none", color: "text.primary" }}
        >
          {t("home")}
        </Typography>

        <Stack
          direction="row"
          spacing={1}
          sx={{ alignItems: "center", display: { xs: "none", sm: "flex" } }}
        >
          {navKeys.map((key) => (
            <Button key={key} component={Link} href={`/${key}`}>
              {t(key)}
            </Button>
          ))}
          <LanguageSwitcher />
        </Stack>

        <Box sx={{ display: { xs: "flex", sm: "none" } }}>
          <IconButton
            aria-label={t("openMenu")}
            onClick={() => setDrawerOpen(true)}
          >
            <MenuIcon />
          </IconButton>
        </Box>
      </Toolbar>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box role="presentation" sx={{ width: 240 }}>
          <List>
            {navKeys.map((key) => (
              <ListItem key={key} disablePadding>
                <ListItemButton
                  component={Link}
                  href={`/${key}`}
                  onClick={() => setDrawerOpen(false)}
                >
                  <ListItemText primary={t(key)} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Box sx={{ p: 2 }}>
            <LanguageSwitcher />
          </Box>
        </Box>
      </Drawer>
    </AppBar>
  );
}
