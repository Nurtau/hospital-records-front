import { useQueryClient, useMutation } from "react-query";
import { Typography, Box, Button, Modal, TextField } from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { DiseaseTypesTable } from "./DiseaseTypesTable";
import { useDiseaseTypes } from "./DiseaseTypesProvider";
import { api } from "../api";
import { modalStyle } from "../styles";

export const DiseaseTypesPage = () => {
 const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();

  const data = useDiseaseTypes();
  const createMutation = useMutation({
    mutationFn: (body) => {
      return api.post("/disease-types/", body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries("disease-types");
      handleClose();
    },
  });

  const { register, handleSubmit, reset } = useForm();

  const onCreate = ({id, description}) => {
    createMutation.mutate({
      id: Number(id),
      description,
    });
  };

  const handleOpen = () => {
    setOpen(true);
    reset();
  }

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
        <Typography variant="h3">Disease types</Typography>
        <Button onClick={handleOpen} variant="contained">
          Create
        </Button>
      </Box>
      <DiseaseTypesTable diseaseTypes={data ?? []} />
      <Modal
        open={open}
        onClose={handleClose}
      >
        <Box sx={modalStyle}>
          <form onSubmit={handleSubmit(onCreate)}>
            <Typography variant="h5">Disease type form</Typography>
            <Box sx={{ display: "flex", gap: "16px", my: "20px" }}>
              <TextField
                required
                label="ID"
                placeholder="20"
                type="number"
                id="outlined-required"
                {...register("id")}
              />
              <TextField
                required
                label="Description"
                {...register("description")}
              />
            </Box>
            <Button type="submit">Create</Button>
          </form>
        </Box>
      </Modal>
    </div>
  );
}
