import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  BrowserRouter
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from 'react-query'

import { DiseaseTypesProvider } from "./DiseaseTypes";
import { DiseasesProvider } from "./Diseases";
import { CountriesProvider } from "./Countries";
import { UsersProvider } from "./Users";
import { PublicServantsProvider } from "./PublicServants";
import { DoctorsProvider } from "./Doctors";

const queryClient = new QueryClient()

import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <DiseaseTypesProvider>
          <DiseasesProvider>
            <CountriesProvider>
              <UsersProvider>
                <PublicServantsProvider>
                  <DoctorsProvider>
                    <App />
                  </DoctorsProvider>
                </PublicServantsProvider>
              </UsersProvider>
            </CountriesProvider>
          </DiseasesProvider>
        </DiseaseTypesProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
)
