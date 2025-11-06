import { Request, Response, NextFunction } from "express";
export interface AuthRequest extends Request {
    user?: {
        username: string;
    };
}
export declare function authMiddleware(req: AuthRequest, res: Response, next: NextFunction): Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=authMiddleware.d.ts.map