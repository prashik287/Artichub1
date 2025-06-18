// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useAuth } from "../../AuthContext";

// const CommentSection = ({ productId }) => {
//   const [comments, setComments] = useState([]);
//   const [newComment, setNewComment] = useState({ email: "", comment: "" });

//   const { user } = useAuth();

//   // ✅ Fetch Comments Function
//   const fetchComments = async () => {
//     try {
//       const response = await axios.get(
//         `http://127.0.0.1:8000/api/product/comments/${productId}/`
//       );
//       setComments(response.data);
//     } catch (err) {
//       console.error("Error fetching comments:", err);
//     }
//   };

//   // ✅ Auto-refresh comments every 5 seconds
//   useEffect(() => {
//     fetchComments(); // Fetch initially
//     const interval = setInterval(fetchComments, 5000);

//     return () => clearInterval(interval); // Cleanup on unmount
//   }, [productId]);

//   // ✅ Add New Comment
//   const addComment = async () => {
//     if (!newComment.comment.trim()) return;

//     const commentToSubmit = { ...newComment, email: user?.email || "Anonymous" };

//     try {
//       await axios.post(
//         `http://127.0.0.1:8000/api/product/comments/${productId}/`,
//         commentToSubmit
//       );

//       setNewComment({ email: user?.email || "", comment: "" }); // Reset input
//       fetchComments(); // ✅ Immediately fetch updated comments
//     } catch (err) {
//       console.error("Error adding comment:", err);
//     }
//   };

//   return (
//     <div>
//       {/* Render Comments */}
//       {comments.length > 0 ? (
//         comments.map((comment, index) => (
//           <div
//             key={index}
//             className="p-4 mb-2 bg-gray-100 rounded-lg border border-gray-300"
//           >
//             <p className="text-xs text-gray-500">{comment?.email || "Anonymous"}</p>
//             <p className="text-sm text-black">{comment?.comment || "No content"}</p>
//           </div>
//         ))
//       ) : (
//         <p className="text-gray-500">No comments yet. Be the first to comment!</p>
//       )}

//       {/* Comment Input */}
//       <div className="mb-4 text-black p-4">
//         <textarea
//           rows="4"
//           className="w-full p-2 border rounded-lg"
//           value={newComment.comment}
//           onChange={(e) =>
//             setNewComment({ ...newComment, comment: e.target.value })
//           }
//           placeholder="Write a comment..."
//         />
//         <div className="mt-4 flex justify-center bg-green-500 p-4 rounded-2xl">
//           <button
//             onClick={addComment}
//             className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
//           >
//             Comment
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CommentSection;
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../AuthContext";

const CommentSection = ({ productId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState({ email: "", comment: "" });

  const { user } = useAuth();

  // ✅ Fetch Comments Function
  const fetchComments = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/product/comments/${productId}/`
      );
      setComments(response.data);
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };

  // ✅ Auto-refresh comments every 5 seconds
  useEffect(() => {
    fetchComments(); // Fetch immediately
    const interval = setInterval(fetchComments, 5000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, [productId]);

  // ✅ Add New Comment
  const addComment = async () => {
    if (!newComment.comment.trim()) return;

    const commentToSubmit = { ...newComment, email: user?.email || "Anonymous" };

    try {
      await axios.patch(
        `http://127.0.0.1:8000/api/product/comments/${productId}/`,
        commentToSubmit // ✅ Fixed: Directly pass object
      );

      setNewComment({ email: user?.email || "", comment: "" }); // Reset input
      fetchComments(); // ✅ Immediately fetch updated comments
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  return (
    <div>
      {/* Render Comments */}
      {comments.length > 0 ? (
        comments.map((comment, index) => (
          <div
            key={index}
            className="p-4 mb-2 bg-gray-100 rounded-lg border border-gray-300"
          >
            <p className="text-xs text-gray-500">{comment?.email || "Anonymous"}</p>
            <p className="text-sm text-black">{comment?.comment || "No content"}</p>
          </div>
        ))
      ) : (
        <p className="text-gray-500">No comments yet. Be the first to comment!</p>
      )}

      {/* Comment Input */}
      <div className="mb-4 text-black p-4">
        <textarea
          rows="4"
          className="w-full p-2 border rounded-lg"
          value={newComment.comment}
          onChange={(e) =>
            setNewComment({ ...newComment, comment: e.target.value })
          }
          placeholder="Write a comment..."
        />
        <div className="mt-4 flex justify-center bg-green-500 p-4 rounded-2xl">
          <button
            onClick={addComment}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Comment
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentSection;
