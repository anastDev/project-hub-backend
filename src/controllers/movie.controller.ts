import { Request, Response, NextFunction } from "express";
import * as movieService from "../services/movie.service";

export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {title} = req.params;

    if(!title) {
      return res.status(404).json({
        message: `Movie with title ${title} not found`,
        code: "MOVIE_NOT_FOUND"
      })
    }

    const result = await movieService.getMovieByTitle(title);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}