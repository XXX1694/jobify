package postgres

import (
	"context"
	"errors"

	"github.com/abzalserikbay/jobify/internal/domain"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type ApplicationRepo struct {
	db *pgxpool.Pool
}

func NewApplicationRepo(db *pgxpool.Pool) *ApplicationRepo {
	return &ApplicationRepo{db: db}
}

func (r *ApplicationRepo) Create(ctx context.Context, a *domain.Application) error {
	q := `INSERT INTO applications (id, user_id, job_id, status, note)
	      VALUES ($1,$2,$3,$4,$5)
	      RETURNING updated_at`
	return r.db.QueryRow(ctx, q, a.ID, a.UserID, a.JobID, a.Status, a.Note).Scan(&a.UpdatedAt)
}

func (r *ApplicationRepo) GetByID(ctx context.Context, id uuid.UUID) (*domain.Application, error) {
	var a domain.Application
	q := `SELECT id, user_id, job_id, status, note, applied_at, updated_at FROM applications WHERE id=$1`
	err := r.db.QueryRow(ctx, q, id).Scan(&a.ID, &a.UserID, &a.JobID, &a.Status, &a.Note, &a.AppliedAt, &a.UpdatedAt)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, domain.ErrNotFound
	}
	return &a, err
}

func (r *ApplicationRepo) GetByUserID(ctx context.Context, userID uuid.UUID) ([]domain.Application, error) {
	q := `SELECT a.id, a.user_id, a.job_id, a.status, a.note, a.applied_at, a.updated_at,
	             j.id, j.title, j.company, j.skills, j.is_remote, j.location, j.url
	      FROM applications a
	      JOIN jobs j ON j.id = a.job_id
	      WHERE a.user_id = $1
	      ORDER BY a.updated_at DESC`

	rows, err := r.db.Query(ctx, q, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var apps []domain.Application
	for rows.Next() {
		var a domain.Application
		var j domain.Job
		err := rows.Scan(
			&a.ID, &a.UserID, &a.JobID, &a.Status, &a.Note, &a.AppliedAt, &a.UpdatedAt,
			&j.ID, &j.Title, &j.Company, &j.Skills, &j.IsRemote, &j.Location, &j.URL,
		)
		if err != nil {
			return nil, err
		}
		a.Job = &j
		apps = append(apps, a)
	}
	return apps, nil
}

func (r *ApplicationRepo) UpdateStatus(ctx context.Context, id uuid.UUID, status domain.ApplicationStatus) error {
	q := `UPDATE applications SET status=$1, updated_at=NOW() WHERE id=$2`
	_, err := r.db.Exec(ctx, q, status, id)
	return err
}

func (r *ApplicationRepo) Delete(ctx context.Context, id uuid.UUID) error {
	_, err := r.db.Exec(ctx, `DELETE FROM applications WHERE id=$1`, id)
	return err
}
