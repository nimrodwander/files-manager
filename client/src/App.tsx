import React from 'react';
import { ContactsBoard } from './ui/ContactsBoard';
import { Box, Container} from '@mui/material';
import { NavBar } from './ui/Navbar';

export const App: React.FC = () => {
  return (
    <Box display={'flex'} flexDirection={'column'}>
      <NavBar/>
      <Container>
        <ContactsBoard/>
      </Container>
    </Box>
  );
}


