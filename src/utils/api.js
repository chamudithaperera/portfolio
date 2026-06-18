export async function apiRequest(url, options = {}) {
  const { body, headers = {}, method = 'GET', credentials = 'include' } = options;
  const response = await fetch(url, {
    method,
    credentials,
    headers: {
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const contentType = response.headers.get('content-type') || '';
  let data = null;

  if (contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok || (data && typeof data === 'object' && data.ok === false)) {
    const errorMessage =
      (data && typeof data === 'object' && (data.error || data.message)) || `Request failed with status ${response.status}`;
    const error = new Error(errorMessage);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}
