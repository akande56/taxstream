Authentication and Security Documentation
==========================================

Welcome to the authentication and security documentation for our Django-powered backend API. This guide aims to provide frontend developers with an understanding of how authentication, authorization, and security are implemented in our application.

Authentication
----------------

JSON Web Token (JWT) Authentication
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

We use JSON Web Tokens (JWT) for authenticating users in our API. Upon successful authentication, a JWT token is provided, which must be included in the Authorization header of subsequent requests.

Token Lifetimes
^^^^^^^^^^^^^^^

- Access Token Lifetime: {{ SIMPLE_JWT.ACCESS_TOKEN_LIFETIME }}
- Refresh Token Lifetime: {{ SIMPLE_JWT.REFRESH_TOKEN_LIFETIME }}

Token Rotation
^^^^^^^^^^^^^

- Rotate Refresh Tokens: Enabled
- Blacklist After Rotation: Enabled

Integrating JWT in Requests
~~~~~~~~~~~~~~~~~~~~~~~~~~~

To authenticate requests, include the JWT token in the Authorization header:

.. code-block:: http

    Authorization: Bearer <your_access_token>

Authorization
----------------

Our API endpoints are protected by default, requiring authenticated users to access them. Additionally, certain endpoints may have specific permission requirements.

Default Permissions
^^^^^^^^^^^^^^^^^^

- Default Permission Class: IsAuthenticated

Custom Permissions
^^^^^^^^^^^^^^^^^

For specific endpoints, custom permissions may be applied to restrict access based on user roles or permissions.

Security
--------

HTTP Headers
^^^^^^^^^^^^

We enforce security measures through HTTP headers to mitigate common vulnerabilities.

- HTTPOnly Cookies: Enabled for session cookies
- CSRF Cookie HTTPOnly: Enabled
- X-Frame-Options: DENY

Email Security
^^^^^^^^^^^^^^

We utilize SendGrid for email delivery, ensuring secure communication with our users.

- Email Backend: SendGrid
- SendGrid API Key: Provided via environment variable
