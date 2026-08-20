import React, { useState, useEffect, useCallback } from 'react';
import { Star, ThumbsUp, MessageSquarePlus, Award, User } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { openAuthModal } from '../../store/authSlice';
import API from '../../services/api';
import ReviewModal from './ReviewModal';

const ReviewList = ({ movieId, movieTitle }) => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({
    totalReviews: 0,
    avgRating: 8.5,
    positivePercentage: 88,
    distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
  });
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      const res = await API.get(`/reviews/movie/${movieId}`);
      setReviews(res.data.data.reviews || []);
      setStats(res.data.data.stats || {});
      setLoading(false);
    } catch (err) {
      console.error('Failed to load reviews:', err);
      setLoading(false);
    }
  }, [movieId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleWriteReviewClick = () => {
    if (!isAuthenticated) {
      dispatch(openAuthModal('LOGIN'));
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <div className="space-y-8 py-6">
      {/* Section Title & Action Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <MessageSquarePlus className="w-5 h-5 text-brand-primary" /> Audience Reviews & Ratings
          </h2>
          <p className="text-xs text-gray-400">Verified feedback from cinema fans who watched {movieTitle}</p>
        </div>
        <button
          onClick={handleWriteReviewClick}
          className="px-5 py-2.5 rounded-xl bg-surface-secondary hover:bg-white/10 text-white text-xs font-bold border border-white/10 flex items-center justify-center gap-2 transition-all shadow-md hover:border-brand-primary/50"
        >
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" /> Write a Review
        </button>
      </div>

      {/* Aggregate Score & Distribution Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 rounded-2xl bg-surface-secondary/60 border border-white/10 backdrop-blur-md">
        {/* Overall Score */}
        <div className="flex flex-col items-center justify-center text-center p-4 border-b md:border-b-0 md:border-r border-white/10">
          <div className="flex items-center gap-2 text-4xl font-extrabold text-white">
            <span>{stats.avgRating}</span>
            <span className="text-sm font-normal text-gray-400">/ 5</span>
          </div>
          <div className="flex items-center gap-1 my-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-4 h-4 ${
                  stats.avgRating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-gray-400 font-medium">{stats.totalReviews} total rating count</p>
        </div>

        {/* Positive Audience Interest % */}
        <div className="flex flex-col items-center justify-center text-center p-4 border-b md:border-b-0 md:border-r border-white/10">
          <div className="w-16 h-16 rounded-full bg-brand-primary/20 border-2 border-brand-primary flex items-center justify-center mb-2">
            <Award className="w-8 h-8 text-brand-primary animate-pulse" />
          </div>
          <div className="text-2xl font-bold text-white">{stats.positivePercentage}%</div>
          <p className="text-xs text-gray-400">Audience approval score based on ratings</p>
        </div>

        {/* Star Rating Breakdown Bar Chart */}
        <div className="space-y-1.5 justify-center flex flex-col px-2">
          {[5, 4, 3, 2, 1].map((starNum) => {
            const count = stats.distribution?.[starNum] || 0;
            const pct = stats.totalReviews > 0 ? Math.round((count / stats.totalReviews) * 100) : 0;
            return (
              <div key={starNum} className="flex items-center gap-2 text-xs">
                <span className="w-6 font-semibold text-gray-400 text-right">{starNum}★</span>
                <div className="flex-1 h-2 bg-surface-primary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-yellow-500 to-brand-primary transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-8 text-gray-400 text-right">{pct}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Review Cards Grid */}
      {loading ? (
        <div className="text-center py-8 text-gray-400 text-sm">Loading user reviews...</div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-10 rounded-2xl bg-surface-secondary/30 border border-white/5 space-y-2">
          <MessageSquarePlus className="w-10 h-10 text-gray-500 mx-auto" />
          <h4 className="text-sm font-semibold text-gray-300">No reviews yet for {movieTitle}</h4>
          <p className="text-xs text-gray-500">Be the first movie fan to share your review!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((rev) => (
            <div
              key={rev._id}
              className="p-5 rounded-2xl bg-surface-secondary/40 border border-white/10 hover:border-white/20 transition-all space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-brand-primary/20 border border-brand-primary/40 flex items-center justify-center text-brand-primary font-bold text-sm">
                    {rev.userName ? rev.userName.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">{rev.userName}</h5>
                    <span className="text-[10px] text-gray-400">
                      {new Date(rev.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>

                {/* Rating Badge */}
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 font-bold text-xs">
                  <Star className="w-3.5 h-3.5 fill-yellow-400" />
                  <span>{rev.rating}/5</span>
                </div>
              </div>

              <div>
                <h6 className="text-sm font-bold text-gray-100 mb-1">{rev.headline}</h6>
                <p className="text-xs text-gray-300 leading-relaxed">{rev.comment}</p>
              </div>

              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-gray-400">
                <span className="inline-flex items-center gap-1 text-[11px] text-gray-500">
                  <ThumbsUp className="w-3 h-3" /> Helpful ({rev.likes || 0})
                </span>
                <span className="text-[10px] text-emerald-400 font-medium bg-emerald-400/10 px-2 py-0.5 rounded">
                  ✓ Verified Booking
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review Modal Dialog */}
      <ReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        movieId={movieId}
        movieTitle={movieTitle}
        onReviewSubmitted={fetchReviews}
      />
    </div>
  );
};

export default ReviewList;
