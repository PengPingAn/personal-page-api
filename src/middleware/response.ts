import type { Request, NextFunction } from "express";
import type { ExtendedResponse } from "../types/extendedResponse";

export function responseEnhancer(
  req: Request,
  res: ExtendedResponse,
  next: NextFunction
) {
  res.success = (data?: any) => {
    res.json({ code: 200, data: data ?? null, msg: "success" });
  };
  res.error = (msg?: string, code?: number) => {
    res.json({ code: code ?? 500, data: null, msg: msg ?? "error" });
  };
  next();
}
