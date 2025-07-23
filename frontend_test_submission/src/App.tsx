import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Container, Box } from "@mui/material";
import UrlShortener from "./pages/UrlShortener";
import Analytics from "./pages/Analytics";
import NotFound from "./pages/NotFound";
import Expired from "./pages/Expired";
import Redirect from "./components/Redirect";
import { RedirectEntry } from "./components/Redirect";

function App() {
  const [redirects, setRedirects] = useState<RedirectEntry[]>([]);

  return (
    <Router>
      <AppBar position="static" sx={{ mb: 4 }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            🔗 URL Shortener
          </Typography>
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>
          <Button color="inherit" component={Link} to="/analytics">
            Analytics
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg">
        <Routes>
          <Route path="/" element={<UrlShortener setRedirects={setRedirects} />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/404" element={<NotFound />} />
          <Route path="/expired" element={<Expired />} />
          <Route path="/error" element={<NotFound />} />
          <Route path="/:shortCode" element={<Redirect />} />
          <Route path="*" element={<NotFound />} />
        </Routes>

        {redirects.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Recent Redirects
            </Typography>
            {redirects.map((entry, index) => (
              <Redirect key={index} from={entry.from} to={entry.to} />
            ))}
          </Box>
        )}
      </Container>
    </Router>
  );
}

export default App;
