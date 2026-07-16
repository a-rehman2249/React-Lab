import React from "react";
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import Blog from "./Blog";
import Home from "./Home";
import Contact from "./Contact";
import Error from "./Error";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Link to='/'>Home</Link>
        <Link to='/blogs'>Blog</Link>
        <Link to='/contact'>Contact</Link>
        <Routes>
          <Route index element={<Home />} />
          <Route path="blogs" element={<Blog />} />
          <Route path="contact" element={<Contact />} />
          <Route path="*" element={<Error />}/>
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
