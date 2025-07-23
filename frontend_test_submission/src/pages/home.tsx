import React, { useState } from 'react';
import { TextField, Button, Typography, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [originalUrl, setOriginalUrl] = useState('');
  const navigate = useNavigate();

  const handleShorten = () => {
    const shortId = Math.random().toString(36).substring(2, 8);
    const shortUrl = `${window.location.origin}/${shortId}`;
    const newEntry = {
      originalUrl,
      shortUrl,
      shortId,
      timestamp: new Date().toISOString(),
      clicks: 0,
    };
    const data = JSON.parse(localStorage.getItem('urlData') || '[]');
    data.push(newEntry);
    localStorage.setItem('urlData', JSON.stringify(data));
    setOriginalUrl('');
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>URL Shortener</Typography>
      <TextField
        label="Enter URL"
        fullWidth
        margin="normal"
        value={originalUrl}
        onChange={(e) => setOriginalUrl(e.target.value)}
      />
      <Button variant="contained" color="primary" onClick={handleShorten}>
        Shorten URL
      </Button>
      <Button onClick={() => navigate('/analytics')} style={{ marginLeft: 10 }}>
        View Analytics
      </Button>
    </Container>
  );
};

export default Home;