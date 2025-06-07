import React, { useState } from "react";

export default function Blog({ blogPosts = [], addBlogPost, deleteBlogPost, loggedInUser }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);

  // Handle new post submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert("Please fill in title and content");
      return;
    }

    // Create new post object
    const newPost = {
      id: Date.now().toString(),
      title: title.trim(),
      content: content.trim(),
      imageUrl: image ? URL.createObjectURL(image) : null,
      authorEmail: loggedInUser.email,
      authorName: loggedInUser.name,
      createdAt: new Date().toISOString(),
    };

    addBlogPost(newPost);

    // Reset form
    setTitle("");
    setContent("");
    setImage(null);
  };

  return (
    <div className="max-w-3xl mx-auto p-4 bg-white rounded shadow-md mt-8">
      <h1 className="text-3xl font-bold mb-6">Blog</h1>

      {/* New post form */}
      {loggedInUser && (
        <form onSubmit={handleSubmit} className="mb-8 space-y-4">
          <div>
            <label className="block font-semibold mb-1" htmlFor="title">
              Title
            </label>
            <input
              id="title"
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Post title"
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-1" htmlFor="content">
              Content
            </label>
            <textarea
              id="content"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your blog post here..."
              rows={5}
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-1" htmlFor="image">
              Image (optional)
            </label>
            <input
              id="image"
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Add Post
          </button>
        </form>
      )}

      {/* No posts message */}
      {(!blogPosts || blogPosts.length === 0) && (
        <p className="text-gray-600">No blog posts yet.</p>
      )}

      {/* Posts list */}
      <div className="space-y-6">
        {(blogPosts || []).map((post) => (
          <div
            key={post.id}
            className="border border-gray-300 rounded p-4 shadow-sm"
          >
            <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
            <p className="text-gray-700 whitespace-pre-wrap mb-2">{post.content}</p>

            {post.imageUrl && (
              <img
                src={post.imageUrl}
                alt="Post visual"
                className="max-w-full h-auto rounded mb-2"
              />
            )}

            <p className="text-sm text-gray-500 mb-2">
              Posted by {post.authorName} on{" "}
              {new Date(post.createdAt).toLocaleDateString()}
            </p>

            {loggedInUser && post.authorEmail === loggedInUser.email && (
              <button
                onClick={() => {
                  if (
                    window.confirm(
                      "Are you sure you want to delete this blog post?"
                    )
                  ) {
                    deleteBlogPost(post.id);
                  }
                }}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
              >
                Delete
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
