import type { Request, Response, NextFunction } from "express";

export function responseEnhancer(
  req: Request,
  res: Response,
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
