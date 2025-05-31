import React, { ReactNode, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  InputLabel,
  Select,
  Input,
  MenuItem,
  Checkbox,
  ListItemText,
  FormControl,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { IContact } from '../../util/entity/contact.entity';
import { ITag } from '../../util/entity/tag.entity';
import { useNavigate, useParams } from 'react-router-dom';
import { contactsStore } from '../../util/stores/contacts.store';
import { SelectChangeEvent, SelectInputProps } from '@mui/material/Select/SelectInput';
import { ContactFormConverter } from './ContactForm.converter';
import { IContactForm } from './contactForm.types';
import { tagsStore } from '../../util/stores/tags.store';

export const ContactForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const tagOptions: ITag[] = tagsStore.tags;
  
  const [tags, setTags] = useState<ITag[]>([]);
  
  const onSubmit = () => {
    // const contact: IContact = contactFormConverter.fromForm(getValues());
    // if(id){
    //   contactsStore.updateOne(id, contact);
    // }
    // else{
    //   contactsStore.createOne(contact);
    // }
    // navigate(-1);
  }

  const onClose = () => {
    navigate(-1);
  }

  const handleMultiSelectChange = (event: SelectChangeEvent<string[]>) => {
    const selectedIds = event.target.value as string[];
    const selectedTags = tagOptions.filter(tag => selectedIds.includes(tag.id));
    setTags(selectedTags);
  };

  const selectedIds = tags.map(tag => tag.id);

  return (
    <Dialog open={true} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Contact</DialogTitle>
      <Box component="form" onSubmit={onSubmit}>
        <DialogContent dividers>

              {/* Select Tags Input Fields*/}
              <FormControl fullWidth>
                <Select
                  multiple
                  value={selectedIds}
                  onChange={handleMultiSelectChange}
                  input={<Input />}
                  renderValue={(selected) => {
                    const selectedNames = tagOptions
                      .filter(tag => selected.includes(tag.id))
                      .map(tag => tag.name);
                    return selectedNames.join(', ');
                  }}
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
            Cancel
          </Button>
          <Button type="submit" variant="contained">
            Save
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};