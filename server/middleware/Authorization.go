package middleware

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strings"

	"github.com/golang-jwt/jwt"
)

type contextKey string

const EmailKey contextKey = "email"

func Authorization(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authorizationHeader := r.Header.Get("Authorization")
		if authorizationHeader == "" || !strings.HasPrefix(authorizationHeader, "Bearer ") {
			response, _ := json.Marshal(map[string]string{"error": "Missing or invalin token"})
			w.WriteHeader(http.StatusUnauthorized)
			w.Write([]byte(response))
			return
		}

		var tokenString string = strings.Replace(authorizationHeader, "Bearer ", "", -1)

		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			if method, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method")
			} else if method != jwt.SigningMethodHS256 {
				return nil, fmt.Errorf("signing method invalid")
			}
			return []byte(os.Getenv("JWT_KEY")), nil
		})

		if err != nil || !token.Valid {
			response, _ := json.Marshal(map[string]string{"error": "Unauthorized"})
			w.WriteHeader(http.StatusUnauthorized)
			w.Write([]byte(response))
			return
		}

		claims, ok := token.Claims.(jwt.MapClaims)
		email := claims["email"].(string)
		if email == "" || !ok {
			response, _ := json.Marshal(map[string]string{"error": "Invalid token claims"})
			w.WriteHeader(http.StatusUnauthorized)
			w.Write([]byte(response))
			return
		}
		ctx := context.WithValue(r.Context(), EmailKey, email)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
