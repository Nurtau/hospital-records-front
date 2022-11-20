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

export const DiseaseTypesTable = ({ diseaseTypes }) => {
  const [selected, setSelected] = useState(null);

  const handleClose = () => setSelected(null);

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id) => {
      return api.delete(`/disease-types/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries("disease-types");
      queryClient.invalidateQueries("diseases");
    },
  });

  const onDelete = (id) => {
    deleteMutation.mutate(id);
  };


  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      description: "cjheck",
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({id, ...rest}) => {
      return api.put(`/disease-types/${id}`, rest);
    },
    onSuccess: () => {
      queryClient.invalidateQueries("disease-types");
      handleClose();
      reset();
    },
  });
  
  const openModal = (data) => {
    reset(data);
    setSelected(data);
  }

  const onUpdate = ({description}) => {
    updateMutation.mutate({
      id: selected?.id,
      description,
    });
  };

  return (
    <>
    <TableContainer sx={{ mt: "10px" }}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead sx={{ borderBottom: "2px solid black" }}>
          <TableRow>
            <TableCell align="center">ID</TableCell>
            <TableCell align="center">Description</TableCell>
            <TableCell align="center"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {diseaseTypes.map(({ id, description }) => (
            <TableRow
              hover
              key={id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 }, "cursor": "pointer" }}
              onClick={() => openModal({id, description})}
            >
              <TableCell align="center" component="th" scope="row">
                {id}
              </TableCell>
              <TableCell align="center">{description}</TableCell>
              <TableCell align="center">
                <Button
                  sx={{position: "relative", zIndex: "10"}}
                  variant="contained"
                  color="error"
                  size="small"
                  onClick={(event) => {
                    event.stopPropagation();
                    onDelete(id);
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
            <Typography variant="h5">Disease type form</Typography>
            <Box sx={{ display: "flex", gap: "16px", my: "20px" }}>
              <TextField
                required
                label="Description"
                {...register("description")}
              />
            </Box>
            <Button type="submit">Save</Button>
          </form>
        </Box>
      </Modal>

    </>
  );
};
