import ReactDOM from "react-dom/client";

import "./style.css";
import AuthWrapper from "./components/AuthWrapper";
import Home from "./pages/home";

const UI = () => {
  return (
    <AuthWrapper>
      <Home />
    </AuthWrapper>
  );
};

const root = ReactDOM.createRoot(document.getElementById("react-page"));

root.render(<UI />);
