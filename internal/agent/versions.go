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

package agent

import (
	"fmt"
	"time"

	"github.com/observiq/bindplane-op/internal/store"
	"github.com/observiq/bindplane-op/internal/util"
	"github.com/observiq/bindplane-op/model"
	"go.uber.org/zap"
)

const (
	// VersionLatest can be used in requests instead of an actual version
	VersionLatest = "latest"
)

// Versions manages versions of agents that are used during install and upgrade. The versions are stored in the Store as
// agent-version resources, but Versions provides quick access to the latest version.
type Versions interface {
	LatestVersionString() string
	LatestVersion() (*model.AgentVersion, error)
	Version(version string) (*model.AgentVersion, error)

	SyncVersion(version string) (*model.AgentVersion, error)
	SyncVersions() ([]*model.AgentVersion, error)
}

// VersionsSettings TODO(doc)
type VersionsSettings struct {
	Logger *zap.Logger
}

// The latest version cache is handled separately from the version cache because it just keeps the latest version in
// memory whether it was read from the filesystem cache or the agents client.
const (
	latestVersionCacheDuration = 1 * time.Minute
)

type versions struct {
	client        Client
	store         store.Store
	latestVersion util.Remember[model.AgentVersion]
	logger        *zap.Logger
}

var _ Versions = (*versions)(nil)

// NewVersions creates an implementation of Versions using the specified client, cache, and settings. To disable
// caching, pass nil for the Cache.
func NewVersions(client Client, store store.Store, settings VersionsSettings) Versions {
	return &versions{
		client:        client,
		store:         store,
		latestVersion: util.NewRemember[model.AgentVersion](latestVersionCacheDuration),
		logger:        settings.Logger,
	}
}

func (v *versions) LatestVersionString() string {
	version, err := v.LatestVersion()
	if err != nil {
		return ""
	}
	return version.Version()
}

// LatestVersion returns the latest *model.AgentVersion.
func (v *versions) LatestVersion() (*model.AgentVersion, error) {
	// check if we have a remembered result
	if remembered := v.latestVersion.Get(); remembered != nil {
		return remembered, nil
	}

	// find the latest public version
	agentVersions, err := v.store.AgentVersions()
	if err != nil {
		return nil, err
	}
	model.SortAgentVersionsLatestFirst(agentVersions)

	var found *model.AgentVersion
	for _, agentVersion := range agentVersions {
		if agentVersion.Public() {
			found = agentVersion
			break
		}
	}

	// cache it before returning
	if found != nil {
		v.latestVersion.Update(found)
	}

	return found, nil
}

// Version returns the specified agent version. If the version is invalid or does not exist, it returns an error. If
// version is "latest", it returns the latest version.
func (v *versions) Version(version string) (*model.AgentVersion, error) {
	if version == VersionLatest {
		return v.LatestVersion()
	}

	name := fmt.Sprintf("%s-%s", model.AgentTypeNameObservIQOtelCollector, version)

	found, err := v.store.AgentVersion(name)
	if err != nil {
		return nil, err
	}

	return found, nil
}

func (v *versions) SyncVersion(version string) (*model.AgentVersion, error) {
	if v.client == nil {
		return nil, fmt.Errorf("unable to sync versions: server is running in offline mode")
	}
	return v.client.Version(version)
}

func (v *versions) SyncVersions() ([]*model.AgentVersion, error) {
	if v.client == nil {
		return nil, fmt.Errorf("unable to sync versions: server is running in offline mode")
	}
	return v.client.Versions()
}
