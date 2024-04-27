from rest_framework_simplejwt.backends import SimpleJWTCookieBackend

class HttpOnlyTokenCookieBackend(SimpleJWTCookieBackend):
    def get_token_cookie_attrs(self):
        return {
            'max_age': self.token_age,
            'httponly': True,
            'secure': True if self.request.is_secure() else False,
            'samesite': 'lax',  # Adjust if needed
        }
