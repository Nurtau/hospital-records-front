import { Routes, Route } from "react-router-dom";
import { Box, Typography } from "@mui/material";

import "react-datepicker/dist/react-datepicker.css";

import { NavBar } from "./NavBar";
import { CountriesPage } from "./Countries";
import { DiseaseTypesPage } from "./DiseaseTypes";
import { DiseasesPage } from "./Diseases";
import { UsersPage } from "./Users";
import { PublicServantsPage } from "./PublicServants";
import { DoctorsPage } from "./Doctors";
import { SpecializationsPage } from "./Specializations";
import { RecordsPage } from "./Records";
import { DiscoveriesPage } from "./Discoveries";
import "./global.css";

const WelcomePage = () => {
  return <Typography sx={{marginTop: "120px"}} variant="h2" textAlign="center">Welcome to the 2nd assignment of CSCI341</Typography>;
}

function App() {
  return (
    <Box sx={{p: "24px"}}>
      <NavBar />
      <Routes>
        <Route path="/countries" element={<CountriesPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/disease-types" element={<DiseaseTypesPage />} />
        <Route path="/diseases" element={<DiseasesPage />} />
        <Route path="/public-servants" element={<PublicServantsPage />} />
        <Route path="/doctors" element={<DoctorsPage />} />
        <Route path="/specializations" element={<SpecializationsPage />} />
        <Route path="/records" element={<RecordsPage />} />
        <Route path="/discovers" element={<DiscoveriesPage />} />
        <Route path="*" element={<WelcomePage />} />
      </Routes>
    </Box>
  )
}

export default App
