import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/home/Home";
import Header from "./components/common/header/Header";
import Banner from "./components/common/banner/Banner";
import Footer from "./components/common/footer/Footer";

const App: React.FC = () => (
  <Router>
    <Header />
    <Banner />
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
    <Footer />
  </Router>
);

export default App;
