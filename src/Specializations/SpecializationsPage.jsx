import { useQuery, useQueryClient, useMutation } from "react-query";
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

import { SpecializationsTable } from "./SpecializationsTable";
import { useDoctors } from "../Doctors";
import { useDiseaseTypes } from "../DiseaseTypes";
import { api } from "../api";
import { modalStyle } from "../styles";

export const SpecializationsPage = () => {
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();

  const { data } = useQuery("specializations", () =>
    api.get("/specializations").then((res) => res.data)
  );

  const doctors = useDoctors();
  const diseaseTypes = useDiseaseTypes();

  const createMutation = useMutation({
    mutationFn: (body) => {
      return api.post("/specializations/", body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries("specializations");
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
        <Typography variant="h3">Specializations</Typography>
        <Button onClick={handleOpen} variant="contained">
          Create
        </Button>
      </Box>
      <SpecializationsTable specializations={data ?? []} />
      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          <form onSubmit={handleSubmit(onCreate)}>
            <Typography variant="h5">Specialization form</Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "16px", my: "20px" }}>
              <TextField
                required
                select
                label="Disease type id"
                {...register("id")}
              >
                {diseaseTypes.map(({id, description}) => (
                  <MenuItem key={id} value={id}>{description}</MenuItem>
                ))}
              </TextField> 

              <TextField
                required
                select
                label="Email"
                {...register("email")}
              >
                {doctors.map(({email}) => (
                  <MenuItem key={email} value={email}>{email}</MenuItem>
                ))}
              </TextField>
            </Box>
            <Button type="submit">Create</Button>
          </form>
        </Box>
      </Modal>
    </div>
  );
}
