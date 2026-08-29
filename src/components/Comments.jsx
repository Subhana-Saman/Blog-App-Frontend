import {
  useEffect,
  useState,
} from "react";

import API from "../utils/api";

import toast from "react-hot-toast";

import {
  useSelector,
} from "react-redux";

export default function Comments({
  blogId,
}) {

  const { user } =
    useSelector(
      (state) => state.auth
    );

  const [comments, setComments] =
    useState([]);

  const [text, setText] =
    useState("");

  // ================= FETCH =================

  useEffect(() => {

    fetchComments();

  }, []);

  const fetchComments =
    async () => {

      try {

        const { data } =
          await API.get(
            `/comments/${blogId}`
          );

        setComments(
          data.comments
        );

      } catch (error) {

        console.log(error);

      }

    };

  // ================= ADD =================

  const handleComment =
    async () => {

      try {

        const { data } =
          await API.post(
            `/comments/${blogId}`,
            { text }
          );

        setComments([
          data.comment,
          ...comments,
        ]);

        setText("");

        toast.success(
          "Comment added"
        );

      } catch (error) {

        toast.error(
          "Comment failed"
        );

      }

    };

  // ================= DELETE =================

  const handleDelete =
    async (id) => {

      try {

        await API.delete(
          `/comments/delete/${id}`
        );

        setComments(
          comments.filter(
            (c) => c._id !== id
          )
        );

        toast.success(
          "Deleted"
        );

      } catch (error) {

        toast.error(
          "Delete failed"
        );

      }

    };

  return (

    <div className="mt-20">

      <h2
        className="
          text-3xl
          font-black
          mb-8
        "
      >
        Comments
      </h2>

      {/* INPUT */}

      <div
        className="
          flex
          gap-4
          mb-10
        "
      >

        <input
          type="text"
          value={text}
          onChange={(e) =>
            setText(
              e.target.value
            )
          }
          placeholder="Write comment..."
          className="
            flex-1
            p-4
            rounded-2xl
            bg-white/5
            border
            border-white/10
            outline-none
          "
        />

        <button
          onClick={
            handleComment
          }
          className="
            px-6
            rounded-2xl
            bg-cyan-500
            font-bold
          "
        >
          Post
        </button>

      </div>

      {/* COMMENTS */}

      <div className="space-y-6">

        {comments.map(
          (comment) => (

            <div
              key={
                comment._id
              }
              className="
                p-5
                rounded-3xl
                bg-white/5
                border
                border-white/10
              "
            >

              <div
                className="
                  flex
                  items-center
                  justify-between
                "
              >

                <div
                  className="
                    flex
                    items-center
                    gap-4
                  "
                >

                  <img
                    src={
                      comment.user
                        ?.avatar
                        ?.startsWith(
                          "http"
                        )
                        ? comment
                            .user
                            .avatar
                        : `http://localhost:5000/${comment.user.avatar}`
                    }
                    alt=""
                    className="
                      w-12
                      h-12
                      rounded-full
                      object-cover
                    "
                  />

                  <div>

                    <h3
                      className="
                        font-bold
                      "
                    >
                      {
                        comment.user
                          ?.username
                      }
                    </h3>

                    <p
                      className="
                        text-gray-400
                        text-sm
                      "
                    >
                      {
                        new Date(
                          comment.createdAt
                        ).toLocaleDateString()
                      }
                    </p>

                  </div>

                </div>

                {(user?._id ===
                  comment.user?._id ||
                  user?.role ===
                    "admin") && (

                  <button
                    onClick={() =>
                      handleDelete(
                        comment._id
                      )
                    }
                    className="
                      text-red-400
                      font-bold
                    "
                  >
                    Delete
                  </button>

                )}

              </div>

              <p className="mt-5">

                {comment.text}

              </p>

            </div>

          )
        )}

      </div>

    </div>

  );

}