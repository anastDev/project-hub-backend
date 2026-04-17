import { Request, Response, NextFunction } from "express";
import * as generatorService from "../services/generator.service";

export const generate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { prevCode, newCode, context } = req.body;

    // console.log("Received previous code:", prevCode);
    // console.log("Received new code:", newCode);
    // console.log("Received context:", context);

    if (!prevCode || typeof prevCode !== 'string' || prevCode.trim() === "") {
      return res.status(400).json({
        message: `Previous code parameter is required`,
        code: "PREV_CODE_REQUIRED",
      });
    }

    if (!newCode || typeof newCode !== 'string' || newCode.trim() === "") {
      return res.status(400).json({
        message: `New code parameter is required`,
        code: "NEW_CODE_REQUIRED",
      });
    }

    const generatedContent = await generatorService.generateContent(prevCode, newCode, context);

    res.status(200).json({
      message: "Content generated successfully",
      data: generatedContent,
    });
  } catch (err) {
    next(err);
  }
};


export const explain = async (req: Request, res: Response, next: NextFunction) => {
 try {
    const {code, question} = req.body;

    if (!code || typeof code !== 'string' || code.trim() === "") {
      return res.status(400).json({
        message: `Code parameter is required`,
        code: "CODE_REQUIRED",
      });
    }

    const explanation = await generatorService.explainCode(code, question);

    res.status(200).json({
      message: "Code explained successfully",
      data: explanation,
    });

 } catch (err) {
    next(err);
 }
};