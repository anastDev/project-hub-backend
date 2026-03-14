import { Request, Response, NextFunction } from "express";
import * as movieService from "../services/movie.service";

export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title } = req.query;

    if (!title || typeof title !== 'string' || title.trim() === "") {
      return res.status(400).json({
        message: `Title parameter is required`,
        code: "TITLE_REQUIRED",
      });
    }

    const result = await movieService.getMovieByTitle(title);

    if(result.Response === "False") {
      return res.status(404).json({
        message: `Movie with title ${title} not found`,
        code: "MOVIE_NOT_FOUND"
      })
    }

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
