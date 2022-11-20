import { useQuery, useQueryClient, useMutation } from "react-query";
import { Typography, Box, Button, Modal, TextField } from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { CountriesTable } from "./CountriesTable";
import { useCountries } from "./CountriesProvider";
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

export const CountriesPage = () => {
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();

  const data = useCountries();

  const createMutation = useMutation({
    mutationFn: (body) => {
      return api.post("/countries/", body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries("countries");
      handleClose();
    },
  });

  const { register, handleSubmit, reset } = useForm();

  const onCreate = ({cname, population}) => {
    createMutation.mutate({
      cname,
      population: Number(population),
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
        <Typography variant="h3">Countries</Typography>
        <Button onClick={handleOpen} variant="contained">
          Create
        </Button>
      </Box>
      <CountriesTable countries={data ?? []} />
      <Modal
        open={open}
        onClose={handleClose}
      >
        <Box sx={style}>
          <form onSubmit={handleSubmit(onCreate)}>
            <Typography variant="h5">Country form</Typography>
            <Box sx={{ display: "flex", gap: "16px", my: "20px" }}>
              <TextField
                required
                label="Country name"
                placeholder="Kazakhstan"
                id="outlined-required"
                {...register("cname")}
              />
              <TextField
                required
                label="Population"
                placeholder="10000"
                type="number"
                {...register("population", { min : 0})}
              />
            </Box>
            <Button type="submit">Create</Button>
          </form>
        </Box>
      </Modal>
    </div>
  );
};
