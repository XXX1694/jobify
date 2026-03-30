package domain

import (
	"time"

	"github.com/google/uuid"
)

type Role string

const (
	RoleDeveloper Role = "developer"
	RoleAdmin     Role = "admin"
)

type User struct {
	ID        uuid.UUID `json:"id"`
	Email     string    `json:"email"`
	Password  string    `json:"-"`
	Role      Role      `json:"role"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type DeveloperProfile struct {
	ID              uuid.UUID `json:"id"`
	UserID          uuid.UUID `json:"user_id"`
	Name            string    `json:"name"`
	Bio             string    `json:"bio"`
	Skills          []string  `json:"skills"`
	ExperienceYears int       `json:"experience_years"`
	SalaryMin       int       `json:"salary_min"`
	SalaryMax       int       `json:"salary_max"`
	RemoteOnly      bool      `json:"remote_only"`
	GithubURL       string    `json:"github_url"`
	UpdatedAt       time.Time `json:"updated_at"`
}
