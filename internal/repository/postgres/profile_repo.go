package postgres

import (
	"context"
	"errors"

	"github.com/abzalserikbay/jobify/internal/domain"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type ProfileRepo struct {
	db *pgxpool.Pool
}

func NewProfileRepo(db *pgxpool.Pool) *ProfileRepo {
	return &ProfileRepo{db: db}
}

func (r *ProfileRepo) Create(ctx context.Context, p *domain.DeveloperProfile) error {
	q := `INSERT INTO developer_profiles (id, user_id, name, bio, skills, experience_years, salary_min, salary_max, remote_only, github_url)
	      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
	      RETURNING updated_at`
	return r.db.QueryRow(ctx, q,
		p.ID, p.UserID, p.Name, p.Bio, p.Skills,
		p.ExperienceYears, p.SalaryMin, p.SalaryMax, p.RemoteOnly, p.GithubURL,
	).Scan(&p.UpdatedAt)
}

func (r *ProfileRepo) GetByUserID(ctx context.Context, userID uuid.UUID) (*domain.DeveloperProfile, error) {
	var p domain.DeveloperProfile
	q := `SELECT id, user_id, name, bio, skills, experience_years, salary_min, salary_max, remote_only, github_url, updated_at
	      FROM developer_profiles WHERE user_id = $1`
	err := r.db.QueryRow(ctx, q, userID).Scan(
		&p.ID, &p.UserID, &p.Name, &p.Bio, &p.Skills,
		&p.ExperienceYears, &p.SalaryMin, &p.SalaryMax, &p.RemoteOnly, &p.GithubURL, &p.UpdatedAt,
	)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, domain.ErrNotFound
	}
	return &p, err
}

func (r *ProfileRepo) Update(ctx context.Context, p *domain.DeveloperProfile) error {
	q := `UPDATE developer_profiles
	      SET name=$1, bio=$2, skills=$3, experience_years=$4, salary_min=$5, salary_max=$6, remote_only=$7, github_url=$8, updated_at=NOW()
	      WHERE user_id=$9
	      RETURNING updated_at`
	return r.db.QueryRow(ctx, q,
		p.Name, p.Bio, p.Skills, p.ExperienceYears, p.SalaryMin, p.SalaryMax, p.RemoteOnly, p.GithubURL, p.UserID,
	).Scan(&p.UpdatedAt)
}
