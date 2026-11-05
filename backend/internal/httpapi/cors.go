package httpapi

import (
	"net/http"
	"strings"
)

func cors(origin string, next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Add("Vary", "Origin")
		allowed := origin != "" && origin != "*" && r.Header.Get("Origin") == origin
		if allowed {
			w.Header().Set("Access-Control-Allow-Origin", origin)
		}
		if r.Method == http.MethodOptions && r.URL.Path == "/api/v1/calculate" {
			w.Header().Add("Vary", "Access-Control-Request-Method")
			w.Header().Add("Vary", "Access-Control-Request-Headers")
			if !allowed || r.Header.Get("Access-Control-Request-Method") != http.MethodPost {
				w.Header().Set("Allow", "POST, OPTIONS")
				writeError(w, 405, "method_not_allowed", "Preflight is not allowed.")
				return
			}
			for _, header := range strings.Split(r.Header.Get("Access-Control-Request-Headers"), ",") {
				if header = strings.TrimSpace(header); header != "" && !strings.EqualFold(header, "Content-Type") {
					writeError(w, 400, "invalid_request", "Requested header is not allowed.")
					return
				}
			}
			w.Header().Set("Access-Control-Allow-Methods", "POST")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
			w.WriteHeader(http.StatusNoContent)
			return
		}
		next.ServeHTTP(w, r)
	})
}
