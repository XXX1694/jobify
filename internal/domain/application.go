package domain

import (
	"time"

	"github.com/google/uuid"
)

type ApplicationStatus string

const (
	StatusSaved     ApplicationStatus = "saved"
	StatusApplied   ApplicationStatus = "applied"
	StatusInterview ApplicationStatus = "interview"
	StatusOffer     ApplicationStatus = "offer"
	StatusRejected  ApplicationStatus = "rejected"
)

type Application struct {
	ID        uuid.UUID         `json:"id"`
	UserID    uuid.UUID         `json:"user_id"`
	JobID     uuid.UUID         `json:"job_id"`
	Status    ApplicationStatus `json:"status"`
	Note      string            `json:"note"`
	AppliedAt *time.Time        `json:"applied_at,omitempty"`
	UpdatedAt time.Time         `json:"updated_at"`
	Job       *Job              `json:"job,omitempty"`
}
