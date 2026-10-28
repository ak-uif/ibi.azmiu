const baseUrl = (import.meta.env?.VITE_API_BASE_URL || 'http://localhost:8080').replace(/\/+$/, '');

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${baseUrl}${path}`, { credentials: 'include', cache: 'no-store', ...options });
  } catch {
    throw new ApiError('Serverə qoşulmaq mümkün olmadı. Backend-i yoxlayın.', 0);
  }
  if (response.status === 401 && path !== '/api/auth/login') {
    window.dispatchEvent(new Event('admin-session-expired'));
  } else if (response.status === 403 && path.startsWith('/api/admin/')) {
    try {
      const session = await fetch(`${baseUrl}/api/auth/me`, { credentials: 'include', cache: 'no-store' });
      if (session.status === 401) window.dispatchEvent(new Event('admin-session-expired'));
    } catch { /* Preserve the original forbidden response. */ }
  }
  if (!response.ok) {
    let message = response.status === 401 ? 'Giriş tələb olunur.' :
      response.status === 403 ? 'Bu əməliyyata icazə yoxdur.' :
      `Sorğu alınmadı (${response.status}).`;
    try {
      const body = await response.json();
      if (body.message && response.status !== 401 && response.status !== 403) message = body.message;
    } catch { /* Some errors have no JSON body. */ }
    throw new ApiError(message, response.status);
  }
  return response.status === 204 ? null : response.json();
}

export const api = {
  get: (path) => request(path),
  async mutate(path, method, body) {
    const { token } = await request('/api/auth/csrf');
    return request(path, {
      method,
      headers: { 'X-CSRF-TOKEN': token, ...(body ? { 'Content-Type': 'application/json' } : {}) },
      ...(body ? { body: JSON.stringify(body) } : {})
    });
  }
};
