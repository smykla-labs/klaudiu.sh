package redirect_test

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/smykla-labs/klaudiu.sh/internal/redirect"
)

func TestHandler(t *testing.T) {
	t.Parallel()

	tests := []struct {
		name           string
		path           string
		expectedStatus int
		expectedURL    string
	}{
		{
			name:           "root redirects to home",
			path:           "/",
			expectedStatus: http.StatusFound,
			expectedURL:    redirect.HomeURL,
		},
		{
			name:           "GIT001 redirects to docs",
			path:           "/GIT001",
			expectedStatus: http.StatusFound,
			expectedURL:    redirect.GitHubDocsBase + "/GIT001.md",
		},
		{
			name:           "git001 lowercase redirects to docs",
			path:           "/git001",
			expectedStatus: http.StatusFound,
			expectedURL:    redirect.GitHubDocsBase + "/GIT001.md",
		},
		{
			name:           "FILE001 redirects to docs",
			path:           "/FILE001",
			expectedStatus: http.StatusFound,
			expectedURL:    redirect.GitHubDocsBase + "/FILE001.md",
		},
		{
			name:           "SEC001 redirects to docs",
			path:           "/SEC001",
			expectedStatus: http.StatusFound,
			expectedURL:    redirect.GitHubDocsBase + "/SEC001.md",
		},
		{
			name:           "GIT016 highest git code redirects",
			path:           "/GIT016",
			expectedStatus: http.StatusFound,
			expectedURL:    redirect.GitHubDocsBase + "/GIT016.md",
		},
		{
			name:           "invalid code returns 404",
			path:           "/INVALID001",
			expectedStatus: http.StatusNotFound,
			expectedURL:    "",
		},
		{
			name:           "partial code returns 404",
			path:           "/GIT",
			expectedStatus: http.StatusNotFound,
			expectedURL:    "",
		},
		{
			name:           "random path returns 404",
			path:           "/random/path",
			expectedStatus: http.StatusNotFound,
			expectedURL:    "",
		},
		{
			name:           "GIT1 too few digits returns 404",
			path:           "/GIT1",
			expectedStatus: http.StatusNotFound,
			expectedURL:    "",
		},
		{
			name:           "GIT1234 too many digits returns 404",
			path:           "/GIT1234",
			expectedStatus: http.StatusNotFound,
			expectedURL:    "",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			t.Parallel()

			req := httptest.NewRequest(http.MethodGet, tt.path, nil)
			rec := httptest.NewRecorder()

			redirect.Handler(rec, req)

			if rec.Code != tt.expectedStatus {
				t.Errorf("expected status %d, got %d", tt.expectedStatus, rec.Code)
			}

			if tt.expectedURL != "" {
				location := rec.Header().Get("Location")
				if location != tt.expectedURL {
					t.Errorf("expected redirect to %s, got %s", tt.expectedURL, location)
				}
			}
		})
	}
}
