import { useState } from "react";
import { toggleBookmark } from "../api/bookmarkApi";
import { toast } from "react-hot-toast";

const BookmarkButton = ({ blogId }) => {
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleBookmark = async () => {
    try {
      setLoading(true);

      const { data } = await toggleBookmark(blogId);

      setSaved(data.bookmarked);

      toast.success(data.message);
    } catch (error) {
      toast.error("Bookmark failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleBookmark}
      disabled={loading}
      className="px-4 py-2 rounded-lg bg-black text-white"
    >
      {saved ? "Saved" : "Save"}
    </button>
  );
};

export default BookmarkButton;