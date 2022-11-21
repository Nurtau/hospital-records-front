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
import { modalStyle } from "../styles";

export const CountriesTable = ({ countries }) => {
  const [selected, setSelected] = useState(null);

  const handleClose = () => setSelected(null);

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (key) => {
      return api.delete(`/countries/${key}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries("users");
      queryClient.invalidateQueries("countries");
      queryClient.invalidateQueries("records");
      queryClient.invalidateQueries("discovers");
    },
  });

  const onDelete = (cname) => {
    deleteMutation.mutate(cname);
  };

  const { register, handleSubmit, reset } = useForm();

  const updateMutation = useMutation({
    mutationFn: ({cname, ...rest}) => {
      return api.put(`/countries/${cname}`, rest);
    },
    onSuccess: () => {
      queryClient.invalidateQueries("countries");
      handleClose();
      reset();
    },
  });

  const openModal = (data) => {
    reset(data);
    setSelected(data);
  }

  const onUpdate = ({population}) => {
    updateMutation.mutate({
      cname: selected?.cname,
      population: Number(population),
    });
  };

  return (
    <>
    <TableContainer sx={{ mt: "10px" }}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead sx={{ borderBottom: "2px solid black" }}>
          <TableRow>
            <TableCell align="center">Country name</TableCell>
            <TableCell align="center">Population</TableCell>
            <TableCell align="center"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {countries.map(({ cname, population }) => (
            <TableRow
              hover
              key={cname}
              sx={{ "&:last-child td, &:last-child th": { border: 0 }, "cursor": "pointer" }}
              onClick={() => openModal({cname, population})}
            >
              <TableCell align="center" component="th" scope="row">
                {cname}
              </TableCell>
              <TableCell align="center">{population}</TableCell>
              <TableCell align="center">
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  onClick={(event) => {
                    event.stopPropagation();
                    onDelete(cname);
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
            <Typography variant="h5">Country form</Typography>
            <Box sx={{ display: "flex", gap: "16px", my: "20px" }}>
              <TextField
                required
                label="Population"
                placeholder="10000"
                type="number"
                {...register("population", { min : 0})}
              />
            </Box>
            <Button type="submit">Save</Button>
          </form>
        </Box>
      </Modal>

    </>
  );
};
