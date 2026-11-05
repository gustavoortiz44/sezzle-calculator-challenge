package httpapi

import (
	"net/http/httptest"
	"strings"
	"testing"
)

func TestCORS(t *testing.T) {
	const allowed = "http://localhost:5173"
	for _, tt := range []struct {
		name, configured, origin, method, requestedMethod, headers string
		status                                                     int
		allow                                                      bool
	}{
		{"preflight", allowed, allowed, "OPTIONS", "POST", "content-type", 204, true},
		{"no headers", allowed, allowed, "OPTIONS", "POST", "", 204, true},
		{"forbidden origin", allowed, "https://other.example", "OPTIONS", "POST", "Content-Type", 405, false},
		{"forbidden method", allowed, allowed, "OPTIONS", "DELETE", "", 405, true},
		{"forbidden header", allowed, allowed, "OPTIONS", "POST", "Content-Type, Authorization", 400, true},
		{"no origin preflight", allowed, "", "OPTIONS", "POST", "", 405, false},
		{"no origin", allowed, "", "POST", "", "", 400, false},
		{"other origin post", allowed, "https://other.example", "POST", "", "", 400, false},
		{"wildcard disabled", "*", "*", "OPTIONS", "POST", "", 405, false},
		{"disabled", "", "", "OPTIONS", "POST", "", 405, false},
	} {
		t.Run(tt.name, func(t *testing.T) {
			r := httptest.NewRequest(tt.method, "/api/v1/calculate", strings.NewReader(`{}`))
			r.Header.Set("Content-Type", "application/json")
			r.Header.Set("Origin", tt.origin)
			r.Header.Set("Access-Control-Request-Method", tt.requestedMethod)
			r.Header.Set("Access-Control-Request-Headers", tt.headers)
			w := httptest.NewRecorder()
			NewHandler(tt.configured).ServeHTTP(w, r)
			h := w.Result().Header
			if w.Code != tt.status {
				t.Fatalf("status = %d, want %d", w.Code, tt.status)
			}
			if (h.Get("Access-Control-Allow-Origin") != "") != tt.allow {
				t.Error("incorrect origin permission")
			}
			if !strings.Contains(strings.Join(h.Values("Vary"), ","), "Origin") {
				t.Error("missing Vary")
			}
			if h.Get("Access-Control-Allow-Credentials") != "" {
				t.Error("credentials must not be enabled")
			}
			if tt.status == 405 && h.Get("Allow") != "POST, OPTIONS" {
				t.Error("missing Allow")
			}
			if tt.status == 204 {
				if w.Body.Len() != 0 || h.Get("Access-Control-Allow-Methods") != "POST" || h.Get("Access-Control-Allow-Headers") != "Content-Type" {
					t.Error("invalid preflight response")
				}
			}
		})
	}
}
