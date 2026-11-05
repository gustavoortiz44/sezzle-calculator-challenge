package httpapi

import (
	"encoding/json"
	"errors"
	"io"
	"net/http/httptest"
	"strings"
	"testing"
)

func TestCalculateHTTP(t *testing.T) {
	tests := []struct {
		name, method, path, contentType, body string
		status                                int
		code                                  string
		result                                float64
	}{
		{"add", "POST", "/api/v1/calculate", "application/json", `{"operation":"add","a":10,"b":5}`, 200, "", 15},
		{"subtract", "POST", "/api/v1/calculate", "application/json", `{"operation":"subtract","a":-2,"b":3}`, 200, "", -5},
		{"multiply", "POST", "/api/v1/calculate", "application/json", `{"operation":"multiply","a":0.5,"b":4}`, 200, "", 2},
		{"divide", "POST", "/api/v1/calculate", "application/json; charset=utf-8", `{"operation":"divide","a":7,"b":2}`, 200, "", 3.5},
		{"zero operand", "POST", "/api/v1/calculate", "application/json", `{"operation":"add","a":0,"b":0}`, 200, "", 0},
		{"exponent", "POST", "/api/v1/calculate", "application/json", `{"operation":"add","a":1e2,"b":1}`, 200, "", 101},
		{"unknown operation", "POST", "/api/v1/calculate", "application/json", `{"operation":"sqrt","a":1,"b":2}`, 422, "unsupported_operation", 0},
		{"division zero", "POST", "/api/v1/calculate", "application/json", `{"operation":"divide","a":1,"b":-0}`, 422, "division_by_zero", 0},
		{"overflow", "POST", "/api/v1/calculate", "application/json", `{"operation":"multiply","a":1e308,"b":10}`, 422, "non_finite_result", 0},
		{"range", "POST", "/api/v1/calculate", "application/json", `{"operation":"add","a":1e400,"b":1}`, 400, "invalid_number", 0},
		{"missing a", "POST", "/api/v1/calculate", "application/json", `{"operation":"add","b":1}`, 400, "missing_field", 0},
		{"missing b", "POST", "/api/v1/calculate", "application/json", `{"operation":"add","a":1}`, 400, "missing_field", 0},
		{"missing operation", "POST", "/api/v1/calculate", "application/json", `{"a":1,"b":1}`, 400, "missing_field", 0},
		{"null", "POST", "/api/v1/calculate", "application/json", `{"operation":"add","a":null,"b":1}`, 400, "missing_field", 0},
		{"string", "POST", "/api/v1/calculate", "application/json", `{"operation":"add","a":"10","b":1}`, 400, "invalid_field", 0},
		{"boolean", "POST", "/api/v1/calculate", "application/json", `{"operation":"add","a":true,"b":1}`, 400, "invalid_field", 0},
		{"operation type", "POST", "/api/v1/calculate", "application/json", `{"operation":1,"a":1,"b":1}`, 400, "invalid_field", 0},
		{"extra field", "POST", "/api/v1/calculate", "application/json", `{"operation":"add","a":1,"b":1,"x":0}`, 400, "invalid_request", 0},
		{"empty", "POST", "/api/v1/calculate", "application/json", ``, 400, "invalid_request", 0},
		{"malformed", "POST", "/api/v1/calculate", "application/json", `{`, 400, "invalid_request", 0},
		{"array", "POST", "/api/v1/calculate", "application/json", `[]`, 400, "invalid_request", 0},
		{"null body", "POST", "/api/v1/calculate", "application/json", `null`, 400, "invalid_request", 0},
		{"multiple objects", "POST", "/api/v1/calculate", "application/json", `{} {}`, 400, "invalid_request", 0},
		{"nan", "POST", "/api/v1/calculate", "application/json", `{"operation":"add","a":NaN,"b":1}`, 400, "invalid_request", 0},
		{"missing content type", "POST", "/api/v1/calculate", "", `{}`, 415, "unsupported_media_type", 0},
		{"wrong content type", "POST", "/api/v1/calculate", "text/plain", `{}`, 415, "unsupported_media_type", 0},
		{"large", "POST", "/api/v1/calculate", "application/json", strings.Repeat(" ", maxBodyBytes+1), 413, "request_too_large", 0},
		{"method", "GET", "/api/v1/calculate", "", ``, 405, "method_not_allowed", 0},
		{"route", "POST", "/unknown", "application/json", `{}`, 404, "not_found", 0},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			r := httptest.NewRequest(tt.method, tt.path, strings.NewReader(tt.body))
			r.Header.Set("Content-Type", tt.contentType)
			r.Header.Set("Origin", "http://localhost:5173")
			w := httptest.NewRecorder()
			NewHandler("http://localhost:5173").ServeHTTP(w, r)
			if w.Code != tt.status {
				t.Fatalf("status = %d, want %d; body %s", w.Code, tt.status, w.Body.String())
			}
			if w.Header().Get("Content-Type") != "application/json" {
				t.Error("missing JSON content type")
			}
			if w.Header().Get("Access-Control-Allow-Origin") != "http://localhost:5173" {
				t.Error("missing CORS on response")
			}
			if tt.status == 405 && w.Result().Header.Get("Allow") != "POST, OPTIONS" {
				t.Error("missing Allow header")
			}
			var body struct {
				Result *float64  `json:"result"`
				Error  *apiError `json:"error"`
			}
			if err := json.Unmarshal(w.Body.Bytes(), &body); err != nil {
				t.Fatal(err)
			}
			if tt.code == "" {
				if body.Error != nil || body.Result == nil || *body.Result != tt.result {
					t.Fatalf("unexpected success body: %s", w.Body.String())
				}
			} else if body.Result != nil || body.Error == nil || body.Error.Code != tt.code || body.Error.Message == "" {
				t.Fatalf("unexpected error body: %s", w.Body.String())
			}
		})
	}
}

type brokenReader struct{}

func (brokenReader) Read([]byte) (int, error) { return 0, errors.New("read failed") }

func TestBodyReadFailure(t *testing.T) {
	r := httptest.NewRequest("POST", "/api/v1/calculate", io.NopCloser(brokenReader{}))
	r.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	NewHandler("").ServeHTTP(w, r)
	if w.Code != 400 || !strings.Contains(w.Body.String(), `"invalid_request"`) {
		t.Fatalf("unexpected response: %d %s", w.Code, w.Body.String())
	}
}
