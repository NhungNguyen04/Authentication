/**
 * Routes that are accessible to the public without authentication
 * @constant {string[]}
 */
export const publicRoutes = [
    "/",
    "/auth/new-verification",
    "/auth/new-password",
]

/**
 * Routes used for authentication purposes (login, register, etc.)
 * @constant {string[]}
 */
export const authRoutes = [
    "/auth/login",
    "/auth/register",
    "/auth/error",
    "/auth/reset"
]

/**
 * Prefix for API authentication endpoints
 * Routes starting with this prefix are used for API authentication
 * @constant {string}
 */
export const apiAuthPrefix = "/api/auth";

/**
 * Default redirect path after successful login
 * @constant {string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/settings";
