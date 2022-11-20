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

import { RecordsTable } from "./RecordsTable";
import { useCountries } from "../Countries";
import { usePublicServants } from "../PublicServants";
import { useDiseases } from "../Diseases";
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

export const RecordsPage = () => {
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();

  const { data } = useQuery("records", () =>
    api.get("/records").then((res) => res.data)
  );
  const publicServants = usePublicServants();
  const diseases = useDiseases();
  const countries = useCountries();

  const createMutation = useMutation({
    mutationFn: (body) => {
      return api.post("/records/", body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries("records");
      handleClose();
    },
  });

  const { register, handleSubmit, reset } = useForm();

  const onCreate = ({ total_deaths, total_patients, ...rest }) => {
    createMutation.mutate({
      total_patients: Number(total_patients),
      total_deaths: Number(total_deaths),
      ...rest,
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
        <Typography variant="h3">Records</Typography>
        <Button onClick={handleOpen} variant="contained">
          Create
        </Button>
      </Box>
      <RecordsTable records={data ?? []} />
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <form onSubmit={handleSubmit(onCreate)}>
            <Typography variant="h5">Record form</Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                my: "20px",
              }}
            >
              <TextField required select label="Email" {...register("email")}>
                {publicServants.map(({ email }) => (
                  <MenuItem key={email} value={email}>
                    {email}
                  </MenuItem>
                ))}
              </TextField>
              <TextField required select label="Country" {...register("cname")}>
                {countries.map(({ cname }) => (
                  <MenuItem key={cname} value={cname}>
                    {cname}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                required
                select
                label="Disease code"
                {...register("disease_code")}
              >
                {diseases.map(({ disease_code }) => (
                  <MenuItem key={disease_code} value={disease_code}>
                    {disease_code}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                required
                label="Total deaths"
                type="number"
                min={0}
                {...register("total_deaths")}
              />
              <TextField
                required
                label="Total patients"
                type="number"
                min={0}
                {...register("total_patients")}
              />
            </Box>
            <Button type="submit">Create</Button>
          </form>
        </Box>
      </Modal>
    </div>
  );
};
