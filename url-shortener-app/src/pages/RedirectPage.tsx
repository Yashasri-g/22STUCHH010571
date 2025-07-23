// src/pages/RedirectPage.tsx
import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { log } from "../services/logService";

const RedirectPage = () => {
  const { shortcode } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("shortUrls") || "[]");
    const urlEntry = stored.find((entry: any) => entry.shortcode === shortcode);

    if (!urlEntry) {
      log("frontend", "error", "page", `Shortcode ${shortcode} not found`);
      alert("Short URL not found");
      return navigate("/");
    }

    const now = new Date();
    if (new Date(urlEntry.expiresAt) < now) {
      log("frontend", "warn", "page", `Shortcode ${shortcode} expired`);
      alert("This link has expired.");
      return navigate("/");
    }

    const click = {
      timestamp: new Date().toISOString(),
      source: document.referrer || "direct",
      location: "Hyderabad", // Hardcoded due to no backend IP API
    };

    urlEntry.clicks.push(click);
    localStorage.setItem(
      "shortUrls",
      JSON.stringify(
        stored.map((u: any) => (u.shortcode === shortcode ? urlEntry : u))
      )
    );

    log("frontend", "info", "page", `Shortcode ${shortcode} clicked`);

    setTimeout(() => {
      window.location.href = urlEntry.longUrl;
    }, 1000); // slight delay to allow logging
  }, [shortcode, navigate]);

  return <p>Redirecting...</p>;
};

export default RedirectPage;
