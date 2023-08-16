import Router from "./src/navigation/router";
import { Provider } from "react-redux";
import { store } from "./src/store";

function App() {
  return (
      <Router />
  );
}

export default () => {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
};
