// src/components/ShortenedResult.tsx
import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";

const ShortenedResult = ({ links }: { links: any[] }) => {
  return (
    <Box mt={4}>
      {links.map((item) => (
        <Card key={item.id} sx={{ mb: 2 }}>
          <CardContent>
            <Typography>
              <strong>Original:</strong> {item.longUrl}
            </Typography>
            <Typography>
              <strong>Short:</strong> <a href={`/${item.shortcode}`} target="_blank">{`http://localhost:3000/${item.shortcode}`}</a>
            </Typography>
            <Typography>
              <strong>Expires:</strong> {new Date(item.expiresAt).toLocaleString()}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default ShortenedResult;
