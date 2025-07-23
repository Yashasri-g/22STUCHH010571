import React, { useState } from "react";
import { Container, Typography, Box } from "@mui/material";
import { Link } from "react-router-dom";
import ShortenForm from "../components/ShortenForm";
import ShortenedResult from "../components/ShortenedResult";
import { log } from "../services/logService";

const ShortenerPage = () => {
  const [shortenedLinks, setShortenedLinks] = useState<any[]>([]);

  const handleShorten = (results: any[]) => {
    setShortenedLinks((prev) => [...prev, ...results]);

    const stored = JSON.parse(localStorage.getItem("shortUrls") || "[]");
    localStorage.setItem("shortUrls", JSON.stringify([...stored, ...results]));

    log("frontend", "info", "page", "Shortener page created new links");
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4" gutterBottom>
          URL Shortener
        </Typography>
        <Link to="/stats">📊 View Stats</Link>
      </Box>

      <ShortenForm onShorten={handleShorten} />

      {shortenedLinks.length > 0 && (
        <ShortenedResult links={shortenedLinks} />
      )}
    </Container>
  );
};

export default ShortenerPage;
