import { createContext, useContext } from "react";
import { useQuery } from "react-query";

import { api } from "../api";

const DataContext = createContext(null);

export const DiseasesProvider = ({children}) => {
  const { data } = useQuery("diseases", () =>
    api.get("/diseases").then((res) => res.data)
  );

  return <DataContext.Provider value={data ?? []}>{children}</DataContext.Provider>;
}

export const useDiseases = () => {
  const diseases = useContext(DataContext);

  return diseases ?? [];
}
