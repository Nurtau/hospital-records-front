import { createContext, useContext } from "react";
import { useQuery } from "react-query";

import { api } from "../api";

const DataContext = createContext(null);

export const CountriesProvider = ({children}) => {
  const { data } = useQuery("countries", () =>
    api.get("/countries").then((res) => res.data)
  );

  return <DataContext.Provider value={data ?? []}>{children}</DataContext.Provider>;
}

export const useCountries = () => {
  const countries = useContext(DataContext);

  return countries ?? [];
}
