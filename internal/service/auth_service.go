package service

import (
	"context"
	"errors"

	"github.com/abzalserikbay/jobify/internal/domain"
	"github.com/abzalserikbay/jobify/internal/repository"
	"github.com/abzalserikbay/jobify/pkg/hasher"
	jwtpkg "github.com/abzalserikbay/jobify/pkg/jwt"
	"github.com/google/uuid"
)

type AuthService struct {
	userRepo    repository.UserRepository
	profileRepo repository.ProfileRepository
	hasher      *hasher.BcryptHasher
	jwt         *jwtpkg.Manager
}

func NewAuthService(
	userRepo repository.UserRepository,
	profileRepo repository.ProfileRepository,
	hasher *hasher.BcryptHasher,
	jwt *jwtpkg.Manager,
) *AuthService {
	return &AuthService{userRepo: userRepo, profileRepo: profileRepo, hasher: hasher, jwt: jwt}
}

type RegisterInput struct {
	Email    string
	Password string
}

type LoginInput struct {
	Email    string
	Password string
}

func (s *AuthService) Register(ctx context.Context, in RegisterInput) (*domain.User, error) {
	_, err := s.userRepo.GetByEmail(ctx, in.Email)
	if err == nil {
		return nil, domain.ErrConflict
	}
	if !errors.Is(err, domain.ErrNotFound) {
		return nil, err
	}

	hashed, err := s.hasher.Hash(in.Password)
	if err != nil {
		return nil, err
	}

	user := &domain.User{
		ID:       uuid.New(),
		Email:    in.Email,
		Password: hashed,
		Role:     domain.RoleDeveloper,
	}
	if err := s.userRepo.Create(ctx, user); err != nil {
		return nil, err
	}

	profile := &domain.DeveloperProfile{
		ID:     uuid.New(),
		UserID: user.ID,
	}
	_ = s.profileRepo.Create(ctx, profile)

	return user, nil
}

func (s *AuthService) Login(ctx context.Context, in LoginInput) (string, error) {
	user, err := s.userRepo.GetByEmail(ctx, in.Email)
	if errors.Is(err, domain.ErrNotFound) {
		return "", domain.ErrUnauthorized
	}
	if err != nil {
		return "", err
	}

	if err := s.hasher.Compare(in.Password, user.Password); err != nil {
		return "", domain.ErrUnauthorized
	}

	return s.jwt.Generate(user.ID, string(user.Role))
}
