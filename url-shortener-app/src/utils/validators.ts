// src/pages/ShortenerPage.tsx
import React, { useState } from "react";
import { Container, Typography } from "@mui/material";
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
      <Typography variant="h4" gutterBottom>
        URL Shortener
      </Typography>

      <ShortenForm onShorten={handleShorten} />

      {shortenedLinks.length > 0 && (
        <ShortenedResult links={shortenedLinks} />
      )}
    </Container>
  );
};

export default ShortenerPage;
