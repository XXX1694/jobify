package middleware

import (
	"context"
	"net/http"
	"strings"

	jwtpkg "github.com/abzalserikbay/jobify/pkg/jwt"
	"github.com/abzalserikbay/jobify/pkg/response"
)

type contextKey string

const (
	ContextKeyUserID contextKey = "user_id"
	ContextKeyRole   contextKey = "role"
)

func JWTAuth(manager *jwtpkg.Manager) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			header := r.Header.Get("Authorization")
			if !strings.HasPrefix(header, "Bearer ") {
				response.Error(w, http.StatusUnauthorized, "missing or invalid authorization header")
				return
			}

			claims, err := manager.Parse(strings.TrimPrefix(header, "Bearer "))
			if err != nil {
				response.Error(w, http.StatusUnauthorized, "invalid token")
				return
			}

			ctx := context.WithValue(r.Context(), ContextKeyUserID, claims.UserID)
			ctx = context.WithValue(ctx, ContextKeyRole, claims.Role)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

func RequireRole(role string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			if r.Context().Value(ContextKeyRole) != role {
				response.Error(w, http.StatusForbidden, "forbidden")
				return
			}
			next.ServeHTTP(w, r)
		})
	}
}
