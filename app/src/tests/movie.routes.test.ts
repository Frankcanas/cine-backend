// app/src/tests/movie.routes.test.ts

import { describe, it, expect } from "@jest/globals";
import movieRouter from "../routes/movie.routes";

describe("MovieRoutes", () => {
  it("debe definir el router de películas", () => {
    expect(movieRouter).toBeDefined();
  });
});
