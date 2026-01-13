import { Request, Response, NextFunction } from "express";
import { ZodType } from "zod";

export const validate = (schema: ZodType<any>) => (req: Request, res: Response, next: NextFunction) => {
  try {
    const toValidate = {
      body: req.body,
      query: req.query,
      params: req.params
    }
    schema.parse(toValidate.body);
    next();
  } catch (err) {
    return res.status(400).json({
      message: "Bad Request",
      code: "BAD_REQUEST"
    });
  }
}