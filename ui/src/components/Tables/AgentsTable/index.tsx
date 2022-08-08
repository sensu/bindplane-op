import { gql } from "@apollo/client";
import { debounce, isFunction } from "lodash";
import { memo, useEffect, useMemo, useState } from "react";
import {
  Agent,
  AgentChangesDocument,
  AgentChangesSubscription,
  Suggestion,
  useAgentsTableQuery,
} from "../../../graphql/generated";
import { SearchBar } from "../../SearchBar";
import { AgentsDataGrid, AgentsTableField } from "./AgentsDataGrid";
import {
  GridDensityTypes,
  GridRowParams,
  GridSelectionModel,
} from "@mui/x-data-grid";
import { mergeAgents } from "./merge-agents";
import { AgentStatus } from "../../../types/agents";

gql`
  query AgentsTable($selector: String, $query: String) {
    agents(selector: $selector, query: $query) {
      agents {
        id
        architecture
        hostName
        labels
        platform
        version

        name
        home
        operatingSystem
        macAddress

        type
        status

        connectedAt
        disconnectedAt

        configurationResource {
          apiVersion
          kind
          metadata {
            id
            name
          }
          spec {
            contentType
          }
        }
      }

      query

      suggestions {
        query
        label
      }
      latestVersion
    }
  }
`;

interface Props {
  onAgentsSelected?: (agentIds: GridSelectionModel) => void;
  onDeletableAgentsSelected?: (agentIds: GridSelectionModel) => void;
  onUpdatableAgentsSelected?: (agentIds: GridSelectionModel) => void;
  isRowSelectable?: (params: GridRowParams<Agent>) => boolean;
  clearSelectionModelFnRef?: React.MutableRefObject<(() => void) | null>;
  selector?: string;
  minHeight?: string;
  columnFields?: AgentsTableField[];
  density?: GridDensityTypes;
  initQuery?: string;
}

const AgentsTableComponent: React.FC<Props> = ({
  onAgentsSelected,
  onDeletableAgentsSelected,
  onUpdatableAgentsSelected,
  isRowSelectable,
  clearSelectionModelFnRef,
  selector,
  minHeight,
  columnFields,
  density = GridDensityTypes.Standard,
  initQuery = "",
}) => {
  const { data, loading, refetch, subscribeToMore } = useAgentsTableQuery({
    variables: { selector, query: initQuery },
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-only",
  });

  const [agents, setAgents] = useState<Agent[]>([]);
  const [subQuery, setSubQuery] = useState<string>(initQuery);

  const debouncedRefetch = useMemo(() => debounce(refetch, 100), [refetch]);

  const filterOptions: Suggestion[] = [
    { label: "Disconnected agents", query: "status:disconnected" },
    { label: "Outdated agents", query: "-version:latest" },
    { label: "No managed configuration", query: "-configuration:" },
  ];

  useEffect(() => {
    if (data?.agents.agents != null) {
      setAgents(data.agents.agents);
    }
  }, [data?.agents.agents, setAgents]);

  useEffect(() => {
    subscribeToMore({
      document: AgentChangesDocument,
      variables: { query: subQuery, selector },
      updateQuery: (prev, { subscriptionData, variables }) => {
        if (
          subscriptionData == null ||
          variables?.query !== subQuery ||
          variables.selector !== selector
        ) {
          return prev;
        }

        const { data } = subscriptionData as unknown as {
          data: AgentChangesSubscription;
        };

        return {
          agents: {
            __typename: "Agents",
            suggestions: prev.agents.suggestions,
            query: prev.agents.query,
            latestVersion: prev.agents.latestVersion,
            agents: mergeAgents(prev.agents.agents, data.agentChanges),
          },
        };
      },
    });
  }, [selector, subQuery, subscribeToMore]);

  function handleAgentSelected(agentIds: GridSelectionModel) {
    if (isFunction(onAgentsSelected)) {
      onAgentsSelected(agentIds);
    }

    if (isFunction(onDeletableAgentsSelected)) {
      const deletable = agentIds.filter((id) =>
        isDeletable(agents, id as string)
      );
      onDeletableAgentsSelected(deletable);
    }

    if (isFunction(onUpdatableAgentsSelected)) {
      const updatable = agentIds.filter((id) =>
        isUpdatable(agents, id as string, data?.agents.latestVersion)
      );
      onUpdatableAgentsSelected(updatable);
    }
  }

  function onQueryChange(query: string) {
    debouncedRefetch({ selector, query });
    setSubQuery(query);
  }

  const allowSelection =
    isFunction(onAgentsSelected) ||
    isFunction(onDeletableAgentsSelected) ||
    isFunction(onUpdatableAgentsSelected);

  return (
    <>
      <SearchBar
        filterOptions={filterOptions}
        suggestions={data?.agents.suggestions}
        onQueryChange={onQueryChange}
        suggestionQuery={data?.agents.query}
        initialQuery={initQuery}
      />

      <AgentsDataGrid
        clearSelectionModelFnRef={clearSelectionModelFnRef}
        isRowSelectable={isRowSelectable}
        onAgentsSelected={allowSelection ? handleAgentSelected : undefined}
        density={density}
        minHeight={minHeight}
        loading={loading}
        agents={agents}
        columnFields={columnFields}
      />
    </>
  );
};

function isDeletable(agents: Agent[], id: string): boolean {
  return agents.some(
    (a) => a.id === id && a.status === AgentStatus.DISCONNECTED
  );
}
function isUpdatable(
  agents: Agent[],
  id: string,
  latestVersion?: string
): boolean {
  return agents.some(
    (a) =>
      a.id === id &&
      a.status === AgentStatus.CONNECTED &&
      a.version !== latestVersion
  );
}

export const AgentsTable = memo(AgentsTableComponent);
