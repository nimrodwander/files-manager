import { Box, Container } from '@mui/material';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { store } from './stores/store';

export const App: React.FC = () => {
    React.useEffect(() => {
      store.init();
    }, []);
    
  return (
     <BrowserRouter>
    <Box display={'flex'} flexDirection={'column'}>
      <Container>
      </Container>
    </Box>
  </BrowserRouter>
  );
}


