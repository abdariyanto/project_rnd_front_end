import Home from "pages/Home";
import Login from "pages/Login";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "assets/App.css";
import NotFound from "pages/NotFound";
import Users from "pages/Users";
import Register from "pages/Register";
import UsersGallery from "pages/UsersGallery";
import UsersGalleryDetail from "pages/UsersGalleryDetail";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/users" element={<Users />} />
        <Route path="/users_gallery" element={<UsersGallery />} />
        <Route path="/users_gallery_detail/:id" element={<UsersGalleryDetail />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
