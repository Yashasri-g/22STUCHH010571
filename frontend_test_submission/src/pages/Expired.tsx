import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const Expired: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm" sx={{ mt: 8, textAlign: 'center' }}>
      <AccessTimeIcon sx={{ fontSize: 80, color: 'warning.main', mb: 2 }} />
      <Typography variant="h4" component="h1" gutterBottom>
        URL Expired
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        This short URL has expired and is no longer valid. The validity period has passed.
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

export default Expired;