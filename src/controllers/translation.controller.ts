import { Request, Response, NextFunction } from "express";
import * as translationService from "../services/translation.service";

export const translate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { text } = req.body;

    if (!text || typeof text !== 'string' || text.trim() === "") {
      return res.status(400).json({ error: "Text query parameter is required and cannot be empty." });
    }

    const translatedText = await translationService.getTranslation(text);
    res.json({ translatedText });
  } catch (err) {
    console.error("Error in translation controller: ", err);
    next(err);
  }
};