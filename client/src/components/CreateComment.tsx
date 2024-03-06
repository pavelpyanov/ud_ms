import axios from "axios";
import React, { FormEventHandler, useState } from "react";

interface Props {
  id: string;
  fetchPosts: () => void;
}

const CreateComment: React.FC<Props> = ({ id, fetchPosts }) => {
  const [value, setValue] = useState("");

  const onSubmit: FormEventHandler = async (e) => {
    e.preventDefault();
    try {
      if (value) {
        await axios.post(`http://localhost:6002/posts/${id}/comments`, {
          content: value,
        });
        setValue("");
        fetchPosts();
      }
    } catch (error) {
      console.log(e);
    }
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <label>Title</label>
        <br />
        <input value={value} onChange={(e) => setValue(e.target.value)} />
        <br />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default CreateComment;
