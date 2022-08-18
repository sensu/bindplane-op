import { TextField } from "@mui/material";
import { isFunction } from "lodash";
import { ChangeEvent, memo } from "react";
import { ParamInputProps } from "./ParameterInput";

import styles from "./parameter-input.module.scss";

const StringParamInputComponent: React.FC<ParamInputProps<string>> = ({
  definition,
  value,
  onValueChange,
}) => {
  return (
    <TextField
      classes={{
        root: definition.relevantIf ? styles.indent : undefined,
      }}
      value={value}
      onChange={(e: ChangeEvent<HTMLInputElement>) =>
        isFunction(onValueChange) && onValueChange(e.target.value)
      }
      name={definition.name}
      fullWidth
      size="small"
      label={definition.label}
      helperText={definition.description}
      required={definition.required}
      autoComplete="off"
      autoCorrect="off"
      autoCapitalize="off"
      spellCheck="false"
    />
  );
};

export const StringParamInput = memo(StringParamInputComponent);
