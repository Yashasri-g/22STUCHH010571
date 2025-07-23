import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Card,
  CardContent,
  Box,
  Chip,
  Link,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  Alert
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Log } from '../logger';
import { LogLevel } from '../logger/types';

interface ClickDetail {
  timestamp: Date;
  source: string;
  location: string;
}

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

const Analytics: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<UrlEntry[]>([]);

  const logMessage = async (level: LogLevel, message: string) => {
    await Log({
      timestamp: new Date().toISOString(),
      level,
      message,
      source: 'Analytics',
      package: 'frontend_test_submission'
    });
  };

  useEffect(() => {
    const loadAnalyticsData = async () => {
      try {
        await logMessage('info', 'Loading analytics data from localStorage');
        
        const storedData = localStorage.getItem('urlData');
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          // Convert date strings back to Date objects
          const processedData = parsedData.map((entry: any) => ({
            ...entry,
            createdAt: new Date(entry.createdAt),
            expiresAt: new Date(entry.expiresAt),
            clickDetails: entry.clickDetails?.map((click: any) => ({
              ...click,
              timestamp: new Date(click.timestamp)
            })) || []
          }));
          
          setAnalyticsData(processedData);
          await logMessage('info', `Loaded ${processedData.length} URL entries for analytics`);
        } else {
          await logMessage('info', 'No analytics data found in localStorage');
          setAnalyticsData([]);
        }
      } catch (error) {
        await logMessage('error', `Error loading analytics data: ${error}`);
        setAnalyticsData([]);
      }
    };

    loadAnalyticsData();
  }, []);

  const isExpired = (expiresAt: Date): boolean => {
    return new Date() > expiresAt;
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleString();
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      await logMessage('info', `Copied to clipboard: ${text}`);
    } catch (err) {
      await logMessage('error', `Failed to copy to clipboard: ${err}`);
    }
  };

  if (analyticsData.length === 0) {
    return (
      <Container maxWidth="lg">
        <Typography variant="h4" component="h1" gutterBottom>
          URL Shortener Statistics
        </Typography>
        <Alert severity="info">
          No shortened URLs found. Create some URLs first to see analytics data here.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        URL Shortener Statistics
      </Typography>
      
      <Typography variant="body1" color="text.secondary" paragraph>
        View all your shortened URLs and their click analytics.
      </Typography>

      <TableContainer component={Paper} sx={{ mb: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Short URL</TableCell>
              <TableCell>Original URL</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Expires</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Total Clicks</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {analyticsData.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>
                  <Link 
                    href={entry.shortUrl} 
                    target="_blank" 
                    rel="noopener"
                    onClick={() => logMessage('info', `Clicked on short URL: ${entry.shortUrl}`)}
                  >
                    {entry.shortUrl}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link href={entry.originalUrl} target="_blank" rel="noopener">
                    {entry.originalUrl.length > 50 
                      ? `${entry.originalUrl.substring(0, 50)}...` 
                      : entry.originalUrl}
                  </Link>
                </TableCell>
                <TableCell>{formatDate(entry.createdAt)}</TableCell>
                <TableCell>{formatDate(entry.expiresAt)}</TableCell>
                <TableCell>
                  <Chip
                    label={isExpired(entry.expiresAt) ? 'Expired' : 'Active'}
                    color={isExpired(entry.expiresAt) ? 'error' : 'success'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={entry.clicks}
                    color="primary"
                    variant="outlined"
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Link
                    component="button"
                    variant="body2"
                    onClick={() => copyToClipboard(entry.shortUrl)}
                  >
                    Copy URL
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Detailed Click Analytics */}
      <Typography variant="h5" component="h2" gutterBottom>
        Detailed Click Analytics
      </Typography>

      {analyticsData.map((entry) => (
        <Accordion key={`details-${entry.id}`} sx={{ mb: 1 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
              <Typography variant="h6">
                {entry.shortCode}
              </Typography>
              <Chip
                label={`${entry.clicks} clicks`}
                size="small"
                color="primary"
                variant="outlined"
              />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto' }}>
                {entry.originalUrl.length > 60 
                  ? `${entry.originalUrl.substring(0, 60)}...` 
                  : entry.originalUrl}
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                <strong>Short URL:</strong> {entry.shortUrl}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Original URL:</strong> {entry.originalUrl}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Created:</strong> {formatDate(entry.createdAt)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Expires:</strong> {formatDate(entry.expiresAt)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Validity:</strong> {entry.validityMinutes} minutes
              </Typography>
            </Box>

            {entry.clickDetails && entry.clickDetails.length > 0 ? (
              <>
                <Typography variant="h6" gutterBottom>
                  Click History ({entry.clickDetails.length} clicks)
                </Typography>
                <List dense>
                  {entry.clickDetails.map((click, index) => (
                    <ListItem key={index} divider>
                      <ListItemText
                        primary={`Click ${index + 1}`}
                        secondary={
                          <Box>
                            <Typography variant="body2">
                              <strong>Time:</strong> {formatDate(click.timestamp)}
                            </Typography>
                            <Typography variant="body2">
                              <strong>Source:</strong> {click.source}
                            </Typography>
                            <Typography variant="body2">
                              <strong>Location:</strong> {click.location}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </>
            ) : (
              <Alert severity="info">
                No clicks recorded for this URL yet.
              </Alert>
            )}
          </AccordionDetails>
        </Accordion>
      ))}
    </Container>
  );
};

export default Analytics;

export default Analytics;
