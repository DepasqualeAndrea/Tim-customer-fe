const ALLOWED_PARAMS = ['product'] as const;
type RedirectParamIndexer = typeof ALLOWED_PARAMS[number];
export type AllowedParams = {
  [Key in RedirectParamIndexer]: string;
}