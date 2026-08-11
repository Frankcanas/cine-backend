// app/src/tests/movie.service.test.ts

import { describe, it, expect, beforeEach } from "@jest/globals";
import { MovieService } from "../services/movie.service";

describe("MovieService", () => {
  let movieService: MovieService;

  beforeEach(() => {
    movieService = new MovieService();
  });

  it("debe estar definido el servicio de películas", () => {
    expect(movieService).toBeDefined();
  });
});
