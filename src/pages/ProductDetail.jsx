import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { FaStar, FaThumbsUp, FaThumbsDown } from "react-icons/fa";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [user, setUser] = useState(null);
  const [newReview, setNewReview] = useState({ rating: 0, comment: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUser();
    fetchProduct();
    fetchReviews();
  }, [id]);

  const fetchUser = async () => {
    const { data } = await supabase.auth.getUser();
    if (data?.user) setUser(data.user);
  };

  const fetchProduct = async () => {
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();
    setProduct(data);
  };

  const fetchReviews = async () => {
    const { data } = await supabase
      .from("reviews")
      .select(`
        id,
        rating,
        comment,
        created_at,
        profiles (email),
        review_votes (is_like, user_id)
      `)
      .eq("product_id", id)
      .order("created_at", { ascending: false });

    setReviews(data || []);
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!user) return alert("Silakan login dulu.");
    if (!newReview.rating || !newReview.comment.trim())
      return alert("Isi rating & komentar.");

    setLoading(true);
    const { data, error } = await supabase
      .from("reviews")
      .insert([
        {
          product_id: id,
          user_id: user.id,
          rating: newReview.rating,
          comment: newReview.comment.trim(),
        },
      ])
      .select(`
        id,
        rating,
        comment,
        created_at,
        profiles:user_id (email),
        review_votes (is_like, user_id)
      `)
      .single();

    setLoading(false);

    if (!error) {
      setReviews((prev) => [data, ...prev]);
      setNewReview({ rating: 0, comment: "" });
    }
  };

  const maskEmail = (email) => {
    if (!email) return "Anonim";
    const [name, domain] = email.split("@");
    return `${name.slice(0, 2)}***@${domain}`;
  };

  const handleVote = async (reviewId, isLike) => {
    if (!user) return alert("Login untuk memberi vote.");

    const { data: existing } = await supabase
      .from("review_votes")
      .select("*")
      .eq("review_id", reviewId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (existing) {
      if (existing.is_like === isLike) {
        await supabase.from("review_votes").delete().eq("id", existing.id);
      } else {
        await supabase
          .from("review_votes")
          .update({ is_like })
          .eq("id", existing.id);
      }
    } else {
      await supabase.from("review_votes").insert([
        { review_id: reviewId, user_id: user.id, is_like }
      ]);
    }

    fetchReviews();
  };

  if (!product)
    return (
      <div className="text-center text-gray-600 py-20">Memuat produk...</div>
    );

  const avgRating =
    reviews.length > 0
      ? (
          reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
        ).toFixed(1)
      : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f7e7d3] via-[#f3d8b6] to-[#e9c08f] text-[#3b2215] py-20 px-6">

      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-[#e5cfb2]">

        {/* IMAGE */}
        <img
          src={product.image_url || "/placeholder.png"}
          alt={product.name}
          className="w-full h-96 object-cover"
        />

        <div className="p-8">
          {/* TITLE + RATING */}
          <h1 className="text-4xl font-extrabold text-[#6b3e26] mb-3">
            {product.name}
          </h1>

          <p className="text-gray-600 leading-relaxed mb-4">
            {product.description}
          </p>

          <p className="text-3xl font-bold text-[#d29b2b] mb-5">
            Rp {Number(product.price).toLocaleString("id-ID")}
          </p>

          <div className="flex items-center mb-6">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                className={`${
                  i < Math.round(avgRating)
                    ? "text-yellow-400"
                    : "text-gray-300"
                } text-2xl`}
              />
            ))}
            <span className="ml-3 text-lg text-gray-700">
              {avgRating} / 5 · {reviews.length} ulasan
            </span>
          </div>

          <hr className="border-t border-[#e7d4b9] my-8" />

          {/* FORM REVIEW */}
          {user ? (
            <form onSubmit={handleAddReview} className="mb-10">
              <h2 className="text-2xl font-bold text-[#6b3e26] mb-3">
                Tulis Review
              </h2>

              <div className="flex gap-2 mb-3">
                {[1, 2, 3, 4, 5].map((num) => (
                  <FaStar
                    key={num}
                    className={`cursor-pointer text-3xl ${
                      num <= newReview.rating
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                    onClick={() =>
                      setNewReview({ ...newReview, rating: num })
                    }
                  />
                ))}
              </div>

              <textarea
                className="w-full p-4 rounded-xl bg-[#f6ead9] border border-[#e0c9a8] focus:ring-2 focus:ring-yellow-400 outline-none text-[#3b2215] mb-4"
                placeholder="Tulis komentar..."
                value={newReview.comment}
                onChange={(e) =>
                  setNewReview({ ...newReview, comment: e.target.value })
                }
              ></textarea>

              <button
                type="submit"
                disabled={loading}
                className="bg-yellow-400 text-[#3b2215] px-6 py-3 rounded-xl shadow font-semibold hover:bg-yellow-500 transition disabled:opacity-50"
              >
                {loading ? "Mengirim..." : "Kirim Review"}
              </button>
            </form>
          ) : (
            <p className="text-gray-600 mb-10">
              🔒 Login untuk menulis review.
            </p>
          )}

          {/* REVIEWS */}
          <h2 className="text-2xl font-bold text-[#6b3e26] mb-5">
            Ulasan Pelanggan
          </h2>

          {reviews.length > 0 ? (
            <div className="space-y-5">
              {reviews.map((r) => {
                const likes = r.review_votes?.filter((v) => v.is_like).length || 0;
                const dislikes =
                  r.review_votes?.filter((v) => !v.is_like).length || 0;
                const userVote = r.review_votes?.find(
                  (v) => v.user_id === user?.id
                );

                return (
                  <div
                    key={r.id}
                    className="bg-[#fff6ea] border border-[#e7d4b9] p-5 rounded-2xl shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-[#b57a2a]">
                        {maskEmail(r.profiles?.email)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(r.created_at).toLocaleDateString("id-ID")}
                      </p>
                    </div>

                    <div className="flex mb-2">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={`${
                            i < r.rating ? "text-yellow-400" : "text-gray-300"
                          } text-lg`}
                        />
                      ))}
                    </div>

                    <p className="text-gray-700 mb-4">{r.comment}</p>

                    <div className="flex items-center gap-5 text-gray-600">
                      <button
                        onClick={() => handleVote(r.id, true)}
                        className={`flex items-center gap-1 hover:text-yellow-500 ${
                          userVote?.is_like ? "text-yellow-500" : ""
                        }`}
                      >
                        <FaThumbsUp /> {likes}
                      </button>
                      <button
                        onClick={() => handleVote(r.id, false)}
                        className={`flex items-center gap-1 hover:text-red-500 ${
                          userVote && !userVote.is_like ? "text-red-500" : ""
                        }`}
                      >
                        <FaThumbsDown /> {dislikes}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-600">Belum ada ulasan.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
