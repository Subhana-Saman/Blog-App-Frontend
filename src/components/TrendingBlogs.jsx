import { useEffect, useState } from "react";

import {
  getTrendingBlogs,
} from "../api/blogApi";

import BlogCard from "./BlogCard";

export default function TrendingBlogs() {

  const [blogs, setBlogs] =
    useState([]);

  useEffect(() => {

    fetchTrending();

  }, []);

  const fetchTrending =
    async () => {

      try {

        const data =
          await getTrendingBlogs();

        setBlogs(
          data.blogs || []
        );

      } catch (error) {

        console.log(error);

      }
    };

  return (

    <div
      className="
        grid
        grid-cols-1
        md:grid-cols-2
        lg:grid-cols-3
        gap-8
      "
    >

      {blogs.map((blog) => (

        <BlogCard
          key={blog._id}
          blog={blog}
        />

      ))}

    </div>
  );
}