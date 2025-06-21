import ReactDOM from "react-dom/client";
import App from "./App";
import store from "./store";
import { Provider } from "react-redux";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from "react-bootstrap";

ReactDOM.createRoot(document.getElementById("root")).render(
    <Provider store={store}>
        <Container className="py-4">
            <App />
        </Container>
    </Provider>
);
