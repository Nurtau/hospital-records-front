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

import { DoctorsTable } from "./DoctorsTable";
import { useDoctors } from "./DoctorsProvider";
import { useUsers } from "../Users";
import { usePublicServants } from "../PublicServants";
import { api } from "../api";
import { modalStyle } from "../styles";

export const DoctorsPage = () => {
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();

  const data = useDoctors();
  const users = useUsers();
  const publicServants = usePublicServants();

  const leftEmails = useMemo(() => {
    const servantEmails = new Set(publicServants.map(pS => pS.email));
    const doctorEmails = new Set(data.map(doctor => doctor.email));

    return users.map(user => user.email).filter(email => {
      return !servantEmails.has(email) && !doctorEmails.has(email); 
    });
  }, [data, users, publicServants]);

  const createMutation = useMutation({
    mutationFn: (body) => {
      return api.post("/doctors/", body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries("doctors");
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
        <Typography variant="h3">Doctors</Typography>
        <Button onClick={handleOpen} variant="contained">
          Create
        </Button>
      </Box>
      <DoctorsTable doctors={data ?? []} />
      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          <form onSubmit={handleSubmit(onCreate)}>
            <Typography variant="h5">Doctor form</Typography>
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
                label="Degree"
                id="outlined-required"
                {...register("degree")}
              />

            </Box>
            <Button type="submit">Create</Button>
          </form>
        </Box>
      </Modal>
    </div>
  );
}
