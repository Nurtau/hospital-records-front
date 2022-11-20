import { createContext, useContext } from "react";
import { useQuery } from "react-query";

import { api } from "../api";

const DataContext = createContext(null);

export const UsersProvider = ({children}) => {
  const { data } = useQuery("users", () =>
    api.get("/users").then((res) => res.data)
  );

  return <DataContext.Provider value={data ?? []}>{children}</DataContext.Provider>;
}

export const useUsers = () => {
  const users = useContext(DataContext);

  return users ?? [];
}
