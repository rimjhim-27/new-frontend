
import React, { useState } from "react";
// ...existing code...
const Register = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(formData),
    });
    if (res.ok) alert("Registered!");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Name" onChange={(e) => setFormData({...formData, name: e.target.value })} />
      <input type="email" placeholder="Email" onChange={(e) => setFormData({...formData, email: e.target.value })} />
      <button type="submit">Register</button>
    </form>
  );
};