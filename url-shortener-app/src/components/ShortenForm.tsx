import React, { useState } from "react";
import {
  TextField,
  Button,
  Grid,
  Typography,
  Paper,
  Box,
} from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import { log } from "../services/logService";
import { isValidURL, isValidShortcode } from "../utils/validators";

type ShortenInput = {
  longUrl: string;
  validity: string;
  customCode: string;
};

type Props = {
  onShorten: (result: any[]) => void;
};

const ShortenForm: React.FC<Props> = ({ onShorten }) => {
  const [inputs, setInputs] = useState<ShortenInput[]>(
    Array(5).fill({ longUrl: "", validity: "", customCode: "" })
  );

  const handleChange = (index: number, field: keyof ShortenInput, value: string) => {
    const newInputs = [...inputs];
    newInputs[index][field] = value;
    setInputs(newInputs);
  };

  const handleShorten = () => {
    const results: any[] = [];

    inputs.forEach((input, index) => {
      const { longUrl, validity, customCode } = input;

      if (!longUrl.trim()) return;

      if (!isValidURL(longUrl)) {
        log("frontend", "error", "component", `Invalid URL at row ${index + 1}`);
        alert(`Row ${index + 1}: Invalid URL`);
        return;
      }

      if (customCode && !isValidShortcode(customCode)) {
        log("frontend", "warn", "component", `Invalid shortcode at row ${index + 1}`);
        alert(`Row ${index + 1}: Invalid shortcode (alphanumeric, 4–10 chars)`);
        return;
      }

      const validMins = validity.trim() ? parseInt(validity) : 30;
      if (isNaN(validMins) || validMins <= 0) {
        log("frontend", "error", "component", `Invalid validity at row ${index + 1}`);
        alert(`Row ${index + 1}: Validity must be a positive number`);
        return;
      }

      const shortcode = customCode || uuidv4().slice(0, 6);
      const createdAt = new Date();
      const expiresAt = new Date(createdAt.getTime() + validMins * 60000);

      results.push({
        id: uuidv4(),
        longUrl,
        shortcode,
        createdAt: createdAt.toISOString(),
        expiresAt: expiresAt.toISOString(),
        clicks: [],
      });

      log("frontend", "info", "component", `Shortened URL created at row ${index + 1}`);
    });

    if (results.length > 0) {
      onShorten(results);
    }
  };

  return (
    <Paper elevation={3} sx={{ padding: 3 }}>
      <Typography variant="h5" gutterBottom>
        Shorten URLs (up to 5)
      </Typography>

      <Grid container spacing={2}>
        {inputs.map((input, index) => (
          <Grid item xs={12} key={index}>
            <Box display="flex" flexDirection="column" gap={1}>
              <TextField
                label={`Original URL ${index + 1}`}
                variant="outlined"
                fullWidth
                value={input.longUrl}
                onChange={(e) => handleChange(index, "longUrl", e.target.value)}
              />
              <TextField
                label="Validity (minutes)"
                type="number"
                value={input.validity}
                onChange={(e) => handleChange(index, "validity", e.target.value)}
              />
              <TextField
                label="Custom Shortcode (optional)"
                value={input.customCode}
                onChange={(e) => handleChange(index, "customCode", e.target.value)}
              />
            </Box>
          </Grid>
        ))}
      </Grid>

      <Box mt={3}>
        <Button variant="contained" onClick={handleShorten}>
          Shorten URLs
        </Button>
      </Box>
    </Paper>
  );
};

export default ShortenForm;