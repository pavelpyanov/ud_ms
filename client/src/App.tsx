import React, { FormEventHandler, useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import CreateComment from "./components/CreateComment";
import CommentList from "./components/CommentList";

interface Comment {
  id: string;
  content: string;
  status: "pending" | "approved" | "rejected";
}

interface Post {
  id: string;
  title: string;
  comments: Comment[];
}

function App() {
  const [title, setTitle] = useState("");
  const [posts, setPosts] = useState<Record<string, Post>>();

  const onSubmit: FormEventHandler = async (e) => {
    e.preventDefault();
    try {
      if (title) {
        await axios.post("http://localhost:6001/posts", { title });
        setTitle("");
        fetchPosts();
      }
    } catch (error) {
      console.log(e);
    }
  };

  const fetchPosts = async () => {
    try {
      const { data } = await axios.get("http://localhost:6005/posts");
      setPosts(data);
    } catch (error) {}
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="App">
      <div className="card">
        <h3>Create Post</h3>
        <form onSubmit={onSubmit}>
          <label>Title</label>
          <br />
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
          <br />
          <button type="submit">Submit</button>
        </form>
      </div>
      {posts && (
        <>
          <h2>Posts</h2>
          <div className="arr">
            {Object.values(posts).map((item) => (
              <div key={item.id} className="card post">
                <h2>{item.title}</h2>
                <CreateComment id={item.id} fetchPosts={fetchPosts} />
                <CommentList comments={item.comments} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
