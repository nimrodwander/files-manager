import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { ContactsList } from './ContactsList';
import { JSX } from 'react';
import { contactsStore } from '../util/stores/contacts.store';
import { useScroll } from '../hooks/useScroll';
import { Button } from '@mui/material';
import { NavigateFunction, useNavigate } from 'react-router-dom';

export const ContactsBoard: React.FC = () => {
  
  const tableNames: string[] = ["Full Name", "Phone Number", "Email", "Tags"];
  const containerRef: React.RefObject<HTMLDivElement | null> = useScroll(contactsStore);
  const navigate: NavigateFunction = useNavigate();

  const renderHeaderCells = (): JSX.Element[] =>{
    return tableNames.map((name: string):  React.JSX.Element => (
    <TableCell
      key={name}
      sx={{backgroundColor: "#2C2C2C"}}
    >
      {name}
    </TableCell>
    ))
  }

  const handleAddNewOnClick = (): void => {
    navigate('/contacts/contact-form');
  }

  return (
    <TableContainer component={Paper} elevation={5} ref={containerRef} sx={{
    borderRadius: "20px", 
    marginY: "50px", 
    marginX: "40px", height: "75vh", 
    overflow: 'auto',
    '&::-webkit-scrollbar': {
      width: '6px',
      marginY: "20px"
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#999',
      borderRadius: '3px',
      marginY: "20px"
    }}}>
      <Table stickyHeader aria-label="simple table">
        <TableHead>
          <TableRow>
            {renderHeaderCells()}
            <TableCell sx={{backgroundColor: "#2C2C2C"}}>
              <Button onClick={handleAddNewOnClick} variant="contained">Add New</Button>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
            <ContactsList/>
        </TableBody>
      </Table>
    </TableContainer>
  );
}