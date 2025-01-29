import { defineStore } from "pinia";
import MoviesService from "@/services/moviesService";

interface Movie {
  id?: number | string;
  name?: string;
  description?: string;
  image?: string;
  genre?: number;
  genres: number[];
  [key: string]: any;
}

interface Session {
  showId: string;
  showdate: string;
  time: string;
}

interface MoviesState {
  movies: Movie[];
  selectedMovie: Movie | null;
  sessions: Session[];
  loading: boolean;
  error: string | null;
}

interface FetchParams {
  [key: string]: any;
}

export const useMoviesStore = defineStore("movies", {
  state: (): MoviesState => ({
    movies: [],
    selectedMovie: null,
    sessions: [],
    loading: false,
    error: null,
  }),

  getters: {
    filterByGenre: (state) => (genre: number) => {
      return state.movies.filter((movie) => movie.genres.includes(genre));
    },
  },

  actions: {
    async fetchMovies(params: FetchParams = {}) {
      this.loading = true;
      this.error = null;
      try {
        const data = await MoviesService.listMovies(params);
        this.movies = (data.data || []).map((movie: Movie) => ({
          ...movie,
          genres: Array.isArray(movie.genres)
            ? movie.genres
            : movie.genre
            ? [movie.genre]
            : [],
        }));
      } catch (error) {
        console.error("Error fetching movies:", error);
        this.error = "Failed to fetch movies.";
      } finally {
        this.loading = false;
      }
    },

    async fetchMovie(id: number | string) {
      this.loading = true;
      this.error = null;
      try {
        const data = await MoviesService.getMovie(id);
        if (data && data.data && data.data.length > 0) {
          const raw = data.data[0];
          this.selectedMovie = {
            ...raw,
            genres: Array.isArray(raw.genres)
              ? raw.genres
              : raw.genre
              ? [raw.genre]
              : [],
          };
        } else {
          this.selectedMovie = null;
          this.error = "Movie not found.";
        }
      } catch (error) {
        console.error("Error fetching movie:", error);
        this.error = "Failed to fetch movie details.";
      } finally {
        this.loading = false;
      }
    },

    async fetchSessions(id: number | string) {
      this.loading = true;
      this.error = null;
      try {
        const data = await MoviesService.getMovieShows(id);
        if (data && data.data && typeof data.data === "object") {
          const rawSessions = data.data[id] || [];
          const processedSessions: Session[] = [];

          rawSessions.forEach((session: any) => {
            const { showdate, daytime } = session;
            if (showdate && daytime) {
              const times = daytime.split(";").map((t: string) => t.trim());
              times.forEach((time: string) => {
                if (time) {
                  const showId = `${showdate}_${time.replace(/:/g, "")}`;
                  processedSessions.push({ showId, showdate, time });
                }
              });
            }
          });

          this.sessions = processedSessions;
        } else {
          this.sessions = [];
        }
      } catch (error) {
        console.error("Error fetching sessions:", error);
        this.error = "Failed to fetch movie sessions.";
        this.sessions = [];
      } finally {
        this.loading = false;
      }
    },

    resetSelectedMovie() {
      this.selectedMovie = null;
      this.sessions = [];
      this.error = null;
    },
  },
});
