import * as React from 'react';
import Box from '@mui/material/Box';
import { CircularProgress } from '@mui/material';

export const Loading: React.FC = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <CircularProgress color="inherit"/>
    </Box>
  );
}