import {
  InputLabel,
  FormHelperText,
  Stack,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { ChangeEvent } from "react";
import { ParamInputProps } from "./ParameterInput";

export const EnumsParamInput: React.FC<ParamInputProps<string[]>> = ({
  classes,
  definition,
  value,
  onValueChange,
}) => {
  function handleToggleValue(
    event: ChangeEvent<HTMLInputElement>,
    checked: boolean,
    toggleValue: string
  ) {
    const newValue = [...(value ?? [])];
    if (checked) {
      // Make sure that toggleValue is in new value array
      if (!newValue.includes(toggleValue)) {
        newValue.push(toggleValue);
      }
    } else {
      // Remove the toggle value from the array
      const atIndex = newValue.findIndex((v) => v === toggleValue);
      if (atIndex > -1) {
        newValue.splice(atIndex, 1);
      }
    }

    onValueChange && onValueChange(newValue);
  }

  return (
    <>
      <InputLabel>{definition.label}</InputLabel>
      <FormHelperText>{definition.description}</FormHelperText>
      <Stack>
        {definition.validValues!.map((vv) => (
          <FormControlLabel
            key={`${definition.name}-label-${vv}`}
            control={
              <Switch
                key={`${definition.name}-switch-${vv}`}
                size="small"
                onChange={(e, c) => handleToggleValue(e, c, vv)}
                checked={value?.includes(vv)}
                classes={classes}
              />
            }
            label={vv}
          />
        ))}
      </Stack>
    </>
  );
};
