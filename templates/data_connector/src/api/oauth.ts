/**
 * The scopes to request as part of the OAuth flow.
 * These scopes are required to read the user's designs and brand templates.
 *
 * @see https://www.canva.dev/docs/apps/authenticating-users/oauth/#overview - for more information about using the @canva/user package to support OAuth login.
 * @see https://www.canva.dev/docs/connect/appendix/scopes/ - for a full list of Canva Connect API scopes.
 */
export const scope = new Set(["design:meta:read", "brandtemplate:meta:read"]);
