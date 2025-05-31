import * as React from 'react';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { IContact } from '../util/entity/contact.entity';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { contactsStore } from '../util/stores/contacts.store';
import { Box } from '@mui/material';
export const ContactItem: React.FC<{contact: IContact}> = (props) => {
  const navigate = useNavigate();

  const handleEditIconOnClick = () => {
    navigate(`/contacts/contact-form/${props.contact.id}`);
  };

  const handleDeleteIconOnClick = () => {
    contactsStore.deleteOne(props.contact.id);
  }
  
  return <TableRow
            key={props.contact.id}
            sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover .icons-container': { opacity: 1 } }}
          >
            <TableCell>{props.contact.fullName}</TableCell>
            <TableCell>{props.contact.phoneNumber}</TableCell>
            <TableCell>{props.contact.email}</TableCell>
            <TableCell>{props.contact.tags[0].id}</TableCell>
            <TableCell sx={{textAlign: "right"}} > 
                <Box className="icons-container" sx={{opacity: 0, transition: 'opacity 0.1s ease-in-out'}}>
                  <EditIcon onClick ={handleEditIconOnClick} sx={{cursor: "pointer", marginX: "10px", fontSize: "20px"}}/>
                  <DeleteIcon onClick={handleDeleteIconOnClick} sx={{cursor: "pointer", marginX: "10px", fontSize: "20px"}}/>
                </Box>
            </TableCell>
      </TableRow>
}