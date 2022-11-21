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
import { usePublicServants } from "../PublicServants";
import { useDiseases } from "../Diseases";
import { modalStyle } from "../styles";

export const RecordsTable = ({ records }) => {
  const [selected, setSelected] = useState(null);

  const countries = useCountries();
  const publicServants = usePublicServants();
  const diseases = useDiseases();

  const handleClose = () => setSelected(null);

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (key) => {
      return api.delete(`/records/${key}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries("records");
    },
  });

  const onDelete = (email) => {
    deleteMutation.mutate(email);
  };

  const { register, handleSubmit, reset, setValue, getValues } = useForm();

  const updateMutation = useMutation({
    mutationFn: ({ record_id, ...rest }) => {
      return api.put(`/records/${record_id}`, rest);
    },
    onSuccess: () => {
      queryClient.invalidateQueries("records");
      handleClose();
      reset();
    },
  });

  const openModal = (data) => {
    reset(data);
    setSelected(data);
  };

  const onUpdate = (data) => {
    updateMutation.mutate({
      record_id: selected?.record_id,
      ...data,
    });
  };

  return (
    <>
      <TableContainer sx={{ mt: "10px" }}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead sx={{ borderBottom: "2px solid black" }}>
            <TableRow>
              <TableCell align="center">Email</TableCell>
              <TableCell align="center">Country name</TableCell>
              <TableCell align="center">Disease code</TableCell>
              <TableCell align="center">Total deaths</TableCell>
              <TableCell align="center">Total patients</TableCell>
              <TableCell align="center"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {records.map(
              ({
                record_id,
                email,
                cname,
                disease_code,
                total_deaths,
                total_patients,
              }) => (
                <TableRow
                  hover
                  key={email}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    openModal({
                      record_id,
                      email,
                      cname,
                      disease_code,
                      total_deaths,
                      total_patients,
                    })
                  }
                >
                  <TableCell align="center" component="th" scope="row">
                    {email}
                  </TableCell>
                  <TableCell align="center">{cname}</TableCell>
                  <TableCell align="center">{disease_code}</TableCell>
                  <TableCell align="center">{total_deaths}</TableCell>
                  <TableCell align="center">{total_patients}</TableCell>
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      onClick={(event) => {
                        event.stopPropagation();
                        onDelete(record_id);
                      }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Modal open={!!selected} onClose={handleClose}>
        <Box sx={modalStyle}>
          <form onSubmit={handleSubmit(onUpdate)}>
            <Typography variant="h5">Record form</Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                my: "20px",
              }}
            >
              <TextField required select label="Email"
defaultValue={getValues().email} 
                inputRef={register("email")}
                onChange={e => setValue("email", e.target.value, true)}

    >
                {publicServants.map(({ email }) => (
                  <MenuItem key={email} value={email}>
                    {email}
                  </MenuItem>
                ))}
              </TextField>
              <TextField required select label="Country"

defaultValue={getValues().cname} 
                inputRef={register("cname")}
                onChange={e => setValue("cname", e.target.value, true)}

    >
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
defaultValue={getValues().disease_code} 
                inputRef={register("disease_code")}
                onChange={e => setValue("disease_code", e.target.value, true)}


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
            <Button type="submit">Save</Button>
          </form>
        </Box>
      </Modal>
    </>
  );
};
