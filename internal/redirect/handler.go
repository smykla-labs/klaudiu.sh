// Package redirect provides HTTP handlers for the klaudiu.sh redirect service.
package redirect

import (
	"net/http"
	"regexp"
	"strings"
)

const (
	// GitHubDocsBase is the base URL for klaudiush error documentation on GitHub.
	GitHubDocsBase = "https://github.com/smykla-labs/klaudiush/blob/main/docs/errors"

	// HomeURL is the URL for the klaudiush project home page.
	HomeURL = "https://github.com/smykla-labs/klaudiush"
)

var errorCodePattern = regexp.MustCompile(`^(GIT|FILE|SEC)\d{3}$`)

// Handler handles HTTP requests and redirects error codes to documentation.
func Handler(w http.ResponseWriter, r *http.Request) {
	path := strings.TrimPrefix(r.URL.Path, "/")

	if path == "" {
		http.Redirect(w, r, HomeURL, http.StatusFound)

		return
	}

	code := strings.ToUpper(path)
	if errorCodePattern.MatchString(code) {
		target := GitHubDocsBase + "/" + code + ".md"
		http.Redirect(w, r, target, http.StatusFound)

		return
	}

	http.NotFound(w, r)
}
