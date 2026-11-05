package httpapi

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"mime"
	"net/http"
	"strconv"

	"sezzle-calculator/backend/internal/calculator"
)

const maxBodyBytes = 4096

type apiError struct {
	Code    string `json:"code"`
	Message string `json:"message"`
}

func writeJSON(w http.ResponseWriter, status int, value any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	// All response values are fixed strings or previously checked finite numbers.
	_ = json.NewEncoder(w).Encode(value)
}

func writeError(w http.ResponseWriter, status int, code, message string) {
	writeJSON(w, status, struct {
		Error apiError `json:"error"`
	}{apiError{code, message}})
}

func NewHandler(origin string) http.Handler {
	return cors(origin, http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/api/v1/calculate" {
			writeError(w, 404, "not_found", "Route not found.")
			return
		}
		if r.Method != http.MethodPost {
			w.Header().Set("Allow", "POST, OPTIONS")
			writeError(w, 405, "method_not_allowed", "Method not allowed.")
			return
		}
		calculate(w, r)
	}))
}

func calculate(w http.ResponseWriter, r *http.Request) {
	mediaType, _, err := mime.ParseMediaType(r.Header.Get("Content-Type"))
	if err != nil || mediaType != "application/json" {
		writeError(w, 415, "unsupported_media_type", "Content-Type must be application/json.")
		return
	}
	r.Body = http.MaxBytesReader(w, r.Body, maxBodyBytes)
	defer r.Body.Close()
	body, err := io.ReadAll(r.Body)
	if err != nil {
		var limit *http.MaxBytesError
		if errors.As(err, &limit) {
			writeError(w, 413, "request_too_large", "Request body exceeds 4096 bytes.")
		} else {
			writeError(w, 400, "invalid_request", "Could not read request body.")
		}
		return
	}
	var fields map[string]json.RawMessage
	if err := json.Unmarshal(body, &fields); err != nil || fields == nil {
		writeError(w, 400, "invalid_request", "Body must be a single JSON object.")
		return
	}
	for key := range fields {
		if key != "operation" && key != "a" && key != "b" {
			writeError(w, 400, "invalid_request", "Unknown request field.")
			return
		}
	}
	for _, key := range []string{"operation", "a", "b"} {
		if len(fields[key]) == 0 || string(fields[key]) == "null" {
			writeError(w, 400, "missing_field", fmt.Sprintf("Field '%s' is required.", key))
			return
		}
	}
	var operation string
	if err := json.Unmarshal(fields["operation"], &operation); err != nil {
		writeError(w, 400, "invalid_field", "Field 'operation' must be a string.")
		return
	}
	operands := [2]float64{}
	for i, key := range []string{"a", "b"} {
		var number json.Number
		// Reject strings explicitly: json.Number also accepts quoted numbers.
		if fields[key][0] == '"' || json.Unmarshal(fields[key], &number) != nil {
			writeError(w, 400, "invalid_field", fmt.Sprintf("Field '%s' must be a number.", key))
			return
		}
		operands[i], err = strconv.ParseFloat(number.String(), 64)
		if err != nil {
			writeError(w, 400, "invalid_number", fmt.Sprintf("Field '%s' must be a finite float64 number.", key))
			return
		}
	}
	result, err := calculator.Calculate(operation, operands[0], operands[1])
	if err != nil {
		switch err {
		case calculator.ErrUnsupportedOperation:
			writeError(w, 422, "unsupported_operation", "Operation must be one of: add, subtract, multiply, divide.")
		case calculator.ErrDivisionByZero:
			writeError(w, 422, "division_by_zero", "Division by zero is not allowed.")
		case calculator.ErrNonFiniteResult:
			writeError(w, 422, "non_finite_result", "Result is not a finite number.")
		default:
			writeError(w, 500, "internal_error", "An internal error occurred.")
		}
		return
	}
	writeJSON(w, 200, struct {
		Result float64 `json:"result"`
	}{result})
}
