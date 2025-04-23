import { http, HttpResponse } from 'msw';
import { FAKE_TOKEN } from './data/auth';

const baseUrl = import.meta.env.VITE_SERVER_URL;

export const handlers = [
  http.post(`${baseUrl}/auth/signin`, async () => {
    return HttpResponse.json({ token: FAKE_TOKEN }, { status: 200 });
  }),
];
