import { middleware } from '../../middleware';
import { NextResponse } from 'next/server';

jest.mock('next/server', () => ({
  NextResponse: {
    redirect: jest.fn(),
    next: jest.fn(() => 'next()'),
  },
}));

const getMockReq = (pathname, token) => ({
  cookies: {
    get: () => token,
  },
  nextUrl: {
    pathname,
  },
  url: `http://localhost${pathname}`,
});

describe('Middleware', () => {
  it('redirects to /login if /user accessed without token', () => {
    const req = getMockReq('/user', null);
    middleware(req);
    expect(NextResponse.redirect).toHaveBeenCalledWith(new URL('/login', req.url));
  });

  it('redirects to /user if /login accessed with token', () => {
    const req = getMockReq('/login', 'valid-token');
    middleware(req);
    expect(NextResponse.redirect).toHaveBeenCalledWith(new URL('/user', req.url));
  });

  it('allows request to continue if path and token conditions are fine', () => {
    const req = getMockReq('/', null);
    const result = middleware(req);
    expect(result).toBe('next()');
  });
});
