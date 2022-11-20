import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";

import { useMutation, useQueryClient } from "react-query";
import { useForm } from "react-hook-form";
import { useState } from "react";

import { api } from "../api";
import { useDiseaseTypes } from "../DiseaseTypes";

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

export const DiseasesTable = ({ diseases }) => {
  const [selected, setSelected] = useState(null);

  const diseaseTypes = useDiseaseTypes();

  const handleClose = () => setSelected(null);

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (key) => {
      return api.delete(`/diseases/${key}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries("diseases");
      queryClient.invalidateQueries("records");
      queryClient.invalidateQueries("discovers");
    },
  });

  const onDelete = (disease_code) => {
    deleteMutation.mutate(disease_code);
  };

  const { register, handleSubmit, reset, setValue, getValues } = useForm();

  const updateMutation = useMutation({
    mutationFn: ({disease_code, ...rest}) => {
      return api.put(`/diseases/${disease_code}`, rest);
    },
    onSuccess: () => {
      queryClient.invalidateQueries("diseases");
      handleClose();
      reset();
    },
  });

  const openModal = (data) => {
    reset(data);
    setSelected(data);
  }

  const onUpdate = (data) => {
    updateMutation.mutate({
      disease_code: selected?.disease_code,
      ...data
    });
  };

  return (
    <>
    <TableContainer sx={{ mt: "10px" }}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead sx={{ borderBottom: "2px solid black" }}>
          <TableRow>
            <TableCell align="center">Disease code</TableCell>
            <TableCell align="center">Pathogen</TableCell>
            <TableCell align="center">Description</TableCell>
            <TableCell align="center">Disease type ID</TableCell>
            <TableCell align="center"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {diseases.map(({ disease_code, pathogen, description, id }) => (
            <TableRow
              hover
              key={disease_code}
              sx={{ "&:last-child td, &:last-child th": { border: 0 }, "cursor": "pointer" }}
              onClick={() => openModal({disease_code, pathogen, description, id})}
            >
              <TableCell align="center" component="th" scope="row">
                {disease_code}
              </TableCell>
              <TableCell align="center">{pathogen}</TableCell>
              <TableCell align="center">{description}</TableCell>
              <TableCell align="center">{id}</TableCell>
              <TableCell align="center">
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  onClick={(event) => {
                    event.stopPropagation();
                    onDelete(disease_code);
                  }}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
      <Modal
        open={!!selected}
        onClose={handleClose}
      >
        <Box sx={style}>
          <form onSubmit={handleSubmit(onUpdate)}>
            <Typography variant="h5">Country form</Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "16px", my: "20px" }}>
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
                defaultValue={getValues().id} 
                inputRef={register("id")}
                onChange={e => setValue("id", e.target.value, true)}
              >
                {diseaseTypes.map((type) => (
                  <MenuItem key={type.id} value={type.id}>{type.description}</MenuItem>
                ))}
              </TextField>
            </Box>
            <Button type="submit">Save</Button>
          </form>
        </Box>
      </Modal>

    </>
  );
};
