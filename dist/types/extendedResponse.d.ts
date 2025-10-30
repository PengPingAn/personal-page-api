import type { Response } from "express";
export type ExtendedResponse = Response & {
    success: (data?: any) => void;
    error: (msg?: string, code?: number) => void;
};
//# sourceMappingURL=extendedResponse.d.ts.map