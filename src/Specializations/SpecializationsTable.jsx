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

import { useDoctors } from "../Doctors";
import { useDiseaseTypes } from "../DiseaseTypes";
import { api } from "../api";
import { modalStyle } from "../styles";

export const SpecializationsTable = ({ specializations }) => {
  const [selected, setSelected] = useState(null);

  const handleClose = () => setSelected(null);

  const doctors = useDoctors();
  const diseaseTypes = useDiseaseTypes();

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (key) => {
      return api.delete(`/specializations/${key}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries("specializations");
    },
  });

  const onDelete = (id) => {
    deleteMutation.mutate(id);
  };

  const { register, handleSubmit, reset, setValue, getValues } = useForm();

  const updateMutation = useMutation({
    mutationFn: ({specialize_id, ...rest}) => {
      return api.put(`/specializations/${specialize_id}`, rest);
    },
    onSuccess: () => {
      queryClient.invalidateQueries("specializations");
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
      email: selected?.specialize_id,
      ...data
    });
  };

  return (
    <>
    <TableContainer sx={{ mt: "10px" }}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead sx={{ borderBottom: "2px solid black" }}>
          <TableRow>
            <TableCell align="center">Disease type ID</TableCell>
            <TableCell align="center">Email</TableCell>
            <TableCell align="center"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {specializations.map(({ specialize_id, email, id }) => (
            <TableRow
              hover
              key={specialize_id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 }, "cursor": "pointer" }}
              onClick={() => openModal({ specialize_id, email, id })}
            >
              <TableCell align="center" component="th" scope="row">
                {id}
              </TableCell>
              <TableCell align="center">{email}</TableCell>
              <TableCell align="center">
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  onClick={(event) => {
                    event.stopPropagation();
                    onDelete(specialize_id);
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
        <Box sx={modalStyle}>
          <form onSubmit={handleSubmit(onUpdate)}>
            <Typography variant="h5">Doctor form</Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "16px", my: "20px" }}>
              <TextField
                required
                select
                label="Disease Type ID"
                defaultValue={getValues().id} 
                inputRef={register("id")}
                onChange={e => setValue("id", e.target.value, true)}
              >
                {diseaseTypes.map(({id, description}) => (
                  <MenuItem key={id} value={id}>{description}</MenuItem>
                ))}
              </TextField> 

              <TextField
                required
                select
                label="Email"
                defaultValue={getValues().email} 
                inputRef={register("email")}
                onChange={e => setValue("email", e.target.value, true)}
              >
                {doctors.map(({email}) => (
                  <MenuItem key={email} value={email}>{email}</MenuItem>
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
