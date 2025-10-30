import { Router } from "express";
import type { Response } from "express";
export interface CustomResponse extends Response {
    success: (data?: any) => void;
    error: (msg?: string, code?: number) => void;
}
declare const router: Router;
export default router;
//# sourceMappingURL=personal.d.ts.map