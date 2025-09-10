import { MemoryRouter, Routes, Route } from "react-router-dom";
import "../app.css";
import Demo from "./Demo";
import Details from "./Details";
import Authenticate from "./authentication";

export const Router = () => {
  return (
    <MemoryRouter>
      <main>
        <Routes>
          <Route path="/" element={<Demo />} />
          <Route path="/authenticate" element={<Authenticate />} />
          <Route path="/details" element={<Details />} />
        </Routes>
      </main>
    </MemoryRouter>
  );
};
