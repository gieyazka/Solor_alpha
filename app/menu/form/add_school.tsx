import * as React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import { useForm } from "react-hook-form";

export default function AddSchoolDialog(props: {
  open: boolean;
  onClose: () => void;
  onSubmit: (schoolName: string) => Promise<void>;
}) {
  const { onClose, onSubmit, open } = props;
  const { register, handleSubmit, reset } = useForm({
    defaultValues: { schoolName: "" },
  });

  const handleFormSubmit = async (data: { schoolName: string }) => {
    try {
      await onSubmit(data.schoolName);
      reset();
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleCancel = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleCancel} maxWidth="sm" fullWidth>
      <DialogTitle>Add School Name</DialogTitle>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent>
          <TextField
            {...register("schoolName", { required: true })}
            label="School Name"
            placeholder="Enter school name"
            fullWidth
            margin="normal"
            autoFocus
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button type="submit" variant="contained">
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
