import { TextField } from "@mui/material";
import { isFunction } from "lodash";
import { ChangeEvent, memo } from "react";
import { validateNameField } from "../../../utils/forms/validate-name-field";
import { useValidationContext } from "../ValidationContext";
import { ParamInputProps } from "./ParameterInput";

interface ResourceNameInputProps
  extends Omit<ParamInputProps<string>, "definition"> {
  existingNames?: string[];
  kind: "source" | "destination" | "configuration" | "processor";
}

const ResourceNameInputComponent: React.FC<ResourceNameInputProps> = ({
  value,
  onValueChange,
  existingNames,
  kind,
}) => {
  const { errors, setError, touched, touch } = useValidationContext();

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    if (!isFunction(onValueChange)) {
      return;
    }

    onValueChange(e.target.value);
    const error = validateNameField(e.target.value, kind, existingNames);
    setError("name", error);
  }

  return (
    <TextField
      onBlur={() => touch("name")}
      value={value}
      onChange={handleChange}
      inputProps={{
        "data-testid": "name-field",
      }}
      error={errors.name != null && touched.name}
      helperText={
        <>
          Choose a name for the reusable resource in BindPlane OP.
          {errors.name && (
            <>
              <br />
              {errors.name}
            </>
          )}
        </>
      }
      color={errors.name != null ? "error" : "primary"}
      name={"name"}
      fullWidth
      size="small"
      label={"Name"}
      required
      autoComplete="off"
      autoCorrect="off"
      autoCapitalize="off"
      spellCheck="false"
    />
  );
};

export const ResourceNameInput = memo(ResourceNameInputComponent);
