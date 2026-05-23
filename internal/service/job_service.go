package service

import (
	"context"
	"fmt"
	"log/slog"
	"strings"
	"time"

	"github.com/abzalserikbay/jobify/internal/domain"
	"github.com/abzalserikbay/jobify/internal/repository"
	rediscache "github.com/abzalserikbay/jobify/internal/repository/redis"
	"github.com/google/uuid"
)

type JobService struct {
	jobRepo repository.JobRepository
	cache   *rediscache.JobCache
}

func NewJobService(jobRepo repository.JobRepository, cache *rediscache.JobCache) *JobService {
	return &JobService{jobRepo: jobRepo, cache: cache}
}

func (s *JobService) Create(ctx context.Context, j *domain.Job) error {
	j.ID = uuid.New()
	j.Source = "manual"
	j.IsActive = true
	if err := s.jobRepo.Create(ctx, j); err != nil {
		return err
	}
	s.invalidateJobCache(ctx)
	return nil
}

func (s *JobService) GetByID(ctx context.Context, id uuid.UUID, userSkills []string) (*domain.JobWithMatch, error) {
	job, err := s.jobRepo.GetByID(ctx, id)
	if err != nil {
		return nil, err
	}

	go func() {
		bgCtx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
		defer cancel()
		if err := s.jobRepo.IncrementViews(bgCtx, id); err != nil {
			slog.Error("increment views failed", "job_id", id, "err", err)
		}
	}()

	percent, matched, missing := CalculateMatch(userSkills, job.Skills)
	return &domain.JobWithMatch{
		Job:           *job,
		MatchPercent:  percent,
		MatchedSkills: matched,
		MissingSkills: missing,
	}, nil
}

// cachedJobList bundles a job-list page with its board-wide total so a cache
// hit can report the real total instead of just the current page size.
type cachedJobList struct {
	Jobs  []domain.Job `json:"jobs"`
	Total int          `json:"total"`
}

func (s *JobService) List(ctx context.Context, f repository.JobFilter) ([]domain.Job, int, error) {
	cacheKey := buildCacheKey(f)

	var cached cachedJobList
	if err := s.cache.Get(ctx, cacheKey, &cached); err == nil {
		return cached.Jobs, cached.Total, nil
	}

	jobs, total, err := s.jobRepo.List(ctx, f)
	if err != nil {
		return nil, 0, err
	}

	_ = s.cache.Set(ctx, cacheKey, cachedJobList{Jobs: jobs, Total: total})
	return jobs, total, nil
}

func (s *JobService) Update(ctx context.Context, j *domain.Job) error {
	if err := s.jobRepo.Update(ctx, j); err != nil {
		return err
	}
	s.invalidateJobCache(ctx)
	return nil
}

func (s *JobService) Delete(ctx context.Context, id uuid.UUID) error {
	if err := s.jobRepo.Delete(ctx, id); err != nil {
		return err
	}
	s.invalidateJobCache(ctx)
	return nil
}

// invalidateJobCache clears cached job-list pages after a write. A cache
// failure must not fail the write itself, so the error is logged, not returned.
func (s *JobService) invalidateJobCache(ctx context.Context) {
	if err := s.cache.Invalidate(ctx); err != nil {
		slog.Error("job cache invalidation failed", "err", err)
	}
}

func CalculateMatch(userSkills, jobSkills []string) (percent int, matched, missing []string) {
	userSet := make(map[string]bool)
	for _, s := range userSkills {
		userSet[strings.ToLower(s)] = true
	}

	jobSet := make(map[string]bool)
	for _, s := range jobSkills {
		jobSet[strings.ToLower(s)] = true
	}

	for skill := range jobSet {
		if userSet[skill] {
			matched = append(matched, skill)
		} else {
			missing = append(missing, skill)
		}
	}

	union := len(userSet) + len(jobSet) - len(matched)
	if union == 0 {
		return 0, nil, nil
	}
	percent = int(float64(len(matched)) / float64(union) * 100)
	return
}

func buildCacheKey(f repository.JobFilter) string {
	remote := "nil"
	if f.Remote != nil {
		remote = fmt.Sprintf("%v", *f.Remote)
	}
	salMin := "nil"
	if f.SalaryMin != nil {
		salMin = fmt.Sprintf("%d", *f.SalaryMin)
	}
	salMax := "nil"
	if f.SalaryMax != nil {
		salMax = fmt.Sprintf("%d", *f.SalaryMax)
	}
	return fmt.Sprintf("jobs:skills=%s:remote=%s:salmin=%s:salmax=%s:page=%d:limit=%d",
		strings.Join(f.Skills, ","), remote, salMin, salMax, f.Page, f.Limit)
}
