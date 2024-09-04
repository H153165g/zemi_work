import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./grah";
import About from "./detail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="title" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
