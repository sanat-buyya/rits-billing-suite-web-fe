import React from "react";
import AppRouter from "../routes/AppRouter";
import { Provider } from "react-redux";
import { store } from "../App/store";
import ToastConfig from "../services/toastConfig";

function App() {
  return (
    <Provider store={store}>
      <div className="min-h-screen bg-gray-50">
        <AppRouter />
        <ToastConfig /> 
      </div>
    </Provider>
  );
}

export default App;
