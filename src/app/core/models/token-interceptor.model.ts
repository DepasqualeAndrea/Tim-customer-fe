const TOKEN_LOCAL_STORAGE_KEY = 'token';
export const GUEST_TOKEN_LOCAL_STORAGE_KEY = 'guest_token';
export const REDIRECT_TOKEN_LOCAL_STORAGE_KEY = 'jwt_redirect';

export function IS_GUEST_TOKEN(): boolean { return !!sessionStorage.getItem(GUEST_TOKEN_LOCAL_STORAGE_KEY); }
export function REMOVE_GUEST_TOKEN(): void { sessionStorage.removeItem(GUEST_TOKEN_LOCAL_STORAGE_KEY); }
export function GET_GUEST_TOKEN(): string { return sessionStorage.getItem(GUEST_TOKEN_LOCAL_STORAGE_KEY); }
export function SET_GUEST_TOKEN(token: string): void { sessionStorage.setItem(GUEST_TOKEN_LOCAL_STORAGE_KEY, token); }

export function SET_TOKEN(token: string): void {
  if (!token) return;
  sessionStorage.setItem(TOKEN_LOCAL_STORAGE_KEY, token);
  localStorage.setItem(TOKEN_LOCAL_STORAGE_KEY, token);
  REMOVE_GUEST_TOKEN()
}
export function GET_TOKEN(): string | undefined {
  const token = sessionStorage.getItem(TOKEN_LOCAL_STORAGE_KEY) ?? localStorage.getItem(TOKEN_LOCAL_STORAGE_KEY);

  const jwt = parseJwt(token);
  if (!!jwt && (Date.now() > (new Date(jwt['exp'] * 1000).getTime()))) {
    REMOVE_TOKEN();
    return;
  }

  return token;
}
export function REMOVE_TOKEN(): void {
  sessionStorage.removeItem(TOKEN_LOCAL_STORAGE_KEY);
  localStorage.removeItem(TOKEN_LOCAL_STORAGE_KEY);
}

export function parseJwt(token: string): any | undefined {
  if (!token) return;

  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}

export function GREAT_FLOOD(localPreserve: string[] = ['fieldToRecover', 'product_code', 'id_order'], sessionPreserve: string[] = ['old_path', 'product_code', 'post_payment_path'])  {
  if (IS_GUEST_TOKEN()) {
    const token = GET_GUEST_TOKEN();
    KABOOM(sessionPreserve, localPreserve);
    if (token) SET_GUEST_TOKEN(token);
  } else {
    const token = GET_TOKEN();
    const user = localStorage.getItem('user');
    KABOOM(sessionPreserve, localPreserve);
    if (token) SET_TOKEN(token);
    if (user) {
      localStorage.setItem('user', user);
    } else {
      localStorage.removeItem('user');
    }
  }
}

export function KABOOM(sessionVariables: string[] = ['old_path'], localVariables: string[] = []) {
  if (sessionVariables && sessionVariables.length) {
    sessionSoftClear(sessionVariables);
  } else {
    sessionStorage.clear();
  }
  if (localVariables && localVariables.length) {
    localSoftClear(localVariables);
  } else {
    localStorage.clear();
  }
}

export function localSoftClear(localVariables: string[]) {
  Object.keys(localStorage).forEach(key => {
    if (!localVariables.includes(key)) localStorage.removeItem(key);
  });
}

export function sessionSoftClear(sessionVariables: string[]) {
  const preserved = new Set(sessionVariables);
  Object.keys(sessionStorage).forEach(key => {
    if (!preserved.has(key)) sessionStorage.removeItem(key);
  });
}

