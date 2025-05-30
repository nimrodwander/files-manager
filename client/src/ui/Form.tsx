import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Autocomplete,
  Box,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { IContact } from '../util/entity/contact.entity';
import { ITag } from '../util/entity/tag.entity';

interface ContactModalFormProps {
  open: boolean;
  contact: IContact;
  tagOptions: ITag[];
  onClose: () => void;
  onSubmit: (data: IContact) => void;
}

export const ContactModalForm: React.FC<ContactModalFormProps> = ({
  open,
  contact,
  tagOptions,
  onClose,
  onSubmit,
}) => {
  const { control, handleSubmit } = useForm<IContact>({
    defaultValues: contact,
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Contact</DialogTitle>
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <DialogContent dividers>
          <Controller
            name="fullName"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Full Name" fullWidth margin="normal" />
            )}
          />

          <Controller
            name="phoneNumber"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Phone Number" fullWidth margin="normal" />
            )}
          />

          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Email" fullWidth margin="normal" />
            )}
          />

          <Controller
            name="tags"
            control={control}
            render={({ field }) => (
              <Autocomplete
                multiple
                options={tagOptions}
                value={field.value}
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={(_, value) => field.onChange(value)}
                renderInput={(params) => (
                  <TextField {...params} label="Tags" margin="normal" />
                )}
              />
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