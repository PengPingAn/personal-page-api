import type { Response } from "express";

export interface CustomResponse extends Response {
  success: (data?: any) => void;
  error: (msg?: string, code?: number) => void;
}
