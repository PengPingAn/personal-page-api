import "express";

declare global {
  namespace Express {
    interface Response {
      success(data?: any): this;
      error(msg?: string, code?: number): this;
    }
  }
}
