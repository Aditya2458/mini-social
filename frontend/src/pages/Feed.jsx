import React, { useState, useEffect } from "react";
import API from "../api";
import { Container, AppBar, Toolbar, Typography, Button } from "@mui/material";
import CreatePost from "../components/CreatePost";
import PostCard from "../components/PostCard";

export default function Feed() {
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    try {
      const res = await API.get("/posts?page=1&limit=20");
      setPosts(res.data);
    } catch (err) {
      console.error(err);
      alert("Error loading feed");
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePosted = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  const handleLike = async (postId) => {
    try {
      const res = await API.post(`/posts/${postId}/like`);
      setPosts((prev) =>
        prev.map((p) => (p._id === postId ? { ...p, likes: res.data.likes } : p))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleComment = async (post) => {
    const text = prompt("Enter your comment:");
    if (!text) return;
    try {
      const res = await API.post(`/posts/${post._id}/comment`, { text });
      setPosts((prev) =>
        prev.map((p) =>
          p._id === post._id
            ? { ...p, comments: [...(p.comments || []), res.data.comment] }
            : p
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Mini Social
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="sm" sx={{ mt: 2 }}>
        <CreatePost onPosted={handlePosted} />
        {posts.map((post) => (
          <PostCard
            key={post._id}
            post={post}
            onLike={handleLike}
            onComment={handleComment}
          />
        ))}
      </Container>
    </>
  );
}
