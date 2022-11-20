import { createContext, useContext } from "react";
import { useQuery } from "react-query";

import { api } from "../api";

const DataContext = createContext(null);

export const DoctorsProvider = ({children}) => {
  const { data } = useQuery("doctors", () =>
    api.get("/doctors").then((res) => res.data)
  );

  return <DataContext.Provider value={data ?? []}>{children}</DataContext.Provider>;
}

export const useDoctors = () => {
  const doctors = useContext(DataContext);

  return doctors ?? [];
}
