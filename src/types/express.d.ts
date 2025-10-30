import type { Response } from "express-serve-static-core";

declare module "express-serve-static-core" {
  interface Response {
    success: (data?: any) => void;
    error: (msg?: string, code?: number) => void;
  }
}
