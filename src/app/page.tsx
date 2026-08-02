import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

export default function Home() {
  return (
    <Stack component="main" spacing={3} sx={{ p: 4 }}>
      <Typography variant="h1">myself</Typography>
      <Typography variant="h4">Theme smoke test</Typography>
      <Typography variant="body1">
        Scaffold in progress — see /specs for the roadmap.
      </Typography>
      <Stack direction="row" spacing={2}>
        <Button variant="contained" color="primary">
          Primary
        </Button>
        <Button variant="contained" color="secondary">
          Secondary
        </Button>
        <Button variant="outlined" color="primary">
          Outlined
        </Button>
      </Stack>
    </Stack>
  );
}
