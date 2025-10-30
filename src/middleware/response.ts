import { Request, Response, NextFunction } from "express";

// 扩展类型定义
declare module "express-serve-static-core" {
  interface Response {
    success: (data?: any) => void;
    error: (msg?: string, code?: number) => void;
  }
}

export function responseEnhancer(
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.success = function (data?: any) {
    this.json({
      code: 200,
      data: data ?? null,
      msg: "success",
    });
  };

  res.error = function (msg?: string, code?: number) {
    this.json({
      code: code ?? 500,
      data: null,
      msg: msg ?? "error",
    });
  };

  next();
}
