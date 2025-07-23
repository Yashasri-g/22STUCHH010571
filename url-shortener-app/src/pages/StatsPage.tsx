// src/pages/StatsPage.tsx
import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import { log } from "../services/logService";

const StatsPage = () => {
  const [urls, setUrls] = useState<any[]>([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("shortUrls") || "[]");
    setUrls(stored);
    log("frontend", "info", "page", "Statistics page loaded");
  }, []);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        URL Statistics
      </Typography>

      {urls.length === 0 ? (
        <Typography>No URLs shortened yet.</Typography>
      ) : (
        urls.map((url) => (
          <Card key={url.id} sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6">
                Short URL:{" "}
                <a href={`/${url.shortcode}`} target="_blank" rel="noreferrer">
                  http://localhost:3000/{url.shortcode}
                </a>
              </Typography>
              <Typography>
                Original URL: {url.longUrl}
              </Typography>
              <Typography>
                Created At: {new Date(url.createdAt).toLocaleString()}
              </Typography>
              <Typography>
                Expires At: {new Date(url.expiresAt).toLocaleString()}
              </Typography>
              <Typography>
                Click Count: {url.clicks.length}
              </Typography>

              <List>
                {url.clicks.map((click: any, index: number) => (
                  <React.Fragment key={index}>
                    <ListItem>
                      <ListItemText
                        primary={`Time: ${new Date(click.timestamp).toLocaleString()}`}
                        secondary={`Source: ${click.source}, Location: ${click.location}`}
                      />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        ))
      )}
    </Container>
  );
};

export default StatsPage;
