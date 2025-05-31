import * as React from 'react';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { IContact } from '../util/entity/contact.entity';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';

export const ContactItem: React.FC<{contact: IContact}> = (props) => {
  const navigate = useNavigate();

  const handleEditClick = () => {
    navigate(`/contacts/${props.contact.id}`);
  };
  
  return <TableRow
            key={props.contact.id}
            sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover .edit-icon': { opacity: 1 } }}
          >
            <TableCell>{props.contact.fullName}</TableCell>
            <TableCell>{props.contact.phoneNumber}</TableCell>
            <TableCell>{props.contact.email}</TableCell>
            <TableCell>{props.contact.tags[0].id}</TableCell>
            <TableCell sx={{textAlign: "right"}} > 
                <EditIcon onClick ={handleEditClick} className="edit-icon" sx={{cursor: "pointer", marginX: "10px", fontSize: "20px", opacity: 0, transition: 'opacity 0.1s ease-in-out'}}/>
            </TableCell>
      </TableRow>
}