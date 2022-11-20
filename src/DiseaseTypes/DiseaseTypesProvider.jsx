import { createContext, useContext } from "react";
import { useQuery } from "react-query";

import { api } from "../api";

const DataContext = createContext(null);

export const DiseaseTypesProvider = ({children}) => {
  const { data } = useQuery("disease-types", () =>
    api.get("/disease-types").then((res) => res.data)
  );

  return <DataContext.Provider value={data ?? []}>{children}</DataContext.Provider>;
}

export const useDiseaseTypes = () => {
  const diseaseTypes = useContext(DataContext);

  return diseaseTypes ?? [];
}
