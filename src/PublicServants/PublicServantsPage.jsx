import { useQueryClient, useMutation } from "react-query";
import {
  Typography,
  Box,
  Button,
  Modal,
  TextField,
  MenuItem,
} from "@mui/material";
import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";

import { PublicServantsTable } from "./PublicServantsTable";
import { usePublicServants } from "./PublicServantsProvider";
import { useUsers } from "../Users";
import { useDoctors } from "../Doctors";
import { api } from "../api";
import { modalStyle } from "../styles";

export const PublicServantsPage = () => {
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();

  const data = usePublicServants();
  const users = useUsers();
  const doctors = useDoctors();

const leftEmails = useMemo(() => {
    const servantEmails = new Set(data.map(pS => pS.email));
    const doctorEmails = new Set(doctors.map(doctor => doctor.email));

    return users.map(user => user.email).filter(email => {
      return !servantEmails.has(email) && !doctorEmails.has(email); 
    });
  }, [data, users, doctors]);


  const createMutation = useMutation({
    mutationFn: (body) => {
      return api.post("/public-servants/", body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries("public-servants");
      handleClose();
    },
  });

  const { register, handleSubmit, reset } = useForm();

  const onCreate = (data) => {
    createMutation.mutate(data);
  };

  const handleOpen = () => {
    setOpen(true);
    reset();
  };

  const handleClose = () => setOpen(false);

  return (
    <div>
      <Box
        sx={{
          mt: "20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h3">Public servants</Typography>
        <Button onClick={handleOpen} variant="contained">
          Create
        </Button>
      </Box>
      <PublicServantsTable publicServants={data ?? []} />
      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          <form onSubmit={handleSubmit(onCreate)}>
            <Typography variant="h5">Public servant form</Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "16px", my: "20px" }}>
              <TextField
                required
                select
                label="Email"
                {...register("email")}
              >
                {leftEmails.map((email) => (
                  <MenuItem key={email} value={email}>{email}</MenuItem>
                ))}
              </TextField>          
              <TextField
                required
                label="Department"
                id="outlined-required"
                {...register("department")}
              />

            </Box>
            <Button type="submit">Create</Button>
          </form>
        </Box>
      </Modal>
    </div>
  );
}
