import {
  Alert,
  AlertTitle,
  Button,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import React from "react";
import { GetAgentAndConfigurationsQuery } from "../../../graphql/generated";
import { AgentStatus } from "../../../types/agents";
import {
  renderAgentDate,
  renderAgentLabels,
  renderAgentStatus,
} from "../utils";
import { classes } from "../../../utils/styles";
import { ArrowUpIcon } from "../../Icons";

import styles from "./agent-table.module.scss";
import mixins from "../../../styles/mixins.module.scss";
import { upgradeAgent } from '../../../utils/rest/upgrade-agent';

type AgentTableAgent = NonNullable<GetAgentAndConfigurationsQuery["agent"]>;
interface AgentTableProps {
  agent: AgentTableAgent;
}

export const AgentTable: React.FC<AgentTableProps> = ({ agent }) => {
  function renderTable(agent: AgentTableAgent): JSX.Element {
    const { status, labels, connectedAt, disconnectedAt } = agent;

    const labelsEl = renderAgentLabels(labels);
    const statusEl = renderAgentStatus(status);



    function renderConnectedAtRow(): JSX.Element {
      if (status === AgentStatus.CONNECTED) {
        const connectedEl = renderAgentDate(connectedAt);
        return renderRow("Connected", connectedEl);
      }

      const disconnectedEl = renderAgentDate(disconnectedAt);
      return renderRow("Disconnected", disconnectedEl);
    }

    return (
      <Table size="small" classes={{ root: styles.table }}>
        <TableBody>
          {renderRow("Status", statusEl)}
          {renderRow("Labels", labelsEl)}
          {renderConnectedAtRow()}
          {renderVersionRow("Version", agent)}
          {renderRow("Host Name", <>{agent.hostName}</>)}
          {renderRow("Remote Address", <>{agent.remoteAddress}</>)}
          {renderRow("MAC Address", <>{agent.macAddress}</>)}
          {renderRow("Operating System", <>{agent.operatingSystem}</>)}
          {renderRow("Platform", <>{agent.platform}</>)}
          {renderRow("Architecture", <>{agent.architecture}</>)}
          {renderRow("Home", <>{agent.home}</>)}
          {renderRow("Agent ID", <>{agent.id}</>)}
        </TableBody>
      </Table>
    );
  }
  return <>{agent == null ? null : renderTable(agent)}</>;
};

function renderVersionRow(key: string, agent: AgentTableAgent): JSX.Element {
  const upgradeError = agent.upgrade?.error;


  async function handleUpgrade() {
    if (!agent.upgradeAvailable) {
      return
    }

    try {

      await upgradeAgent(agent.id, agent.upgradeAvailable)
    } catch (err) {
      console.error(err)

    }
  }

  return (
    <>
      <TableRow>
        <TableCell
          classes={{ root: styles["key-column"] }}
          sx={{
            borderBottom: upgradeError ? "none" : undefined,
          }}
        >
          <Typography variant="overline">{key}</Typography>
        </TableCell>
        <TableCell
          sx={{
            borderBottom: upgradeError ? "none" : undefined,
          }}
        >
          <>{agent.version}</>
          {agent.upgradeAvailable && agent.status !== AgentStatus.DISCONNECTED && (
            <Button
              endIcon={<ArrowUpIcon />}
              size="small"
              classes={{ root: mixins["ml-2"] }}
              variant="outlined"
              disabled={agent.status === AgentStatus.UPGRADING}
              onClick={() => handleUpgrade()}
            >
              Upgrade to {agent.upgradeAvailable}
            </Button>
          )}
        </TableCell>
      </TableRow>

      {upgradeError && (
        <TableRow>
          <TableCell colSpan={2}>
            <Alert
              severity="error"
              classes={{ root: classes([mixins["mt-3"], mixins["mb-3"]]) }}
            >
              <AlertTitle>Upgrade Error</AlertTitle>
              {agent.upgrade?.error}
            </Alert>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

function renderRow(key: string, value: JSX.Element): JSX.Element {
  return (
    <TableRow>
      <TableCell classes={{ root: styles["key-column"] }}>
        <Typography variant="overline">{key}</Typography>
      </TableCell>
      <TableCell>{value}</TableCell>
    </TableRow>
  );
}
