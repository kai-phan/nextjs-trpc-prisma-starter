import { NextRequest } from 'next/server';

export const middleware = async (_req: NextRequest) => {
  console.log('middleware');

  // return NextResponse.rewrite(new URL('/post', req.url));
};

export const config = {
  matcher: '/post/:path*',
};
