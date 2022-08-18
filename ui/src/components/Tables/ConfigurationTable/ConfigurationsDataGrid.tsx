import { Chip, Stack } from "@mui/material";
import {
  DataGrid,
  GridCellParams,
  GridColumns,
  GridDensityTypes,
  GridSelectionModel,
  GridValueGetterParams,
} from "@mui/x-data-grid";
import { isFunction } from "lodash";
import React, { memo } from "react";
import { Link } from "react-router-dom";
import { GetConfigurationTableQuery } from "../../../graphql/generated";

export enum ConfigurationsTableField {
  NAME = "name",
  LABELS = "labels",
  DESCRIPTION = "description",
  AGENT_COUNT = "agentCount",
}

type Configurations =
  GetConfigurationTableQuery["configurations"]["configurations"];
interface ConfigurationsDataGridProps {
  onConfigurationsSelected?: (configurationIds: GridSelectionModel) => void;
  density?: GridDensityTypes;
  loading: boolean;
  configurations?: Configurations;
  columnFields?: ConfigurationsTableField[];
}

const ConfigurationsDataGridComponent: React.FC<ConfigurationsDataGridProps> =
  ({
    onConfigurationsSelected,
    loading,
    configurations,
    columnFields,
    density = GridDensityTypes.Standard,
  }) => {
    console.log({ configurations });
    const columns: GridColumns = (columnFields || []).map((field) => {
      switch (field) {
        case ConfigurationsTableField.AGENT_COUNT:
          return {
            field: ConfigurationsTableField.AGENT_COUNT,
            width: 100,
            headerName: "Agents",
            valueGetter: (params: GridValueGetterParams) =>
              params.row.agentCount,
            renderCell: renderAgentCountCell,
          };

        case ConfigurationsTableField.DESCRIPTION:
          return {
            field: ConfigurationsTableField.DESCRIPTION,
            flex: 1,
            headerName: "Description",
            valueGetter: (params: GridValueGetterParams) =>
              params.row.metadata.description,
          };
        case ConfigurationsTableField.LABELS:
          return {
            field: ConfigurationsTableField.LABELS,
            width: 300,
            headerName: "Labels",
            valueGetter: (params: GridValueGetterParams) =>
              params.row.metadata.labels,
            renderCell: renderLabels,
          };
        default:
          return {
            field: ConfigurationsTableField.NAME,
            headerName: "Name",
            width: 400,
            valueGetter: (params: GridValueGetterParams) =>
              params.row.metadata.name,
            renderCell: renderNameDataCell,
          };
      }
    });

    function handleSelect(s: GridSelectionModel) {
      if (!isFunction(onConfigurationsSelected)) {
        return;
      }

      onConfigurationsSelected(s);
    }

    return (
      <DataGrid
        checkboxSelection={isFunction(onConfigurationsSelected)}
        onSelectionModelChange={handleSelect}
        density={density}
        components={{
          NoRowsOverlay: () => (
            <Stack height="100%" alignItems="center" justifyContent="center">
              No Configurations
            </Stack>
          ),
        }}
        disableSelectionOnClick
        autoHeight
        loading={loading}
        getRowId={(row) => row.metadata.name}
        columns={columns}
        rows={configurations ?? []}
      />
    );
  };

function renderLabels(
  cellParams: GridCellParams<Record<string, string>>
): JSX.Element {
  return (
    <Stack direction="row" spacing={1}>
      {Object.entries(cellParams.value || {}).map(([k, v]) => {
        const formattedLabel = `${k}: ${v}`;
        return <Chip key={k} size="small" label={formattedLabel} />;
      })}
    </Stack>
  );
}

function renderNameDataCell(cellParams: GridCellParams<string>): JSX.Element {
  return (
    <Link to={`/configurations/${cellParams.value}`}>{cellParams.value}</Link>
  );
}

function renderAgentCountCell(
  cellParams: GridCellParams<any, Configurations[0]>
) {
  return <span style={{ margin: "auto" }}>{cellParams.value}</span>;
}

ConfigurationsDataGridComponent.defaultProps = {
  density: undefined,
  columnFields: [
    ConfigurationsTableField.NAME,
    ConfigurationsTableField.LABELS,
    ConfigurationsTableField.AGENT_COUNT,
    ConfigurationsTableField.DESCRIPTION,
  ],
};

export const ConfigurationsDataGrid = memo(ConfigurationsDataGridComponent);
