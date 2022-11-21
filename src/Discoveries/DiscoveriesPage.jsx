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
import DatePicker from "react-datepicker";

import { DiscoveriesTable } from "./DiscoveriesTable";
import { useCountries } from "../Countries";
import { useDiseases } from "../Diseases";
import { api } from "../api";
import { modalStyle } from "../styles";

export const DiscoveriesPage = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();

  const { data } = useQuery("discovers", () =>
    api.get("/discovers").then((res) => res.data)
  );
  const diseases = useDiseases();
  const countries = useCountries();

  const createMutation = useMutation({
    mutationFn: (body) => {
      return api.post("/discovers/", body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries("discovers");
      handleClose();
    },
  });

  const { register, handleSubmit, reset, getValues, setValue } = useForm({
    defaultValues: {
      first_enc_date: new Date(),
    }
  });

  const onCreate = ({ ...rest }) => {
    createMutation.mutate({
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
        <Typography variant="h3">Discovers</Typography>
        <Button onClick={handleOpen} variant="contained">
          Create
        </Button>
      </Box>
      <DiscoveriesTable discovers={data ?? []} />
      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          <form onSubmit={handleSubmit(onCreate)}>
            <Typography variant="h5">Discover form</Typography>
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
            <Button type="submit">Create</Button>
          </form>
        </Box>
      </Modal>
    </div>
  );
}
