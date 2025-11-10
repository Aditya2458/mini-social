import React, { useState } from "react";
import API from "../api";
import { TextField, Button, Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await API.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      navigate("/feed");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 6 }}>
      <Typography variant="h5" gutterBottom>Login</Typography>
      <TextField label="Email" fullWidth margin="normal"
        value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})}/>
      <TextField label="Password" type="password" fullWidth margin="normal"
        value={form.password} onChange={(e)=>setForm({...form,password:e.target.value})}/>
      <Button fullWidth variant="contained" sx={{ mt: 2 }} onClick={handleLogin}>Login</Button>
      <Typography sx={{ mt: 2 }}>
        Don't have an account? <a href="/signup">Sign Up</a>
      </Typography>
    </Container>
  );
}
