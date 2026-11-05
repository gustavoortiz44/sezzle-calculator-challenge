package calculator

import (
	"errors"
	"math"
)

var (
	ErrInvalidNumber        = errors.New("operands must be finite numbers")
	ErrUnsupportedOperation = errors.New("operation must be one of: add, subtract, multiply, divide")
	ErrDivisionByZero       = errors.New("division by zero is not allowed")
	ErrNonFiniteResult      = errors.New("result is not a finite number")
)

func Calculate(operation string, a, b float64) (float64, error) {
	if math.IsNaN(a) || math.IsInf(a, 0) || math.IsNaN(b) || math.IsInf(b, 0) {
		return 0, ErrInvalidNumber
	}
	var result float64
	switch operation {
	case "add":
		result = a + b
	case "subtract":
		result = a - b
	case "multiply":
		result = a * b
	case "divide":
		if b == 0 {
			return 0, ErrDivisionByZero
		}
		result = a / b
	default:
		return 0, ErrUnsupportedOperation
	}
	if math.IsNaN(result) || math.IsInf(result, 0) {
		return 0, ErrNonFiniteResult
	}
	return result, nil
}
