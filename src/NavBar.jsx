import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const SECTIONS = [
  {
    name: "Countries",
    url: "/countries",
  },
  {
    name: "Users",
    url: "/users",
  },
  {
    name: "Diseases",
    url: "/diseases",
  },
  {
    name: "Disease Types",
    url: "/disease-types",
  },
  {
    name: "Public servants",
    url: "/public-servants",
  },
  {
    name: "Doctors",
    url: "/doctors",
  },
  {
    name: "Specializations",
    url: "/specializations",
  },
  {
    name: "Records",
    url: "/records",
  },
  {
    name: "Discovers",
    url: "/discovers",
  }
];

export const NavBar = () => {
  return (
    <Box sx={{
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-around",
      bg: "blue",
      marginBottom: "32px",
    }}>
      {SECTIONS.map(({name, url}) => (
        <Typography key={name}>
          <Link to={url}>
            {name}
          </Link>
        </Typography>
      ))}
    </Box>
  );
}
