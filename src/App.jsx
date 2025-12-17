import { useState } from "react";
import reactLogo from "./assets/react.svg";

import "./App.css";

import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
// import { store } from "./store";
import AppRoutes from "./AppRoutes";

function App() {
  return (
    // <Provider store={store}>
      <AppRoutes />
    // </Provider>
  );
}

export default App;
