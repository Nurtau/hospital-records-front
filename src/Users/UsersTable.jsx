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
import { useCountries } from "../Countries";
import { modalStyle } from "../styles";

export const UsersTable = ({ users }) => {
  const [selected, setSelected] = useState(null);

  const countries = useCountries();

  const handleClose = () => setSelected(null);

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (key) => {
      return api.delete(`/users/${key}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries("users");
      queryClient.invalidateQueries("public-servants");
      queryClient.invalidateQueries("doctors");
    },
  });

  const onDelete = (email) => {
    deleteMutation.mutate(email);
  };

  const { register, handleSubmit, reset, getValues, setValue } = useForm();

  const updateMutation = useMutation({
    mutationFn: ({email, ...rest}) => {
      return api.put(`/users/${email}`, rest);
    },
    onSuccess: () => {
      queryClient.invalidateQueries("users");
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
            <TableCell align="center">Name</TableCell>
            <TableCell align="center">Surname</TableCell>
            <TableCell align="center">Salary</TableCell>
            <TableCell align="center">Phone</TableCell>
            <TableCell align="center">Country name</TableCell>
            <TableCell align="center"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map(({ email, name, surname, salary, phone, cname }) => (
            <TableRow
              hover
              key={email}
              sx={{ "&:last-child td, &:last-child th": { border: 0 }, "cursor": "pointer" }}
              onClick={() => openModal({ email, name, surname, salary, phone, cname })}
            >
              <TableCell align="center" component="th" scope="row">
                {email}
              </TableCell>
              <TableCell align="center">{name}</TableCell>
              <TableCell align="center">{surname}</TableCell>
              <TableCell align="center">{salary}</TableCell>
              <TableCell align="center">{phone}</TableCell>
              <TableCell align="center">{cname}</TableCell>
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
        <Box sx={modalStyle}>
          <form onSubmit={handleSubmit(onUpdate)}>
            <Typography variant="h5">Country form</Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "16px", my: "20px" }}>
              <TextField
                required
                label="Name"
                id="outlined-required"
                {...register("name")}
              />
              <TextField
                required
                label="Surname"
                {...register("surname")}
              />
              <TextField
                required
                label="Salary"
                type="number"
                {...register("salary")}
              />
              <TextField
                required
                label="Phone number"
                {...register("phone")}
              />
              <TextField
                required
                select
                label="Country"
                defaultValue={getValues().cname} 
                inputRef={register("cname")}
                onChange={e => setValue("cname", e.target.value, true)}
              >
                {countries.map(({cname}) => (
                  <MenuItem key={cname} value={cname}>{cname}</MenuItem>
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
