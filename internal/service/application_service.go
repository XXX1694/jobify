package service

import (
	"context"
	"errors"

	"github.com/abzalserikbay/jobify/internal/domain"
	"github.com/abzalserikbay/jobify/internal/repository"
	"github.com/google/uuid"
)

type ApplicationService struct {
	appRepo repository.ApplicationRepository
}

func NewApplicationService(appRepo repository.ApplicationRepository) *ApplicationService {
	return &ApplicationService{appRepo: appRepo}
}

func (s *ApplicationService) Create(ctx context.Context, userID, jobID uuid.UUID, note string) (*domain.Application, error) {
	app := &domain.Application{
		ID:     uuid.New(),
		UserID: userID,
		JobID:  jobID,
		Status: domain.StatusSaved,
		Note:   note,
	}
	if err := s.appRepo.Create(ctx, app); err != nil {
		return nil, err
	}
	return app, nil
}

func (s *ApplicationService) List(ctx context.Context, userID uuid.UUID) ([]domain.Application, error) {
	return s.appRepo.GetByUserID(ctx, userID)
}

func (s *ApplicationService) UpdateStatus(ctx context.Context, id, userID uuid.UUID, status domain.ApplicationStatus) error {
	app, err := s.appRepo.GetByID(ctx, id)
	if err != nil {
		return err
	}
	if app.UserID != userID {
		return domain.ErrForbidden
	}

	validStatuses := map[domain.ApplicationStatus]bool{
		domain.StatusSaved:     true,
		domain.StatusApplied:   true,
		domain.StatusInterview: true,
		domain.StatusOffer:     true,
		domain.StatusRejected:  true,
	}
	if !validStatuses[status] {
		return domain.ErrInvalidInput
	}

	return s.appRepo.UpdateStatus(ctx, id, status)
}

func (s *ApplicationService) Delete(ctx context.Context, id, userID uuid.UUID) error {
	app, err := s.appRepo.GetByID(ctx, id)
	if errors.Is(err, domain.ErrNotFound) {
		return domain.ErrNotFound
	}
	if err != nil {
		return err
	}
	if app.UserID != userID {
		return domain.ErrForbidden
	}
	return s.appRepo.Delete(ctx, id)
}
