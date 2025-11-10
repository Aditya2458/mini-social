import React, { useState } from "react";
import API from "../api";
import { TextField, Button, Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      const res = await API.post("/auth/signup", form);
      localStorage.setItem("token", res.data.token);
      navigate("/feed");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 6 }}>
      <Typography variant="h5" gutterBottom>Sign Up</Typography>
      <TextField label="Username" fullWidth margin="normal"
        value={form.username} onChange={(e)=>setForm({...form,username:e.target.value})}/>
      <TextField label="Email" fullWidth margin="normal"
        value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})}/>
      <TextField label="Password" type="password" fullWidth margin="normal"
        value={form.password} onChange={(e)=>setForm({...form,password:e.target.value})}/>
      <Button fullWidth variant="contained" sx={{ mt: 2 }} onClick={handleSignup}>Sign Up</Button>
      <Typography sx={{ mt: 2 }}>
        Already have an account? <a href="/login">Login</a>
      </Typography>
    </Container>
  );
}
