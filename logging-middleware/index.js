const isBrowser = typeof window !== 'undefined';
const API_URL = isBrowser ? '/api/evaluation-service/logs' : 'http://4.224.186.213/evaluation-service/logs';
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJuaWtzaGl0aG5vb2thQGdtYWlsLmNvbSIsImV4cCI6MTc4Mjg5MjE0OCwiaWF0IjoxNzgyODkxMjQ4LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiZDllNzdhYTgtOTBmYi00ZDM1LWE0N2UtMGIwNzNlZGJkNWRkIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoibm9va2Egbmlrc2hpdGgiLCJzdWIiOiJkN2VhZWE4OC02MGRlLTRjMjctYWZhOC1jYjk4Y2YwMTA0OWYifSwiZW1haWwiOiJuaWtzaGl0aG5vb2thQGdtYWlsLmNvbSIsIm5hbWUiOiJub29rYSBuaWtzaGl0aCIsInJvbGxObyI6IjIzMTFjczAyMDQ4MyIsImFjY2Vzc0NvZGUiOiJ4cFFkZGQiLCJjbGllbnRJRCI6ImQ3ZWFlYTg4LTYwZGUtNGMyNy1hZmE4LWNiOThjZjAxMDQ5ZiIsImNsaWVudFNlY3JldCI6IkJYQ05yRXpteUJiblBWQUsifQ.C7yf-HDHvwt0SUIPBykJcfVz-V4KvwJw6jjwH5uwt9M';

export async function Log(stack, level, pkg, message) {
  const validStacks = ['frontend', 'backend'];
  const validLevels = ['debug', 'info', 'warn', 'error', 'fatal'];
  
  const frontendPackages = ['api', 'component', 'hook', 'style', 'auth', 'config', 'middleware', 'utils'];
  const backendPackages = ['cache', 'controller', 'cron_job', 'db', 'domain', 'handler', 'repository', 'route', 'service', 'auth', 'config', 'middleware', 'utils'];

  if (!validStacks.includes(stack)) {
    console.warn(`[Log] Invalid stack: ${stack}. Must be 'frontend' or 'backend'.`);
  }
  
  if (!validLevels.includes(level)) {
    console.warn(`[Log] Invalid level: ${level}. Allowed: ${validLevels.join(', ')}`);
  }
  
  const validPackages = stack === 'frontend' ? frontendPackages : backendPackages;
  if (!validPackages.includes(pkg)) {
    console.warn(`[Log] Invalid package for ${stack}: ${pkg}. Allowed: ${validPackages.join(', ')}`);
  }

  const payload = {
    stack,
    level,
    package: pkg,
    message
  };

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TOKEN}`
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      console.error('[Log] Failed to send remote log:', response.status);
    }
  } catch (error) {
    console.error('[Log] Network error sending remote log:', error);
  }
}
