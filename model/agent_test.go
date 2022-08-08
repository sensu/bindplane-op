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

package model

import (
	"testing"

	"github.com/stretchr/testify/require"
)

func TestAgentApplyLabels(t *testing.T) {
	agent := Agent{}

	tests := []struct {
		selector string
		success  bool
		expect   Labels
	}{
		{
			selector: "app=mindplane",
			success:  true,
			expect: LabelsFromValidatedMap(map[string]string{
				"app": "mindplane",
			}),
		},
		{
			selector: "app=mindplane,env=production",
			success:  true,
			expect: LabelsFromValidatedMap(map[string]string{
				"app": "mindplane",
				"env": "production",
			}),
		},
		{
			selector: "app=mindplane, env = production",
			success:  true,
			expect: LabelsFromValidatedMap(map[string]string{
				"app": "mindplane",
				"env": "production",
			}),
		},
		{
			selector: "app=====",
			success:  false,
		},
	}

	for _, test := range tests {
		t.Run(test.selector, func(t *testing.T) {
			labels, err := LabelsFromSelector(test.selector)
			agent.Labels = labels
			if test.success {
				require.NoError(t, err)
				require.Equal(t, test.expect, agent.Labels)
			} else {
				require.Error(t, err)
			}
		})
	}
}

func TestAgentMatchesSelector(t *testing.T) {
	tests := []struct {
		labels   map[string]string
		selector string
		matches  bool
	}{
		{
			labels: map[string]string{
				"app":     "mindplane",
				"os":      "Darwin",
				"version": "2.0.6",
			},
			selector: "app=mindplane",
			matches:  true,
		},
		{
			labels: map[string]string{
				"app":     "mindplane",
				"os":      "Darwin",
				"version": "2.0.6",
			},
			selector: "app=mindplane,version=2",
			matches:  false,
		},
		{
			labels: map[string]string{
				"app":     "mindplane",
				"os":      "Darwin",
				"version": "2.0.6",
			},
			selector: "os=Darwin,app=mindplane",
			matches:  true,
		},
	}
	for _, test := range tests {
		t.Run(test.selector, func(t *testing.T) {
			selector, err := SelectorFromString(test.selector)
			require.NoError(t, err)
			require.Equal(t, test.matches, selector.Matches(LabelsFromValidatedMap(test.labels)))
		})
	}
}

func TestAgentUpgradeComplete(t *testing.T) {
	tests := []struct {
		name          string
		prepareAgent  func(a *Agent)
		errorMessage  string
		expectStatus  AgentStatus
		expectUpgrade *AgentUpgrade
	}{
		{
			name: "success",
			prepareAgent: func(a *Agent) {
				a.UpgradeTo("v1.1")
			},
			errorMessage:  "",
			expectStatus:  Connected,
			expectUpgrade: nil,
		},
		{
			name: "success with existing error",
			prepareAgent: func(a *Agent) {
				a.UpgradeStarted("v1.1", []byte{1})
				a.ErrorMessage = "error"
			},
			errorMessage:  "",
			expectStatus:  Error,
			expectUpgrade: nil,
		},
		{
			name: "fail",
			prepareAgent: func(a *Agent) {
				a.Status = Connected
			},
			errorMessage: "upgrade error",
			expectStatus: Connected,
			expectUpgrade: &AgentUpgrade{
				Status:  UpgradeFailed,
				Version: "v1.2",
				Error:   "upgrade error",
			},
		},
		{
			name: "fail with upgrade",
			prepareAgent: func(a *Agent) {
				a.UpgradeTo("v1.1")
				a.Status = Connected
			},
			errorMessage: "upgrade error",
			expectStatus: Connected,
			expectUpgrade: &AgentUpgrade{
				Status:  UpgradeFailed,
				Version: "v1.2",
				Error:   "upgrade error",
			},
		},
	}
	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			agent := &Agent{}
			test.prepareAgent(agent)
			agent.UpgradeComplete("v1.2", test.errorMessage)
			require.Equal(t, test.expectStatus, agent.Status)
			require.Equal(t, test.expectUpgrade, agent.Upgrade)
		})
	}
}
