import { useSnackbar } from "notistack";
import { useEffect } from "react";
import { FormValues, ResourceConfigForm } from ".";
import {
  ResourceConfiguration,
  useGetProcessorTypeQuery,
} from "../../graphql/generated";
import { FormTitle } from "./FormTitle";

interface EditProcessorViewProps {
  title: string;
  processors: ResourceConfiguration[];
  editingIndex: number;
  onEditProcessorSave: (values: FormValues) => void;
  onBack: () => void;
  onRemove: (removeIndex: number) => void;
}

export const EditProcessorView: React.FC<EditProcessorViewProps> = ({
  title,
  processors,
  editingIndex,
  onEditProcessorSave,
  onBack,
  onRemove,
}) => {
  // Get the processor type
  const type = processors[editingIndex].type;

  const { data, error } = useGetProcessorTypeQuery({
    variables: { type: type ?? "" },
  });

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (error != null) {
      console.error(error);
      enqueueSnackbar("Error retrieving Processor Type", {
        variant: "error",
        key: "Error retrieving Processor Type",
      });
    }
  }, [enqueueSnackbar, error]);

  return (
    <>
      <FormTitle title={title} crumbs={["Edit Processor"]} />
      <ResourceConfigForm
        title={data?.processorType?.metadata.displayName ?? ""}
        description={data?.processorType?.metadata.description ?? ""}
        kind={"processor"}
        parameterDefinitions={data?.processorType?.spec.parameters ?? []}
        parameters={processors[editingIndex].parameters}
        onSave={onEditProcessorSave}
        onBack={onBack}
        onDelete={() => onRemove(editingIndex)}
      />
    </>
  );
};
