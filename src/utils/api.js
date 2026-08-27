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

export async function streamApiRequest(url, options = {}) {
  const { body, headers = {}, method = 'POST', credentials = 'include', signal, onEvent = () => {} } = options;
  const response = await fetch(url, {
    method,
    credentials,
    signal,
    headers: {
      Accept: 'text/event-stream',
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const data = await response.json().catch(async () => ({ error: await response.text().catch(() => '') }));
    const error = new Error(data?.error || `Request failed with status ${response.status}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  if (!response.body || typeof response.body.getReader !== 'function') {
    throw new Error('Streaming is not supported by this browser.');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  const processBlock = (block) => {
    let eventName = 'message';
    const dataLines = [];
    block.split(/\r?\n/).forEach((line) => {
      if (line.startsWith('event:')) eventName = line.slice(6).trim();
      if (line.startsWith('data:')) dataLines.push(line.slice(5).trimStart());
    });
    if (!dataLines.length) return;
    onEvent(eventName, JSON.parse(dataLines.join('\n')));
  };

  while (true) {
    const { done, value } = await reader.read();
    buffer += decoder.decode(value || new Uint8Array(), { stream: !done });
    let separator = buffer.match(/\r?\n\r?\n/);
    while (separator && typeof separator.index === 'number') {
      const block = buffer.slice(0, separator.index);
      buffer = buffer.slice(separator.index + separator[0].length);
      processBlock(block);
      separator = buffer.match(/\r?\n\r?\n/);
    }
    if (done) break;
  }

  if (buffer.trim()) processBlock(buffer);
}
