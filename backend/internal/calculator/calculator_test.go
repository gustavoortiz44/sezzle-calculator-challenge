package calculator

import (
	"errors"
	"math"
	"testing"
)

func TestCalculate(t *testing.T) {
	tests := []struct {
		name, operation string
		a, b, want      float64
		err             error
	}{
		{"addition", "add", 10, 5, 15, nil},
		{"subtraction", "subtract", 10, 5, 5, nil},
		{"multiplication", "multiply", -2, 3, -6, nil},
		{"division", "divide", 7, 2, 3.5, nil},
		{"zero", "multiply", 0, -5, 0, nil},
		{"negative subtraction", "subtract", -2, -3, 1, nil},
		{"decimals", "add", 0.1, 0.2, 0.3, nil},
		{"decimal multiplication", "multiply", 0.5, 0.25, 0.125, nil},
		{"negative division", "divide", -7, 2, -3.5, nil},
		{"underflow", "divide", math.SmallestNonzeroFloat64, 2, 0, nil},
		{"unknown", "power", 1, 2, 0, ErrUnsupportedOperation},
		{"case sensitive", "ADD", 1, 2, 0, ErrUnsupportedOperation},
		{"zero divisor", "divide", 1, 0, 0, ErrDivisionByZero},
		{"negative zero divisor", "divide", 1, math.Copysign(0, -1), 0, ErrDivisionByZero},
		{"nan a", "add", math.NaN(), 1, 0, ErrInvalidNumber},
		{"nan b", "add", 1, math.NaN(), 0, ErrInvalidNumber},
		{"infinite a", "add", math.Inf(1), 1, 0, ErrInvalidNumber},
		{"infinite b", "add", 1, math.Inf(-1), 0, ErrInvalidNumber},
		{"addition overflow", "add", math.MaxFloat64, math.MaxFloat64, 0, ErrNonFiniteResult},
		{"subtraction overflow", "subtract", -math.MaxFloat64, math.MaxFloat64, 0, ErrNonFiniteResult},
		{"multiplication overflow", "multiply", math.MaxFloat64, 2, 0, ErrNonFiniteResult},
		{"division overflow", "divide", math.MaxFloat64, 0.5, 0, ErrNonFiniteResult},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := Calculate(tt.operation, tt.a, tt.b)
			if !errors.Is(err, tt.err) {
				t.Fatalf("error = %v, want %v", err, tt.err)
			}
			if math.Abs(got-tt.want) > 1e-12 {
				t.Errorf("result = %v, want %v", got, tt.want)
			}
		})
	}
}
