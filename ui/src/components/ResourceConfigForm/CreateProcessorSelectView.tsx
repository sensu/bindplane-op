import { gql } from "@apollo/client";
import { Box, Button, CircularProgress } from "@mui/material";
import { useSnackbar } from "notistack";
import { useEffect, useMemo, useState } from "react";
import { ButtonFooter, FormTitle, ProcessorType } from ".";
import { useGetProcessorTypesQuery } from "../../graphql/generated";
import { metadataSatisfiesSubstring } from "../../utils/metadata-satisfies-substring";
import {
  ResourceTypeButton,
  ResourceTypeButtonContainer,
} from "../ResourceTypeButton";

gql`
  query getProcessorTypes {
    processorTypes {
      metadata {
        displayName
        description
        name
      }
      spec {
        parameters {
          label
          name
          description
          required
          type
          default
          relevantIf {
            name
            operator
            value
          }
          validValues
          options {
            creatable
            trackUnchecked
          }
          documentation {
            text
            url
          }
        }
        telemetryTypes
      }
    }
  }
`;

interface CreateProcessorSelectViewProps {
  title: string;
  telemetryTypes?: string[];
  onBack: () => void;
  onSelect: (pt: ProcessorType) => void;
}

export const CreateProcessorSelectView: React.FC<CreateProcessorSelectViewProps> =
  ({ title, onBack, onSelect, telemetryTypes }) => {
    const { data, loading, error } = useGetProcessorTypesQuery();
    const [search, setSearch] = useState("");
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
      if (error != null) {
        enqueueSnackbar("Error retrieving data for Processor Type.", {
          variant: "error",
          key: "Error retrieving data for Processor Type.",
        });
      }
    }, [enqueueSnackbar, error]);

    const backButton: JSX.Element = (
      <Button variant="contained" color="secondary" onClick={onBack}>
        Back
      </Button>
    );

    // Filter the list of supported processor types down
    // to those whose telemetry matches the telemetry of the
    // source. i.e. don't show a log processor for a metric source
    const supportedProcessorTypes = useMemo(
      () =>
        telemetryTypes
          ? data?.processorTypes.filter((pt) =>
              pt.spec.telemetryTypes.some((t) => telemetryTypes.includes(t))
            ) ?? []
          : data?.processorTypes ?? [],
      [data?.processorTypes, telemetryTypes]
    );

    return (
      <>
        <FormTitle
          title={title}
          crumbs={["Add a processor"]}
          description={"Select a processor type to configure."}
        />

        <ResourceTypeButtonContainer
          onSearchChange={(v: string) => setSearch(v)}
          placeholder={"Search for a processor..."}
        >
          {loading && (
            <Box display="flex" justifyContent={"center"} marginTop={2}>
              <CircularProgress />
            </Box>
          )}
          {supportedProcessorTypes
            .filter((pt) => metadataSatisfiesSubstring(pt, search))
            .map((p) => (
              <ResourceTypeButton
                hideIcon
                key={`${p.metadata.name}`}
                displayName={p.metadata.displayName!}
                onSelect={() => {
                  onSelect(p);
                }}
                telemetryTypes={p.spec.telemetryTypes}
              />
            ))}
        </ResourceTypeButtonContainer>
        <ButtonFooter
          primaryButton={<></>}
          secondaryButton={<></>}
          backButton={backButton}
        />
      </>
    );
  };
