import type { Request, NextFunction } from "express";
import type { CustomResponse } from "../types/customResponse.ts";

export function responseEnhancer(
  req: Request,
  res: CustomResponse,
  next: NextFunction
) {
  res.success = function (data?: any) {
    this.json({ code: 200, data: data ?? null, msg: "success" });
  };

  res.error = function (msg?: string, code?: number) {
    this.json({ code: code ?? 500, data: null, msg: msg ?? "error" });
  };

  next();
}
