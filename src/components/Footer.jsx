import React from "react";

export default function Footer(props) {
  return (
    <footer className={`py-1 my-4 ${props.center && "text-center"}`}>
      <p className="text-center text-muted">&copy; 2024 Janisoft - Janisoft.com</p>
    </footer>
  );
}
