type RedirectActionType = 'bybits' | string

export type ExternalRedirectAction = {
  type: RedirectActionType
  value: string;
}

export type RedirectResponse = {redirect_url: string}