import dotenv from "dotenv";
import OmdbMovieResponse from "../models/movie.model";

dotenv.config();

const OMDB_API = process.env.OMDB_API || "";
const OMDB_API_KEY = process.env.OMDB_API_KEY || "";

export const getMovieByTitle = async(title: string): Promise<OmdbMovieResponse> => {
 try{
  const result = await fetch(`${OMDB_API}?apikey=${OMDB_API_KEY}&t=${title}`);

  console.log("Response status", result.status);

  if(!result.ok) {
    throw new Error(`Failed to fetch movie ${result.status}`);
  }
  return await result.json();
 } catch (err) {
  console.log("Error fetching movie", err);
  throw err;
 }
}