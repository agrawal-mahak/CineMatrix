import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Shield, Plus, Film, Trash2, Calendar, MapPin, Loader2, CheckCircle2, Building2 } from 'lucide-react';
import API from '../services/api';
import { fetchMovies } from '../store/movieSlice';
import AddMovieModal from '../components/admin/AddMovieModal';
import AddTheatreModal from '../components/admin/AddTheatreModal';
import AddShowModal from '../components/admin/AddShowModal';

const AdminDashboardPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { movies, loading } = useSelector((state) => state.movies);

  const [isAddMovieModalOpen, setIsAddMovieModalOpen] = useState(false);
  const [isAddTheatreModalOpen, setIsAddTheatreModalOpen] = useState(false);
  const [isAddShowModalOpen, setIsAddShowModalOpen] = useState(false);

  const [theatres, setTheatres] = useState([]);
  const [shows, setShows] = useState([]);
  const [deletingMovieId, setDeletingMovieId] = useState(null);

  const loadData = () => {
    dispatch(fetchMovies());

    API.get('/theatres')
      .then((res) => setTheatres(res.data.theatres || []))
      .catch((err) => console.error(err));

    API.get('/shows')
      .then((res) => setShows(res.data.shows || []))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'ADMIN') {
      navigate('/');
      return;
    }
    loadData();
  }, [isAuthenticated, user, navigate, dispatch]);

  const handleDeleteMovie = async (movieId) => {
    if (!window.confirm('Are you sure you want to deactivate this movie?')) return;
    setDeletingMovieId(movieId);
    try {
      await API.delete(`/movies/${movieId}`);
      loadData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete movie');
    } finally {
      setDeletingMovieId(null);
    }
  };

  if (!user || user.role !== 'ADMIN') return null;

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-brand-primary/20 via-surface-secondary to-purple-900/20 border border-white/10 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-brand-primary flex items-center justify-center text-white shadow-xl shadow-brand-primary/30 shrink-0">
            <Shield className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-white tracking-tight">Admin Management Console</h1>
              <span className="bg-brand-primary/20 text-brand-primary text-xs px-2 py-0.5 rounded font-bold border border-brand-primary/40">
                SYSTEM ADMIN
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1">Manage cinema movies, theatres, and schedule showtimes</p>
          </div>
        </div>

        {/* Quick Action CTAs */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsAddMovieModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-hover text-white font-bold text-xs shadow-lg shadow-brand-primary/25 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Movie</span>
          </button>

          <button
            onClick={() => setIsAddTheatreModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-surface-tertiary hover:bg-white/10 text-gray-200 font-bold text-xs border border-white/10 transition-all flex items-center gap-1.5"
          >
            <Building2 className="w-4 h-4 text-brand-accent" />
            <span>+ Add Theatre</span>
          </button>

          <button
            onClick={() => setIsAddShowModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-lg shadow-emerald-500/25 transition-all flex items-center gap-1.5"
          >
            <Calendar className="w-4 h-4" />
            <span>+ Schedule Show</span>
          </button>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-surface-secondary border border-white/5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-brand-primary/10 text-brand-primary border border-brand-primary/20 flex items-center justify-center">
            <Film className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-white">{movies.length}</div>
            <div className="text-xs text-gray-400 font-medium">Movies in Catalog</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-surface-secondary border border-white/5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-brand-accent/10 text-brand-accent border border-brand-accent/20 flex items-center justify-center">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-white">{theatres.length}</div>
            <div className="text-xs text-gray-400 font-medium">Registered Theatres</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-surface-secondary border border-white/5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-white">{shows.length}</div>
            <div className="text-xs text-gray-400 font-medium">Scheduled Showtimes</div>
          </div>
        </div>
      </div>

      {/* Section 1: Movies Table */}
      <div className="p-6 rounded-3xl bg-surface-secondary border border-white/5 shadow-2xl">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Film className="w-4 h-4 text-brand-primary" />
            <span>Active Movies ({movies.length})</span>
          </h2>
          <button
            onClick={() => setIsAddMovieModalOpen(true)}
            className="text-xs font-bold text-brand-primary hover:text-white transition-colors"
          >
            + Add Movie
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-white/10 text-xs font-bold text-gray-400 uppercase tracking-wider">
                <th className="py-2.5 px-3">Movie</th>
                <th className="py-2.5 px-3">Duration</th>
                <th className="py-2.5 px-3">Genres</th>
                <th className="py-2.5 px-3">Rating</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-gray-200">
              {movies.map((m) => (
                <tr key={m._id} className="hover:bg-surface-tertiary/50 transition-colors">
                  <td className="py-2.5 px-3 flex items-center gap-3">
                    <img
                      src={m.posterUrl}
                      alt={m.title}
                      className="w-9 h-12 object-cover rounded-lg border border-white/10 shrink-0"
                    />
                    <div className="font-bold text-white line-clamp-1">{m.title}</div>
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-gray-300">{m.duration}m</td>
                  <td className="py-2.5 px-3 text-xs text-gray-400">{m.genre?.join(', ')}</td>
                  <td className="py-2.5 px-3 font-extrabold text-yellow-400">★ {m.rating}</td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      onClick={() => handleDeleteMovie(m._id)}
                      disabled={deletingMovieId === m._id}
                      className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors border border-red-500/20"
                    >
                      {deletingMovieId === m._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 2: Scheduled Showtimes Table */}
      <div className="p-6 rounded-3xl bg-surface-secondary border border-white/5 shadow-2xl">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-400" />
            <span>Scheduled Showtimes ({shows.length})</span>
          </h2>
          <button
            onClick={() => setIsAddShowModalOpen(true)}
            className="text-xs font-bold text-emerald-400 hover:text-white transition-colors"
          >
            + Schedule Showtime
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-white/10 text-xs font-bold text-gray-400 uppercase tracking-wider">
                <th className="py-2.5 px-3">Movie</th>
                <th className="py-2.5 px-3">Theatre & Screen</th>
                <th className="py-2.5 px-3">Date & Start Time</th>
                <th className="py-2.5 px-3">Standard / VIP Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-gray-200">
              {shows.map((s) => {
                const movie = s.movieId || {};
                const theatre = s.theatreId || {};

                return (
                  <tr key={s._id} className="hover:bg-surface-tertiary/50 transition-colors">
                    <td className="py-2.5 px-3 font-bold text-white">{movie.title || 'Movie'}</td>
                    <td className="py-2.5 px-3 text-xs text-gray-300">
                      {theatre.name || 'Theatre'} (Screen {s.screenNumber})
                    </td>
                    <td className="py-2.5 px-3 text-xs font-semibold text-emerald-400">
                      {s.startTime ? new Date(s.startTime).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                    </td>
                    <td className="py-2.5 px-3 text-xs font-bold text-gray-300">
                      ${s.pricing?.STANDARD || 200} / ${s.pricing?.VIP || 500}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <AddMovieModal
        isOpen={isAddMovieModalOpen}
        onClose={() => setIsAddMovieModalOpen(false)}
      />

      <AddTheatreModal
        isOpen={isAddTheatreModalOpen}
        onClose={() => setIsAddTheatreModalOpen(false)}
        onTheatreAdded={loadData}
      />

      <AddShowModal
        isOpen={isAddShowModalOpen}
        onClose={() => setIsAddShowModalOpen(false)}
        movies={movies}
        theatres={theatres}
        onShowAdded={loadData}
      />

    </div>
  );
};

export default AdminDashboardPage;
