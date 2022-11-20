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
import DatePicker from "react-datepicker";

import { api } from "../api";
import { useCountries } from "../Countries";
import { useDiseases } from "../Diseases";

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

export const DiscoveriesTable = ({ discovers }) => {
  const [startDate, setStartDate] = useState(new Date());
  const [selected, setSelected] = useState(null);

  const countries = useCountries();
  const diseases = useDiseases();

  const handleClose = () => setSelected(null);

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (key) => {
      return api.delete(`/discovers/${key}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries("discovers");
    },
  });

  const onDelete = (email) => {
    deleteMutation.mutate(email);
  };

  const { register, handleSubmit, reset, setValue, getValues } = useForm(
    {
      defaultValues: {
        first_enc_date: new Date(),
      }
    }
  );

  const updateMutation = useMutation({
    mutationFn: ({ discover_id, ...rest }) => {
      return api.put(`/discovers/${discover_id}`, rest);
    },
    onSuccess: () => {
      queryClient.invalidateQueries("discovers");
      handleClose();
      reset();
    },
  });

  const openModal = (data) => {
    reset(data);
    setStartDate(data.first_enc_date);
    setSelected(data);
  };

  const onUpdate = (data) => {
    updateMutation.mutate({
      record_id: selected?.discover_id,
      ...data,
    });
  };

  return (
    <>
      <TableContainer sx={{ mt: "10px" }}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead sx={{ borderBottom: "2px solid black" }}>
            <TableRow>
              <TableCell align="center">Country name</TableCell>
              <TableCell align="center">Disease code</TableCell>
              <TableCell align="center">First encounter date</TableCell>
              <TableCell align="center"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {discovers.map(
              ({
                discover_id,
                cname,
                disease_code,
                first_enc_date,
              }) => (
                <TableRow
                  hover
                  key={discover_id}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    openModal({
                       discover_id,
                cname,
                disease_code,
                first_enc_date: new Date(first_enc_date),
                    })
                  }
                >
                  <TableCell align="center">{cname}</TableCell>
                  <TableCell align="center">{disease_code}</TableCell>
                  <TableCell align="center">{new Date(first_enc_date).toLocaleDateString()}</TableCell>
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      onClick={(event) => {
                        event.stopPropagation();
                        onDelete(discover_id);
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
        <Box sx={style}>
          <form onSubmit={handleSubmit(onUpdate)}>
            <Typography variant="h5">Discovery form</Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                my: "20px",
              }}
            >
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
              <DatePicker 
                dateFormat="dd/MM/yyyy"
                maxDate={new Date()}
selected={startDate} onChange={(date) => {
                  setStartDate(date);
                  setValue("first_enc_date", date, true);
                }}
                customInput={<TextField required />}
    />
              
            </Box>
            <Button type="submit">Save</Button>
          </form>
        </Box>
      </Modal>
    </>
  );
};
