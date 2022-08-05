import { FormControlLabel, Switch } from "@mui/material";
import { isFunction } from "lodash";
import { ParamInputProps } from "./ParameterInput";

export const BoolParamInput: React.FC<ParamInputProps<boolean>> = ({
  classes,
  definition,
  value,
  onValueChange,
}) => {
  return (
    <FormControlLabel
      classes={classes}
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
