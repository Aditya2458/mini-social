import React from "react";
import { Card, CardContent, Typography, CardActions, IconButton, Avatar } from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";

export default function PostCard({ post, onLike, onComment }) {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Avatar>{post.authorName?.[0] || "U"}</Avatar>
          <div>
            <Typography variant="subtitle1">{post.authorName}</Typography>
            <Typography variant="caption">
              {new Date(post.createdAt).toLocaleString()}
            </Typography>
          </div>
        </div>
        {post.text && <Typography sx={{ mt: 1 }}>{post.text}</Typography>}
        {post.image && (
          <img
            src={post.image}
            alt="post"
            style={{ width: "100%", marginTop: 8, borderRadius: 8 }}
          />
        )}
      </CardContent>
      <CardActions>
        <IconButton onClick={() => onLike(post._id)}>
          <ThumbUpIcon />
        </IconButton>
        <Typography>{post.likes?.length || 0}</Typography>
        <IconButton onClick={() => onComment(post)}>
          <ChatBubbleOutlineIcon />
        </IconButton>
        <Typography>{post.comments?.length || 0}</Typography>
      </CardActions>
    </Card>
  );
}
