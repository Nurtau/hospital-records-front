import { useQueryClient, useMutation } from "react-query";
import {
  Typography,
  Box,
  Button,
  Modal,
  TextField,
  MenuItem,
} from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { UsersTable } from "./UsersTable";
import { useUsers } from "./UsersProvider";
import { useCountries } from "../Countries";
import { api } from "../api";
import { modalStyle } from "../styles";

export const UsersPage = () => {
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();

  const data = useUsers();
  const countries = useCountries();

  const createMutation = useMutation({
    mutationFn: (body) => {
      return api.post("/users/", body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries("users");
      handleClose();
    },
  });

  const { register, handleSubmit, reset } = useForm();

  const onCreate = ({ salary, ...rest }) => {
    createMutation.mutate({
      salary: Number(salary),
      ...rest
    });
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
        <Typography variant="h3">Users</Typography>
        <Button onClick={handleOpen} variant="contained">
          Create
        </Button>
      </Box>
      <UsersTable users={data ?? []} />
      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          <form onSubmit={handleSubmit(onCreate)}>
            <Typography variant="h5">User form</Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "16px", my: "20px" }}>
              <TextField
                required
                label="Email"
                id="outlined-required"
                {...register("email")}
              />
              <TextField
                required
                label="Name"
                id="outlined-required"
                {...register("name")}
              />
              <TextField
                required
                label="Surname"
                {...register("surname")}
              />
              <TextField
                required
                label="Salary"
                type="number"
                {...register("salary")}
              />
              <TextField
                required
                label="Phone number"
                type="number"
                {...register("phone")}
              />
              <TextField
                required
                select
                label="Country"
                {...register("cname")}
              >
                {countries.map(({cname}) => (
                  <MenuItem key={cname} value={cname}>{cname}</MenuItem>
                ))}
              </TextField>
            </Box>
            <Button type="submit">Create</Button>
          </form>
        </Box>
      </Modal>
    </div>
  );
};
