import React, { ReactNode } from 'react';
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
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { IContact } from '../../util/entity/contact.entity';
import { ITag } from '../../util/entity/tag.entity';
import { useNavigate, useParams } from 'react-router-dom';
import { contactsStore } from '../../util/stores/contacts.store';
import { SelectChangeEvent, SelectInputProps } from '@mui/material/Select/SelectInput';
import { ContactFormConverter } from './ContactForm.converter';
import { IContactForm } from './contactForm.types';

export const ContactForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const contactFormConverter: ContactFormConverter = new ContactFormConverter();

  const defaultValuesInit = (): IContactForm => {
    const values: IContact | undefined = id ? contactsStore.getOne(id) : undefined;
    return contactFormConverter.toForm(values);
  }

  const { control, handleSubmit, getValues, setValue } = useForm<IContactForm>({
    defaultValues: defaultValuesInit()
  });

  const tagOptions: ITag[] = [{id: "1id", name: "1name"}, {id: "2id", name: "2name"}, {id: "3id", name: "3name"}];

  const onClose = () => {
    navigate(-1);
  }

  const onSubmit = () => {
    const contact: IContact = contactFormConverter.fromForm(getValues());
    if(id){
      contactsStore.updateOne(id, contact);
    }
    else{
      contactsStore.createOne(contact);
    }
    navigate(-1);
  }

  const handleMultiSelectChange = (event: SelectChangeEvent<Map<string, string>>, child: ReactNode) => {
    const x = event.target.value;
    console.log("value", x);
    //setValue("tags", getValues("tags.set()"));
  }

  const changeValue = (selected: any) => {
    return (selected as (string | number)[])
      .map((id) => tagOptions.find(tag => tag.id === id)?.name)
      .filter(Boolean)
      .join(', ');
  }

  return (
    <Dialog open={true} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Contact</DialogTitle>
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <DialogContent dividers>
          <Controller
            name="fullName"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Full Name" fullWidth margin="normal" variant="standard" />
            )}
          />

          <Controller
            name="phoneNumber"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Phone Number" fullWidth margin="normal" variant="standard" />
            )}
          />

          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Email" fullWidth margin="normal" variant="standard" />
            )}
          />

          <Controller
          name="tags"
          control={control}
          render={({ field }) => (
            <>
              <InputLabel>Tag</InputLabel>
              <Select
                label="Tags"
                fullWidth
                multiple
                onChange={handleMultiSelectChange}
                value={getValues().tags}
                input={<Input />}
                renderValue={(selected) => Array.from(selected.values()).join(', ')}
                //MenuProps={MenuProps}
              >
                {tagOptions.map((tag) => (
                  <MenuItem key={tag.id} value={tag.name}>
                    <Checkbox checked={getValues().tags.has(tag.id)} />
                    <ListItemText primary={tag.name} />
                  </MenuItem>
                ))}
              </Select>
            </>
          )}
        />
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