export function responseEnhancer(req: any, res: any, next: any) {
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
