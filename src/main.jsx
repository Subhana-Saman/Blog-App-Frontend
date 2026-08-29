import React from "react";

import ReactDOM from "react-dom/client";

import {
  BrowserRouter,
} from "react-router-dom";

import { Provider } from "react-redux";

import { store } from "./redux/store";

import { ThemeProvider } from "./context/ThemeContext";

import { HelmetProvider } from "react-helmet-async";

import App from "./App";

import "./index.css";


ReactDOM.createRoot(
  document.getElementById("root")
).render(

  <Provider store={store}>

    <ThemeProvider>

      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >

        <HelmetProvider>

          <App />

        </HelmetProvider>

      </BrowserRouter>

    </ThemeProvider>

  </Provider>
);