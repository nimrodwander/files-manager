import { Box, Container } from '@mui/material';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { store } from './stores/store';
import { AppLineChart } from './ui/LineChart';

export const App: React.FC = () => {
    React.useEffect(() => {
      store.init(); 
    }, []);
    
  return (
     <BrowserRouter>
    <Box display={'flex'} flexDirection={'column'}>
      <Container>
        <AppLineChart/>
      </Container>
    </Box>
  </BrowserRouter>
  );
}


