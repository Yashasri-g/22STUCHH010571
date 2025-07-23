import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, CircularProgress, Alert, Box } from '@mui/material';
import { Log } from '../logger';
import { LogLevel, LogPackage } from '../logger/types';

export type RedirectEntry = {
  from: string;
  to: string;
};

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

const Redirect: React.FC<{ from?: string; to?: string }> = ({ from, to }) => {
  const { shortCode } = useParams<{ shortCode: string }>();
  const navigate = useNavigate();

  const logMessage = async (level: LogLevel, message: string, packageName: LogPackage = 'component') => {
    await Log({
      stack: 'frontend',
      level,
      package: packageName,
      message
    });
  };

  const getLocationInfo = (): string => {
    // In a real application, you would use a geolocation service
    // For this demo, we'll return a placeholder
    return 'Unknown Location';
  };

  const getSourceInfo = (): string => {
    return document.referrer || 'Direct';
  };

  useEffect(() => {
    const handleRedirect = async () => {
      if (!shortCode) {
        await logMessage('error', 'No shortCode provided for redirect');
        return;
      }

      try {
        await logMessage('info', `Attempting to redirect for shortCode: ${shortCode}`);
        
        const storedData = localStorage.getItem('urlData');
        if (!storedData) {
          await logMessage('warn', 'No URL data found in localStorage');
          navigate('/404');
          return;
        }

        const urlData: UrlEntry[] = JSON.parse(storedData);
        const urlEntry = urlData.find(entry => entry.shortCode === shortCode);

        if (!urlEntry) {
          await logMessage('warn', `No URL entry found for shortCode: ${shortCode}`);
          navigate('/404');
          return;
        }

        // Check if URL has expired
        const now = new Date();
        const expiresAt = new Date(urlEntry.expiresAt);
        
        if (now > expiresAt) {
          await logMessage('warn', `URL has expired for shortCode: ${shortCode}`);
          navigate('/expired');
          return;
        }

        // Record the click
        const clickDetail: ClickDetail = {
          timestamp: new Date(),
          source: getSourceInfo(),
          location: getLocationInfo()
        };

        // Update the URL entry with the new click
        const updatedUrlData = urlData.map(entry => {
          if (entry.shortCode === shortCode) {
            return {
              ...entry,
              clicks: entry.clicks + 1,
              clickDetails: [...(entry.clickDetails || []), clickDetail]
            };
          }
          return entry;
        });

        localStorage.setItem('urlData', JSON.stringify(updatedUrlData));

        await logMessage('info', `Redirecting to: ${urlEntry.originalUrl} (clicks: ${urlEntry.clicks + 1})`);
        
        // Redirect to the original URL
        window.location.href = urlEntry.originalUrl;

      } catch (error) {
        await logMessage('error', `Error during redirect: ${error}`);
        navigate('/error');
      }
    };

    if (shortCode) {
      handleRedirect();
    }
  }, [shortCode, navigate]);

  // If this component is being used to display redirect entries (legacy usage)
  if (from && to) {
    return (
      <Box sx={{ p: 1, border: '1px solid #e0e0e0', borderRadius: 1, mb: 1 }}>
        <Typography variant="body2">
          From: <strong>{from}</strong> → To: <strong>{to}</strong>
        </Typography>
      </Box>
    );
  }

  // Loading state while processing redirect
  return (
    <Container maxWidth="sm" sx={{ mt: 8, textAlign: 'center' }}>
      <CircularProgress size={60} sx={{ mb: 3 }} />
      <Typography variant="h5" gutterBottom>
        Redirecting...
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Please wait while we redirect you to your destination.
      </Typography>
    </Container>
  );
};

export default Redirect;
