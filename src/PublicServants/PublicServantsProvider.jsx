import { createContext, useContext } from "react";
import { useQuery } from "react-query";

import { api } from "../api";

const DataContext = createContext(null);

export const PublicServantsProvider = ({children}) => {
  const { data } = useQuery("public-servants", () =>
    api.get("/public-servants").then((res) => res.data)
  );

  return <DataContext.Provider value={data ?? []}>{children}</DataContext.Provider>;
}

export const usePublicServants = () => {
  const publicServants = useContext(DataContext);

  return publicServants ?? [];
}
