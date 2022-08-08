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

package sync

import (
	"fmt"

	"github.com/spf13/cobra"

	"github.com/observiq/bindplane-op/internal/cli"
	"github.com/observiq/bindplane-op/model"
)

var (
	versionFlag string
	allFlag     bool
)

// AgentVersionCommand returns the iris sync agent-version cobra command
func AgentVersionCommand(bindplane *cli.BindPlane) *cobra.Command {
	cmd := &cobra.Command{
		Use:     "agent-version",
		Aliases: []string{"agent-versions"},
		Short:   "Sync an agent-version from github releases",
		Long:    `An agent-version identifies the release assets for a version of the agent.`,
		RunE: func(cmd *cobra.Command, args []string) error {
			c, err := bindplane.Client()
			if err != nil {
				return fmt.Errorf("error creating client: %w", err)
			}

			version := versionFlag
			if allFlag {
				version = ""
			}

			resourceStatuses, err := c.SyncAgentVersions(cmd.Context(), version)
			if err != nil {
				return err
			}

			model.PrintResourceUpdates(cmd.OutOrStdout(), resourceStatuses)
			return nil
		},
	}

	cmd.Flags().StringVar(&versionFlag, "version", "latest", "version of the agent to sync from github")
	cmd.Flags().BoolVar(&allFlag, "all", false, "sync all versions (>= v1.6.0)")

	return cmd
}
