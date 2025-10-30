"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.responseEnhancer = responseEnhancer;
function responseEnhancer(req, res, next) {
    res.success = (data) => {
        res.json({ code: 200, data: data ?? null, msg: "success" });
    };
    res.error = (msg, code) => {
        res.json({ code: code ?? 500, data: null, msg: msg ?? "error" });
    };
    next();
}
//# sourceMappingURL=response.js.map