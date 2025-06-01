import React from 'react';
import { ContactsBoard } from './ui/ContactsBoard';
import { Box, Container} from '@mui/material';
import { NavBar } from './ui/Navbar';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ContactForm } from './ui/ContactForm';
import { contactsStore } from './util/stores/contacts.store';
import { tagsStore } from './util/stores/tags.store';

export const App: React.FC = () => {
    React.useEffect(() => {
      tagsStore.init();
      contactsStore.init();
    }, []);
    
  return (
     <BrowserRouter>
    <Box display={'flex'} flexDirection={'column'}>
      <NavBar/>
      <Container>
      <Routes>
        <Route path="/" element={<Navigate to="/contacts" replace />} />
        <Route path="/contacts/contact-form" element={<ContactForm />} />
        <Route path="/contacts/contact-form/:id" element={<ContactForm />} />
        <Route path="/contacts" element={<ContactsBoard />} />
      </Routes>
      </Container>
    </Box>
  </BrowserRouter>
  );
}


