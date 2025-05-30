import * as React from 'react';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { observer } from 'mobx-react-lite';
import { IContact } from '../util/entity/contact';
import EditIcon from '@mui/icons-material/Edit';
import { IconButton } from '@mui/material';

export const EditFormButton: React.FC = () => {
  const [openFormModal, setOpenForm] = React.useState<boolean>(false);
  return <EditIcon onClick={() => setOpenForm(true)} className="edit-icon" sx={{cursor: "pointer", marginX: "10px", fontSize: "20px", opacity: 0, transition: 'opacity 0.1s ease-in-out'}}/>;
}

export const ContactItem: React.FC<{contact: IContact}> = (props) => {

  return <TableRow
            key={props.contact.id}
            sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover .edit-icon': { opacity: 1 } }}
          >
            <TableCell>{props.contact.fullName}</TableCell>
            <TableCell>{props.contact.phoneNumber}</TableCell>
            <TableCell>{props.contact.email}</TableCell>
            <TableCell>{props.contact.tags[0].id}</TableCell>
            <TableCell sx={{textAlign: "right"}} > 
                <EditIcon className="edit-icon" sx={{cursor: "pointer", marginX: "10px", fontSize: "20px", opacity: 0, transition: 'opacity 0.1s ease-in-out'}}/>
            </TableCell>
      </TableRow>
}