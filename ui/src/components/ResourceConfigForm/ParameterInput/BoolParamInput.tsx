import { FormControlLabel, Switch } from "@mui/material";
import { isFunction } from "lodash";
import { ParamInputProps } from "./ParameterInput";
import { memo } from "react";

import styles from "./parameter-input.module.scss";

const BoolParamInputComponent: React.FC<ParamInputProps<boolean>> = ({
  definition,
  value,
  onValueChange,
}) => {
  return (
    <FormControlLabel
      classes={{
        root: definition.relevantIf ? styles.indent : undefined,
      }}
      control={
        <Switch
          onChange={(e) => {
            isFunction(onValueChange) && onValueChange(e.target.checked);
          }}
          name={definition.name}
          checked={value}
        />
      }
      label={definition.label}
    />
  );
};

export const BoolParamInput = memo(BoolParamInputComponent);
