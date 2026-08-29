import { useEffect, useState } from "react";
import API from "../utils/api";

export default function CommentSection({ blogId }) {

  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");

  // LOAD COMMENTS
  const fetchComments = async () => {
    const { data } = await API.get(`/comments/${blogId}`);
    setComments(data.comments);
  };

  useEffect(() => {
    fetchComments();
  }, [blogId]);

  // ADD COMMENT
  const handleComment = async () => {

    if (!text) return;

    await API.post("/comments/add", {
      blogId,
      text,
    });

    setText("");
    fetchComments();
  };

  return (
    <div className="mt-10">

      <h2 className="text-2xl font-bold mb-4">
        Comments
      </h2>

      {/* INPUT */}
      <div className="flex gap-2 mb-6">

        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 p-3 rounded-xl bg-white/10"
        />

        <button
          onClick={handleComment}
          className="px-4 py-2 bg-cyan-500 rounded-xl"
        >
          Send
        </button>

      </div>

      {/* LIST */}
      <div className="space-y-4">

        {comments.map((c) => (
          <div
            key={c._id}
            className="p-3 bg-white/5 rounded-xl"
          >
            <p className="text-sm text-gray-300">
              {c.user?.username}
            </p>
            <p>{c.text}</p>
          </div>
        ))}

      </div>

    </div>
  );
}