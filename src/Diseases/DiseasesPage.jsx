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

import { DiseasesTable } from "./DiseasesTable";
import { useDiseaseTypes } from "../DiseaseTypes";
import { useDiseases } from "./DiseasesProvider";
import { api } from "../api";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export const DiseasesPage = () => {
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();

  const data = useDiseases();
  const diseaseTypes = useDiseaseTypes();

  const createMutation = useMutation({
    mutationFn: (body) => {
      return api.post("/diseases/", body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries("diseases");
      handleClose();
    },
  });

  const { register, handleSubmit, reset } = useForm();

  const onCreate = ({ disease_code, pathogen, description, id }) => {
    createMutation.mutate({
      disease_code,
      pathogen,
      description,
      id,
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
        <Typography variant="h3">Diseases</Typography>
        <Button onClick={handleOpen} variant="contained">
          Create
        </Button>
      </Box>
      <DiseasesTable diseases={data ?? []} />
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <form onSubmit={handleSubmit(onCreate)}>
            <Typography variant="h5">Disease form</Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "16px", my: "20px" }}>
              <TextField
                required
                label="Disease code"
                id="outlined-required"
                {...register("disease_code")}
              />
              <TextField
                required
                label="Pathogen"
                id="outlined-required"
                {...register("pathogen")}
              />
              <TextField
                required
                label="Description"
                {...register("description")}
              />
              <TextField
                required
                select
                label="Disease Type ID"
                {...register("id")}
              >
                {diseaseTypes.map((type) => (
                  <MenuItem key={type.id} value={type.id}>{type.description}</MenuItem>
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
