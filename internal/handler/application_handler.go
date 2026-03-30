package handler

import (
	"errors"
	"net/http"

	"github.com/abzalserikbay/jobify/internal/domain"
	"github.com/abzalserikbay/jobify/internal/service"
	"github.com/abzalserikbay/jobify/pkg/response"
	"github.com/abzalserikbay/jobify/pkg/validator"
	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
)

type ApplicationHandler struct {
	svc *service.ApplicationService
}

func NewApplicationHandler(svc *service.ApplicationService) *ApplicationHandler {
	return &ApplicationHandler{svc: svc}
}

func (h *ApplicationHandler) List(w http.ResponseWriter, r *http.Request) {
	userID, err := userIDFromCtx(r)
	if err != nil {
		response.Error(w, http.StatusUnauthorized, "unauthorized")
		return
	}

	apps, err := h.svc.List(r.Context(), userID)
	if err != nil {
		response.Error(w, http.StatusInternalServerError, "failed to list applications")
		return
	}

	response.JSON(w, http.StatusOK, apps)
}

type createAppRequest struct {
	JobID string `json:"job_id"`
	Note  string `json:"note"`
}

func (h *ApplicationHandler) Create(w http.ResponseWriter, r *http.Request) {
	userID, err := userIDFromCtx(r)
	if err != nil {
		response.Error(w, http.StatusUnauthorized, "unauthorized")
		return
	}

	var req createAppRequest
	if err := validator.Decode(r, &req); err != nil {
		response.Error(w, http.StatusBadRequest, err.Error())
		return
	}

	jobID, err := uuid.Parse(req.JobID)
	if err != nil {
		response.Error(w, http.StatusBadRequest, "invalid job_id")
		return
	}

	app, err := h.svc.Create(r.Context(), userID, jobID, req.Note)
	if err != nil {
		response.Error(w, http.StatusInternalServerError, "failed to create application")
		return
	}

	response.JSON(w, http.StatusCreated, app)
}

type updateStatusRequest struct {
	Status domain.ApplicationStatus `json:"status"`
}

func (h *ApplicationHandler) UpdateStatus(w http.ResponseWriter, r *http.Request) {
	userID, err := userIDFromCtx(r)
	if err != nil {
		response.Error(w, http.StatusUnauthorized, "unauthorized")
		return
	}

	id, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		response.Error(w, http.StatusBadRequest, "invalid application id")
		return
	}

	var req updateStatusRequest
	if err := validator.Decode(r, &req); err != nil {
		response.Error(w, http.StatusBadRequest, err.Error())
		return
	}

	if err := h.svc.UpdateStatus(r.Context(), id, userID, req.Status); errors.Is(err, domain.ErrForbidden) {
		response.Error(w, http.StatusForbidden, "forbidden")
		return
	} else if errors.Is(err, domain.ErrInvalidInput) {
		response.Error(w, http.StatusBadRequest, "invalid status")
		return
	} else if err != nil {
		response.Error(w, http.StatusInternalServerError, "failed to update status")
		return
	}

	response.JSON(w, http.StatusOK, map[string]string{"status": string(req.Status)})
}

func (h *ApplicationHandler) Delete(w http.ResponseWriter, r *http.Request) {
	userID, err := userIDFromCtx(r)
	if err != nil {
		response.Error(w, http.StatusUnauthorized, "unauthorized")
		return
	}

	id, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		response.Error(w, http.StatusBadRequest, "invalid application id")
		return
	}

	if err := h.svc.Delete(r.Context(), id, userID); errors.Is(err, domain.ErrForbidden) {
		response.Error(w, http.StatusForbidden, "forbidden")
		return
	} else if errors.Is(err, domain.ErrNotFound) {
		response.Error(w, http.StatusNotFound, "application not found")
		return
	} else if err != nil {
		response.Error(w, http.StatusInternalServerError, "failed to delete application")
		return
	}

	response.JSON(w, http.StatusOK, map[string]string{"message": "deleted"})
}
