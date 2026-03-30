package validator

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
)

func Decode(r *http.Request, dst interface{}) error {
	dec := json.NewDecoder(r.Body)
	dec.DisallowUnknownFields()
	if err := dec.Decode(dst); err != nil {
		return fmt.Errorf("invalid request body: %w", err)
	}
	return nil
}

func ValidateEmail(email string) bool {
	return strings.Contains(email, "@") && len(email) >= 3
}

func ValidatePassword(password string) bool {
	return len(password) >= 6
}
