import React from "react";

interface Props {
  comments: Comment[];
}

interface Comment {
  id: string;
  content: string;
  status: "pending" | "approved" | "rejected";
}

const commentText = (comment: Comment) => {
  if (comment.status === "rejected") {
    return "Comment rejected";
  }
  if (comment.status === "pending") {
    return "Comment in moderation";
  }

  return comment.content;
};

const CommentList: React.FC<Props> = ({ comments }) => {
  if (!comments.length) {
    return null;
  }

  return (
    <ol>
      {comments.map((item) => (
        <li key={item.id}>{commentText(item)}</li>
      ))}
    </ol>
  );
};

export default CommentList;
