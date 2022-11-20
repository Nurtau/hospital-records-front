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

import { useMutation, useQueryClient } from "react-query";
import { useForm } from "react-hook-form";
import { useState } from "react";

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

export const DoctorsTable = ({ doctors }) => {
  const [selected, setSelected] = useState(null);
  
  const handleClose = () => setSelected(null);

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (key) => {
      return api.delete(`/doctors/${key}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries("doctors");
      queryClient.invalidateQueries("specializations");
    },
  });

  const onDelete = (email) => {
    deleteMutation.mutate(email);
  };

  const { register, handleSubmit, reset } = useForm();

  const updateMutation = useMutation({
    mutationFn: ({email, ...rest}) => {
      return api.put(`/doctors/${email}`, rest);
    },
    onSuccess: () => {
      queryClient.invalidateQueries("doctors");
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
      email: selected?.email,
      ...data
    });
  };

  return (
    <>
    <TableContainer sx={{ mt: "10px" }}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead sx={{ borderBottom: "2px solid black" }}>
          <TableRow>
            <TableCell align="center">Email</TableCell>
            <TableCell align="center">Degree</TableCell>
            <TableCell align="center"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {doctors.map(({ email, degree }) => (
            <TableRow
              hover
              key={email}
              sx={{ "&:last-child td, &:last-child th": { border: 0 }, "cursor": "pointer" }}
              onClick={() => openModal({ email, degree })}
            >
              <TableCell align="center" component="th" scope="row">
                {email}
              </TableCell>
              <TableCell align="center">{degree}</TableCell>
              <TableCell align="center">
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  onClick={(event) => {
                    event.stopPropagation();
                    onDelete(email);
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
            <Typography variant="h5">Doctor form</Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "16px", my: "20px" }}>
              <TextField
                required
                label="Degree"
                id="outlined-required"
                {...register("degree")}
              />
            </Box>
            <Button type="submit">Save</Button>
          </form>
        </Box>
      </Modal>

    </>
  );
};
