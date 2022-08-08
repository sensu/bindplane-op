import { TextField } from "@mui/material";
import { isFunction } from "lodash";
import { ChangeEvent } from "react";
import { ParamInputProps } from "./ParameterInput";

import styles from "./parameter-input.module.scss";

export const IntParamInput: React.FC<ParamInputProps<number>> = ({
  definition,
  value,
  onValueChange,
}) => {
  // TODO dsvanlani This should probably be a custom text input with validation
  return (
    <TextField
      classes={{
        root: definition.relevantIf ? styles.indent : undefined,
      }}
      value={value}
      onChange={(e: ChangeEvent<HTMLInputElement>) =>
        isFunction(onValueChange) && onValueChange(Number(e.target.value))
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
      type={"number"}
    />
  );
};
