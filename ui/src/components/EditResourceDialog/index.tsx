import { Dialog, DialogContent, DialogProps } from "@mui/material";
import {
  Maybe,
  Parameter,
  ParameterDefinition,
  PipelineType,
  ResourceConfiguration,
} from "../../graphql/generated";
import { ResourceConfigForm } from "../ResourceConfigForm";

interface EditResourceBaseProps extends DialogProps {
  onSave: (values: { [key: string]: any }) => void;
  onDelete?: () => void;
  onCancel: () => void;
  parameters: Parameter[];
  parameterDefinitions: ParameterDefinition[];
  processors?: Maybe<ResourceConfiguration[]>;
  telemetryTypes?: PipelineType[];
  enableProcessors?: boolean;
  title: string;
  description: string;
  includeNameField?: boolean;
  kind: "source" | "destination";
}

export const EditResourceDialog: React.FC<EditResourceBaseProps> = ({
  onSave,
  onDelete,
  onCancel,
  parameters,
  processors,
  enableProcessors,
  title,
  telemetryTypes,
  parameterDefinitions,
  description,
  kind,
  includeNameField = false,
  ...dialogProps
}) => {
  return (
    <Dialog {...dialogProps} onClose={onCancel}>
      <DialogContent>
        <ResourceConfigForm
          telemetryTypes={telemetryTypes}
          includeNameField={includeNameField}
          title={title}
          description={description}
          kind={kind}
          parameterDefinitions={parameterDefinitions}
          parameters={parameters}
          processors={processors}
          enableProcessors={enableProcessors}
          onSave={onSave}
          onDelete={onDelete}
          onBack={onCancel}
        />
      </DialogContent>
    </Dialog>
  );
};
