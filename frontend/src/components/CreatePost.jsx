import React, { useState } from "react";
import API from "../api";
import { TextField, Button, Box, Input } from "@mui/material";

export default function CreatePost({ onPosted }) {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);

  const handlePost = async () => {
    if (!text && !file) return alert("Add text or image first!");

    const formData = new FormData();
    formData.append("text", text);
    if (file) formData.append("image", file);

    try {
      const token = localStorage.getItem("token"); // ✅ get token

      const res = await API.post("/posts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`, // ✅ send token
        },
      });

      onPosted(res.data);
      setText("");
      setFile(null);
    } catch (err) {
      console.error("❌ Error creating post:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Error creating post");
    }
  };

  return (
    <Box sx={{ mb: 3 }}>
      <TextField
        fullWidth
        multiline
        rows={2}
        placeholder="What's on your mind?"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <Input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        sx={{ mt: 1 }}
      />
      <Button variant="contained" sx={{ mt: 1 }} onClick={handlePost}>
        POST
      </Button>
    </Box>
  );
}
