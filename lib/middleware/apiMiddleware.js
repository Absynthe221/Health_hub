// Simple API middleware for authentication and authorization

export function withAPIAuth(handler) {
  return async (request, context) => {
    // Simple auth check - in production, implement proper JWT validation
    const authHeader = request.headers.get('authorization');
    if (!authHeader && request.method !== 'GET') {
      return new Response('Unauthorized', { status: 401 });
    }
    return handler(request, context);
  };
}

export function withInstructorOrAdminAuth(handler) {
  return async (request, context) => {
    // Simple role check - in production, validate JWT and roles
    const userRole = request.headers.get('x-user-role');
    if (!userRole || !['instructor', 'admin'].includes(userRole)) {
      return new Response('Forbidden', { status: 403 });
    }
    return handler(request, context);
  };
}

export function withAuth(handler) {
  return async (request, context) => {
    // Simple auth check - in production, implement proper authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return new Response('Unauthorized', { status: 401 });
    }
    return handler(request, context);
  };
}

export function withAdminAuth(handler) {
  return async (request, context) => {
    // Simple admin role check - in production, validate JWT and admin role
    const userRole = request.headers.get('x-user-role');
    if (!userRole || userRole !== 'admin') {
      return new Response('Forbidden - Admin access required', { status: 403 });
    }
    return handler(request, context);
  };
}