import { fetchWithLogging } from '../utils/logger';

export async function fetchNotifications({ page = 1, limit = 20, type = 'All' } = {}) {
  // Use Vite proxy configured in vite.config.js to avoid CORS
  const baseUrl = '/api/evaluation-service/notifications';
  
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString()
  });

  if (type && type !== 'All') {
    params.append('notification_type', type);
  }

  const url = `${baseUrl}?${params.toString()}`;

  const response = await fetchWithLogging(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJuaWtzaGl0aG5vb2thQGdtYWlsLmNvbSIsImV4cCI6MTc4Mjg5MjE0OCwiaWF0IjoxNzgyODkxMjQ4LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiZDllNzdhYTgtOTBmYi00ZDM1LWE0N2UtMGIwNzNlZGJkNWRkIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoibm9va2Egbmlrc2hpdGgiLCJzdWIiOiJkN2VhZWE4OC02MGRlLTRjMjctYWZhOC1jYjk4Y2YwMTA0OWYifSwiZW1haWwiOiJuaWtzaGl0aG5vb2thQGdtYWlsLmNvbSIsIm5hbWUiOiJub29rYSBuaWtzaGl0aCIsInJvbGxObyI6IjIzMTFjczAyMDQ4MyIsImFjY2Vzc0NvZGUiOiJ4cFFkZGQiLCJjbGllbnRJRCI6ImQ3ZWFlYTg4LTYwZGUtNGMyNy1hZmE4LWNiOThjZjAxMDQ5ZiIsImNsaWVudFNlY3JldCI6IkJYQ05yRXpteUJiblBWQUsifQ.C7yf-HDHvwt0SUIPBykJcfVz-V4KvwJw6jjwH5uwt9M'
    }
  });

  if (!response.ok) {
    throw new Error(`Error fetching notifications: ${response.statusText}`);
  }

  return response.json();
}
