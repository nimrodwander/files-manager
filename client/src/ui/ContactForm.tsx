import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Select,
  Input,
  MenuItem,
  Checkbox,
  ListItemText,
  FormControl,
} from '@mui/material';
import { IContact } from '../util/entity/contact.entity';
import { ITag } from '../util/entity/tag.entity';
import { useNavigate, useParams } from 'react-router-dom';
import { contactsStore } from '../util/stores/contacts.store';
import { SelectChangeEvent } from '@mui/material/Select/SelectInput';
import { tagsStore } from '../util/stores/tags.store';

export const ContactForm: React.FC = () => {
  
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  //Gets the list of tags from store
  const tagOptions: ITag[] = tagsStore.tags;

  const cancelTitle: string = 'Cancel';
  const saveTitle: string = 'Save';
 
  const initDefaultValues = (): IContact => {
    if (id) {
      const contact: IContact = contactsStore.getOne(id);
      return {
        id: contact.id,
        createdAt: contact.createdAt,
        fullName: contact.fullName,
        email: contact.email,
        phoneNumber: contact.phoneNumber,
        tags: contact.tags,
      };
    } 
    else {
      return {
        id: '',
        createdAt: '',
        fullName: '',
        email: '',
        phoneNumber: '',
        tags: [],
      };
    }
  };

  const [formData, setFormData] = useState<IContact>(initDefaultValues());
  const selectedIds = formData.tags.map((tag) => tag.id);


  //Generic method for updating a text field
  const updateField = <K extends keyof IContact>(key: K, value: IContact[K]): void => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  //A method for updating the tags property (multi select)
  const handleMultiSelectChange = (event: SelectChangeEvent<string[]>): void => {
    const selectedIds = event.target.value as string[];
    const selectedTags = tagOptions.filter((tag) => selectedIds.includes(tag.id));
    updateField('tags', selectedTags);
  };


  const onSubmit = () => {
    const contact: IContact = {
      ...formData,
      id: id || '',
    };

    if (id) {
      contactsStore.updateOne(id, contact);
    } else {
      contactsStore.createOne(contact);
    }

    navigate(-1);
  };

  const onClose = () => {
    navigate(-1);
  };

  //If an id exists we are in edit mode if it does not we are creating a new contact "create new mode"
  const formTitle = id ? 'Edit Contact' : 'Add New Contact';

  //The value to be displayed as a value in the tags form field
  const renderValue = (selected: string[]): React.ReactNode => {
    const selectedNames = tagOptions
      .filter((tag) => selected.includes(tag.id))
      .map((tag) => tag.name);
    return selectedNames.join(', ');
  };

  return (
    <Dialog open={true} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{formTitle}</DialogTitle>
      <Box>
        <DialogContent dividers>

          {/* Full Name Field */}
          <FormControl fullWidth margin="normal">
            <TextField
              label="Full Name"
              variant="standard"
              value={formData.fullName}
              onChange={(e) => updateField('fullName', e.target.value)}
            />
          </FormControl>

          {/* Phone Number Field */}
          <FormControl fullWidth margin="normal">
            <TextField
              label="Phone Number"
              variant="standard"
              value={formData.phoneNumber}
              onChange={(e) => updateField('phoneNumber', e.target.value)}
            />
          </FormControl>

          {/* Email Field */}
          <FormControl fullWidth margin="normal">
            <TextField
              label="Email"
              variant="standard"
              value={formData.email}
              onChange={(e) => updateField('email', e.target.value)}
            />
          </FormControl>

          {/* Select Tags Field */}
          <FormControl fullWidth margin="normal">
            <Select
              multiple
              value={selectedIds}
              onChange={handleMultiSelectChange}
              input={<Input />}
              renderValue={renderValue}
            >
              {tagOptions.map((tag) => (
                <MenuItem key={tag.id} value={tag.id}>
                  <Checkbox checked={selectedIds.includes(tag.id)} />
                  <ListItemText primary={tag.name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary">
            {cancelTitle}
          </Button>
          <Button onClick={onSubmit} variant="contained">
            {saveTitle}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};