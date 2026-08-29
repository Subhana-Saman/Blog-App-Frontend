import axios from "axios";
import { useState } from "react";

const LikeButton = ({ blogId }) => {
  const [liked, setLiked] =
    useState(false);

  const [likes, setLikes] =
    useState(0);

  const handleLike = async () => {
    try {
      const token =
        localStorage.getItem("token");

      const { data } = await axios.put(
        `${
          import.meta.env.VITE_API_URL
        }/api/blogs/like/${blogId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLiked(data.liked);

      setLikes(data.likesCount);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <button
      onClick={handleLike}
      className="px-4 py-2 rounded-xl border"
    >
      {liked ? "❤️" : "🤍"} {likes}
    </button>
  );
};

export default LikeButton;