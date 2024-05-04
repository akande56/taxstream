
**Authentication and Security Documentation**
==========================================

Welcome to the authentication and security documentation for our Django-powered backend API. This guide aims to provide frontend developers with a clear understanding of how authentication, authorization, and security are implemented in our application.

**Authentication**
----------------

**JSON Web Token (JWT) Authentication**
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

We utilize JSON Web Tokens (JWT) for user authentication in our API. JWTs are self-contained tokens that contain information about the user and are digitally signed with a secret key. This allows for stateless authentication, meaning the server doesn't need to store session information on its own.

Upon successful user login, a JWT access token is provided. This token needs to be included in the Authorization header of subsequent requests to access protected API endpoints.

**Token Lifetimes**
^^^^^^^^^^^^^^^
Token consist of acces and refresh token. Acces token need to be part header for any protected endpoints, while refresh token can be used to generate new access and refresh token upon access token expiration
- **Access Token Lifetime:** {{ SIMPLE_JWT.ACCESS_TOKEN_LIFETIME }} (e.g., 15 minutes)
- **Refresh Token Lifetime:** {{ SIMPLE_JWT.REFRESH_TOKEN_LIFETIME }} (e.g., 1 day)

This means access tokens expire relatively quickly, while refresh tokens last longer. Access tokens are used for actual authentication, while refresh tokens are used to obtain new access tokens once the current one expires.

**Token Rotation**
^^^^^^^^^^^^^

- **Rotate Refresh Tokens:** Enabled
- **Blacklist After Rotation:** Enabled

For enhanced security, we rotate refresh tokens upon issuing new access tokens. This invalidates the old refresh token, preventing its misuse even if compromised. Additionally, blacklisting ensures that revoked or expired tokens cannot be used for unauthorized access.

**Integrating JWT in Requests**
~~~~~~~~~~~~~~~~~~~~~~~~~~~

To authenticate requests, include the JWT access token in the Authorization header of your HTTP requests:

.. code-block:: http

    Authorization: Bearer <your_access_token>

For example, using JavaScript:

```javascript
const axios = require('axios');

const apiUrl = 'https://your-api-domain/api/v1/protected-endpoint';
const accessToken = 'your_access_token';

const options = {
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
};

axios.get(apiUrl, options)
  .then(response => {
    // Handle successful response
  })
  .catch(error => {
    // Handle authentication error
  });
```

**Authorization**
----------------

Our API endpoints are protected by default, requiring authenticated users to access them. Additionally, specific endpoints may have more granular permission requirements.

**Default Permissions**
^^^^^^^^^^^^^^^^^^

- **Default Permission Class:** `IsAuthenticated`

This permission class ensures that only authenticated users can access API endpoints.

**Custom Permissions**
^^^^^^^^^^^^^^^^^

- **IsSuperuser1:** `for STATE Supervisor`
- **IsSuperuser2:** `for LGA Supervisor`
- **IsWardMonitor:** `war monitor for particular area`
- **IsTaxCollector:** `tax collectors`

**Security**
--------

**HTTP Headers**
^^^^^^^^^^^^

We enforce security measures through HTTP headers to mitigate common vulnerabilities:

- **HTTPOnly Cookies:** Enabled for session cookies. This prevents client-side JavaScript from accessing session cookies, mitigating the risk of XSS attacks.
- **CSRF Cookie HTTPOnly:** Enabled. This prevents Cross-Site Request Forgery (CSRF) attacks by ensuring that CSRF tokens are not accessible to client-side JavaScript.
- **X-Frame-Options: DENY:** This header prevents clickjacking attacks by disallowing the API to be rendered within a frame on another website.

**Additional Security Measures**
^^^^^^^^^^^^^^^^^^^^^^^^^^^^

In addition to the previously mentioned security practices, we implement the following Django security settings:

- **`SECURE_PROXY_SSL_HEADER`:**
   - This setting specifies the HTTP header used to determine that the request is being made over HTTPS.
   - We set it to `"HTTP_X_FORWARDED_PROTO", "https"` to ensure that the `HTTPS` flag is correctly set even behind a reverse proxy.

- **`SECURE_SSL_REDIRECT`:**
   - This setting redirects all non-HTTPS requests to their HTTPS counterparts.
   - We set it to `True` to enforce HTTPS connections for all API requests.

- **`SESSION_COOKIE_SECURE`:**
   - This setting ensures that session cookies are only transmitted over HTTPS connections, mitigating the risk of session hijacking.
   - We set it to `True` to enforce secure transmission of session cookies.

- **`CSRF_COOKIE_SECURE`:**
   - This setting ensures that CSRF cookies are only transmitted over HTTPS connections, preventing CSRF attacks.
   - We set it to `True` to enforce secure transmission of CSRF cookies.

- **`SECURE_HSTS_SECONDS`:**
   - This setting defines the number of seconds a browser should remember that the connection to our API should be made over HTTPS.
   - We initially set it to `60` seconds for testing purposes and recommend gradually increasing it to a longer duration like `518400` (one week) once you confirm its functionality.

- **`SECURE_HSTS_INCLUDE_SUBDOMAINS`:**
   - This setting controls whether the Strict Transport Security (HSTS) header should include subdomains.
   - We set it to `True` to ensure that all subdomains of our API are accessed over HTTPS.

- **`SECURE_HSTS_PRELOAD`:**
   - This setting instructs compatible browsers to preload our website into their HSTS preload list.
   - We set it to `True` to further enhance the security of our API by encouraging browsers to prioritize HTTPS connections.

- **`SECURE_CONTENT_TYPE_NOSNIFF`:**
   - This setting disables content sniffing, a browser feature that can be exploited to misinterpret the MIME type of a response.
   - We set it to `True` to prevent potential security vulnerabilities related to content sniffing.



**Email Security**
^^^^^^^^^^^^^^

We utilize SendGrid for secure email delivery, ensuring that communication with users happens through a reputable and secure email service provider.

- **Email Backend:** SendGrid
- **SendGrid API Key:** Provided via environment variable

This configuration ensures that email communication adheres to security best practices.

**Additional Security Measures**

We implement various other security measures within our API, including:

- **Input Validation:** User input is carefully validated to prevent malicious code injection attacks.
- **Data Sanitization:** Data is sanitized before being stored or processed to prevent vulnerabilities like SQL injection.
- **Regular Security Updates:** We strive to keep our dependencies and libraries updated with the latest security patches.