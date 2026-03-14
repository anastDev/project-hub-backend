import { Router } from "express";
import * as movieCtrl from "../controllers/movie.controller";

const router = Router();

/**
 * @openapi
 * /movies:
 *   get:
 *     summary: Gets movie by title
 *     description: |
 *        Retrieves detailed information from the OMDb API using the movie title
 *     tags:
 *       - Movie
 *     parameters:
 *       - in: query
 *         name: title
 *         required: true
 *         schema:
 *           type: string
 *         description: Title of the movie to search for
 *
 *     responses:
 *       "200":
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/OmdbMovieResponse"
 *       "400": 
 *         $ref: "#/components/responses/TitleRequired"
 * 
 *       "404":
 *         $ref: "#/components/responses/MovieNotFound"
 */
router.get("/", movieCtrl.list);

export default router;