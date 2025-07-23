import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm" sx={{ mt: 8, textAlign: 'center' }}>
      <ErrorOutlineIcon sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
      <Typography variant="h4" component="h1" gutterBottom>
        URL Not Found
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        The short URL you're looking for doesn't exist or may have been removed.
      </Typography>
      <Box sx={{ mt: 3 }}>
        <Button 
          variant="contained" 
          onClick={() => navigate('/')}
          sx={{ mr: 2 }}
        >
          Create New URL
        </Button>
        <Button 
          variant="outlined" 
          onClick={() => navigate('/analytics')}
        >
          View Analytics
        </Button>
      </Box>
    </Container>
  );
};

export default NotFound;