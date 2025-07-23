import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Card,
  CardContent,
  Alert,
  Grid,
  Chip,
  Link,
  Divider
} from '@mui/material';
import { Log } from '../logger';
import { LogLevel } from '../logger/types';

interface UrlEntry {
  id: string;
  originalUrl: string;
  shortUrl: string;
  shortCode: string;
  validityMinutes: number;
  createdAt: Date;
  expiresAt: Date;
  clicks: number;
  clickDetails: ClickDetail[];
}

interface ClickDetail {
  timestamp: Date;
  source: string;
  location: string;
}

interface UrlShortenerProps {
  setRedirects: React.Dispatch<React.SetStateAction<any[]>>;
}

const UrlShortener: React.FC<UrlShortenerProps> = ({ setRedirects }) => {
  const [urls, setUrls] = useState<Array<{
    originalUrl: string;
    validityMinutes: string;
    customShortcode: string;
  }>>([
    { originalUrl: '', validityMinutes: '', customShortcode: '' }
  ]);
  
  const [results, setResults] = useState<UrlEntry[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const logMessage = async (level: LogLevel, message: string) => {
    await Log({
      timestamp: new Date().toISOString(),
      level,
      message,
      source: 'UrlShortener',
      package: 'frontend_test_submission'
    });
  };

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const generateShortCode = (): string => {
    return Math.random().toString(36).substring(2, 8);
  };

  const isShortCodeUnique = (shortCode: string): boolean => {
    const existingData = JSON.parse(localStorage.getItem('urlData') || '[]');
    return !existingData.some((entry: UrlEntry) => entry.shortCode === shortCode);
  };

  const addUrlField = () => {
    if (urls.length < 5) {
      setUrls([...urls, { originalUrl: '', validityMinutes: '', customShortcode: '' }]);
      logMessage('info', `Added new URL field. Total fields: ${urls.length + 1}`);
    }
  };

  const removeUrlField = (index: number) => {
    if (urls.length > 1) {
      const newUrls = urls.filter((_, i) => i !== index);
      setUrls(newUrls);
      logMessage('info', `Removed URL field at index ${index}. Remaining fields: ${newUrls.length}`);
    }
  };

  const updateUrl = (index: number, field: string, value: string) => {
    const newUrls = [...urls];
    newUrls[index] = { ...newUrls[index], [field]: value };
    setUrls(newUrls);
  };

  const validateInputs = (): string[] => {
    const validationErrors: string[] = [];
    
    urls.forEach((url, index) => {
      if (!url.originalUrl.trim()) {
        validationErrors.push(`URL ${index + 1}: Original URL is required`);
      } else if (!validateUrl(url.originalUrl)) {
        validationErrors.push(`URL ${index + 1}: Invalid URL format`);
      }
      
      if (url.validityMinutes && (isNaN(Number(url.validityMinutes)) || Number(url.validityMinutes) <= 0)) {
        validationErrors.push(`URL ${index + 1}: Validity must be a positive number`);
      }
      
      if (url.customShortcode && !/^[a-zA-Z0-9]+$/.test(url.customShortcode)) {
        validationErrors.push(`URL ${index + 1}: Custom shortcode must be alphanumeric`);
      }
      
      if (url.customShortcode && (url.customShortcode.length < 3 || url.customShortcode.length > 10)) {
        validationErrors.push(`URL ${index + 1}: Custom shortcode must be 3-10 characters long`);
      }
    });
    
    return validationErrors;
  };

  const handleSubmit = async () => {
    await logMessage('info', 'Starting URL shortening process');
    
    const validationErrors = validateInputs();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      await logMessage('warn', `Validation failed: ${validationErrors.join(', ')}`);
      return;
    }
    
    setErrors([]);
    const newResults: UrlEntry[] = [];
    const existingData = JSON.parse(localStorage.getItem('urlData') || '[]');
    
    for (const url of urls) {
      if (!url.originalUrl.trim()) continue;
      
      let shortCode = url.customShortcode;
      
      // Generate unique shortcode if not provided or if custom one is not unique
      if (!shortCode || !isShortCodeUnique(shortCode)) {
        do {
          shortCode = generateShortCode();
        } while (!isShortCodeUnique(shortCode));
        
        if (url.customShortcode && !isShortCodeUnique(url.customShortcode)) {
          await logMessage('warn', `Custom shortcode '${url.customShortcode}' was not unique, generated '${shortCode}' instead`);
        }
      }
      
      const validityMinutes = url.validityMinutes ? Number(url.validityMinutes) : 30;
      const createdAt = new Date();
      const expiresAt = new Date(createdAt.getTime() + validityMinutes * 60 * 1000);
      
      const urlEntry: UrlEntry = {
        id: Date.now().toString() + Math.random().toString(36).substring(2),
        originalUrl: url.originalUrl,
        shortUrl: `${window.location.origin}/${shortCode}`,
        shortCode,
        validityMinutes,
        createdAt,
        expiresAt,
        clicks: 0,
        clickDetails: []
      };
      
      newResults.push(urlEntry);
      existingData.push(urlEntry);
      
      await logMessage('info', `Created short URL: ${urlEntry.shortUrl} for ${urlEntry.originalUrl}`);
    }
    
    localStorage.setItem('urlData', JSON.stringify(existingData));
    setResults(newResults);
    
    // Reset form
    setUrls([{ originalUrl: '', validityMinutes: '', customShortcode: '' }]);
    
    await logMessage('info', `Successfully created ${newResults.length} short URLs`);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      await logMessage('info', `Copied to clipboard: ${text}`);
    } catch (err) {
      await logMessage('error', `Failed to copy to clipboard: ${err}`);
    }
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        URL Shortener
      </Typography>
      
      <Typography variant="body1" color="text.secondary" paragraph>
        Shorten up to 5 URLs at once. Set custom validity periods and shortcodes.
      </Typography>

      {errors.length > 0 && (
        <Alert severity="error" sx={{ mb: 2 }}>
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </Alert>
      )}

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Enter URLs to Shorten
          </Typography>
          
          {urls.map((url, index) => (
            <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={5}>
                  <TextField
                    fullWidth
                    label={`Original URL ${index + 1}`}
                    value={url.originalUrl}
                    onChange={(e) => updateUrl(index, 'originalUrl', e.target.value)}
                    placeholder="https://example.com"
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} md={2}>
                  <TextField
                    fullWidth
                    label="Validity (minutes)"
                    value={url.validityMinutes}
                    onChange={(e) => updateUrl(index, 'validityMinutes', e.target.value)}
                    placeholder="30"
                    type="number"
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label="Custom Shortcode"
                    value={url.customShortcode}
                    onChange={(e) => updateUrl(index, 'customShortcode', e.target.value)}
                    placeholder="mycode123"
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} md={2}>
                  {urls.length > 1 && (
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => removeUrlField(index)}
                      size="small"
                    >
                      Remove
                    </Button>
                  )}
                </Grid>
              </Grid>
            </Box>
          ))}
          
          <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
            {urls.length < 5 && (
              <Button variant="outlined" onClick={addUrlField}>
                Add Another URL
              </Button>
            )}
            <Button variant="contained" onClick={handleSubmit}>
              Shorten URLs
            </Button>
          </Box>
        </CardContent>
      </Card>

      {results.length > 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Shortened URLs
            </Typography>
            
            {results.map((result, index) => (
              <Box key={result.id} sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2" color="text.secondary">
                      Original URL:
                    </Typography>
                    <Link href={result.originalUrl} target="_blank" rel="noopener">
                      {result.originalUrl.length > 50 
                        ? `${result.originalUrl.substring(0, 50)}...` 
                        : result.originalUrl}
                    </Link>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2" color="text.secondary">
                      Short URL:
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Link href={result.shortUrl} target="_blank" rel="noopener">
                        {result.shortUrl}
                      </Link>
                      <Button
                        size="small"
                        onClick={() => copyToClipboard(result.shortUrl)}
                      >
                        Copy
                      </Button>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2" color="text.secondary">
                      Expires:
                    </Typography>
                    <Typography variant="body2">
                      {result.expiresAt.toLocaleString()}
                    </Typography>
                    <Chip
                      label={`${result.validityMinutes} minutes`}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
              </Box>
            ))}
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default UrlShortener;