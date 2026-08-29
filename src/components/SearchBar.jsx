import { useEffect, useState } from "react";
import { searchBlogs } from "../api/blogApi";

const categories = [
  "Technology",
  "Programming",
  "AI",
  "Design",
  "Business",
];

const SearchBar = () => {
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchBlogs();
    }, 500);

    return () => clearTimeout(delay);
  }, [keyword, category]);

  const fetchBlogs = async () => {
    try {
      const { data } = await searchBlogs(
        keyword,
        category
      );

      setBlogs(data.blogs);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search blogs..."
          value={keyword}
          onChange={(e) =>
            setKeyword(e.target.value)
          }
          className="w-full border rounded-xl px-4 py-3"
        />

        <select
          value={category}
          onChange={(e) =>
            setCategory(e.target.value)
          }
          className="border rounded-xl px-4 py-3"
        >
          <option value="">
            All Categories
          </option>

          {categories.map((cat) => (
            <option key={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {blogs.length > 0 && (
        <div className="grid md:grid-cols-3 gap-5 mt-8">
          {blogs.map((blog) => (
            <div
              key={blog._id}
              className="border rounded-xl overflow-hidden"
            >
              <img
                src={blog.coverImage}
                className="h-52 w-full object-cover"
              />

              <div className="p-4">
                <h2 className="font-bold text-xl">
                  {blog.title}
                </h2>

                <p className="text-gray-500 mt-2">
                  {blog.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;