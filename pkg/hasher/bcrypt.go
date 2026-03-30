package hasher

import "golang.org/x/crypto/bcrypt"

type BcryptHasher struct{}

func New() *BcryptHasher {
	return &BcryptHasher{}
}

func (h *BcryptHasher) Hash(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	return string(bytes), err
}

func (h *BcryptHasher) Compare(password, hash string) error {
	return bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
}
