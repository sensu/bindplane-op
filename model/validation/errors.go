// Copyright  observIQ, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package validation

import (
	"fmt"
	"strings"

	"github.com/hashicorp/go-multierror"
)

// Errors provides an ErrorReporter to accumulate errors.
type Errors interface {
	// Add adds an error to the set of errors accumulated by Errors. If err is nil, this does nothing.
	Add(err error)

	// Warn adds an error to a separate set of Errors that are only warnings. These warnings should not prevent validation
	// from passing, but should be presented to the user.
	Warn(err error)

	// Result returns an error containing all of the errors accumulated or nil if there were no errors
	Result() error

	// Warnings returns a string representing all of the warning messages accumulated or "" if there were no warnings
	Warnings() string
}

type errorsImpl struct {
	errors   error
	warnings *multierror.Error
}

var _ Errors = (*errorsImpl)(nil)

// NewErrors creates new validation errors and returns the reporter as a convenience
func NewErrors() Errors {
	return &errorsImpl{
		warnings: &multierror.Error{
			ErrorFormat: WarningFormatFunc,
		},
	}
}

func (v *errorsImpl) Add(err error) {
	if err != nil {
		v.errors = multierror.Append(v.errors, err)
	}
}

func (v *errorsImpl) Warn(err error) {
	if err != nil {
		v.warnings = multierror.Append(v.warnings, err)
	}
}

func (v *errorsImpl) Result() error {
	return v.errors
}

func (v *errorsImpl) Warnings() string {
	if v.warnings != nil {
		return v.warnings.Error()
	}
	return ""
}

// WarningFormatFunc is like the standard FormatFunc but labels issues as "warnings" instead of "errors".
func WarningFormatFunc(es []error) string {
	switch len(es) {
	case 0:
		return ""
	case 1:
		return fmt.Sprintf("1 warning occurred:\n\t* %s\n\n", es[0])
	default:
		points := make([]string, len(es))
		for i, err := range es {
			points[i] = fmt.Sprintf("* %s", err)
		}
		return fmt.Sprintf("%d warnings occurred:\n\t%s\n\n", len(es), strings.Join(points, "\n\t"))
	}
}
