"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.responseEnhancer = responseEnhancer;
function responseEnhancer(req, res, next) {
    res.success = function (data) {
        return this.json({ code: 200, data: data ?? null, msg: "success" });
    };
    res.error = function (msg, code) {
        return this.json({ code: code ?? 500, data: null, msg: msg ?? "error" });
    };
    next();
}
//# sourceMappingURL=response.js.map