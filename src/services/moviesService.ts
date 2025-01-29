import axios from "@/plugins/axios";

interface MoviesResponse {
  error_code: number;
  error_message: string;
  data: any;
}

interface FetchParams {
  [key: string]: any;
}

const MoviesService = {
  async listMovies(params: FetchParams = {}): Promise<MoviesResponse> {
    const response = await axios.get("/movies", { params });
    return response.data;
  },

  async getMovie(id: number | string): Promise<MoviesResponse> {
    const response = await axios.get("/movies", { params: { movie_id: id } });
    return response.data;
  },

  async getMovieShows(id: number | string): Promise<MoviesResponse> {
    const response = await axios.get("/movieShows", {
      params: { movie_id: id },
    });
    return response.data;
  },

  async getShowPlaces(params: FetchParams = {}): Promise<MoviesResponse> {
    const response = await axios.get("/showPlaces", { params });
    return response.data;
  },

  async bookPlace(data: Record<string, any>): Promise<MoviesResponse> {
    const response = await axios.post("/bookPlace", data);
    return response.data;
  },
};

export default MoviesService;
