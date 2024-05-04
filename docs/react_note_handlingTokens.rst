Additional Note for React Implementation
==========================================


Access Tokens:
----------------

Storge:

- HTTPOnly Cookies:

The recommended approach is to store access tokens in browser cookies with the HttpOnly flag set. This prevents client-side JavaScript from accessing the token, mitigating XSS vulnerabilities.
You can set the HttpOnly flag when creating the cookie using JavaScript:

.. code-block:: http
    
    document.cookie = `access_token=${accessToken}; HttpOnly; Path=/`;


Refresh Tokens:
----------------

Refresh tokens, due to their longer lifespans, should not be stored in cookies. Instead, store them in the browser's local storage.

Storge:

While local storage is a common option for storing refresh tokens in React applications, there are alternative storage mechanisms you can consider, each with its own advantages and drawbacks:

1. Session Storage:

- Pros:
    Data is persisted within the current browser session, providing temporary storage for refresh tokens.
    More secure than local storage as data is cleared upon closing the browser window or tab.
- Cons:
    Tokens are not accessible across different browser sessions or tabs.
    May not be suitable for refresh tokens with long lifespans that need to persist beyond a single session.
2. IndexedDB:

- Pros:
    Offers persistent storage beyond the current session, similar to local storage.
    Provides a structured way to store data, potentially allowing for more efficient retrieval and management of refresh tokens.
- Cons:
    Requires more complex JavaScript code compared to local storage.
    Compatibility across different browsers might be a concern.
3. Server-Side Storage:

- Pros:
Offers the highest level of security by storing refresh tokens on the server-side.
Mitigates the risk of client-side vulnerabilities associated with local storage or session storage.
- Cons:
    Requires additional server-side logic to handle token storage, retrieval, and invalidation.
    May introduce latency when refreshing access tokens compared to client-side storage options.



sample react implementation login 
---------------------------------

- Access token

.. code-block:: http
    
    npm install js-cookie

.. code-block:: http
    
    const storeAccessToken = (accessToken) => {
    Cookies.set('access_token', accessToken);
    };


- Refresh token
.. code-block:: http
    
    const storeAccessToken = (accessToken) => {
    Cookies.set('access_token', accessToken);
    };



Handle case for situation where user is active and access token expires
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. code-block:: http
    
    const refreshAccessToken = async () => {
    const refreshToken = sessionStorage.getItem('refresh');
    if (!refreshToken) {
        // Handle case where no refresh token is available (e.g., user needs to log in again)
        return;
    }

    const response = await fetch('/api/token/refresh/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ refresh: refreshToken })
    });

    if (response.ok) {
        const data = await response.json();
        storeAccessToken(data.access); // Store new access token in HttpOnly cookie
    } else {
        // Handle refresh token failure (e.g., invalid or expired)
        removeRefreshToken(); // Remove invalid refresh token from session storage
        // Potentially prompt user to log in again
    }
    };



