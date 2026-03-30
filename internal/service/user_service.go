package service

import (
	"context"

	"github.com/abzalserikbay/jobify/internal/domain"
	"github.com/abzalserikbay/jobify/internal/repository"
	"github.com/google/uuid"
)

type UserService struct {
	userRepo    repository.UserRepository
	profileRepo repository.ProfileRepository
}

func NewUserService(userRepo repository.UserRepository, profileRepo repository.ProfileRepository) *UserService {
	return &UserService{userRepo: userRepo, profileRepo: profileRepo}
}

func (s *UserService) GetProfile(ctx context.Context, userID uuid.UUID) (*domain.User, *domain.DeveloperProfile, error) {
	user, err := s.userRepo.GetByID(ctx, userID)
	if err != nil {
		return nil, nil, err
	}

	profile, err := s.profileRepo.GetByUserID(ctx, userID)
	if err != nil {
		return user, nil, nil
	}

	return user, profile, nil
}

func (s *UserService) UpdateProfile(ctx context.Context, profile *domain.DeveloperProfile) error {
	return s.profileRepo.Update(ctx, profile)
}
