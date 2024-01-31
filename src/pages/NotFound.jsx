import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="container text-center my-5">
      <h1 className="display-1">404</h1>
      <p className="lead">Oops! Halaman yang Anda cari tidak ditemukan.</p>
      <p>Silakan kembali ke halaman utama.</p>
      <Link to="/" className="btn btn-primary">
        Kembali ke Halaman Utama
      </Link>
    </div>
  );
};

export default NotFound;
