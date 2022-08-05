import { FormControl, InputLabel, FormHelperText } from "@mui/material";
import { isEmpty, isFunction } from "lodash";
import { useState, ChangeEvent } from "react";
import { YamlEditor } from "../../YamlEditor";
import { ParamInputProps } from "./ParameterInput";

export const YamlParamInput: React.FC<ParamInputProps<string>> = ({
  classes,
  definition,
  value,
  onValueChange,
}) => {
  const [isFocused, setFocused] = useState(false);

  const shrinkLabel = isFocused || !isEmpty(value);

  function handleValueChange(e: ChangeEvent<HTMLTextAreaElement>) {
    isFunction(onValueChange) && onValueChange(e.target.value);
  }

  return (
    <FormControl fullWidth classes={classes} required={definition.required}>
      <InputLabel
        shrink={shrinkLabel}
        htmlFor={definition.name}
        style={{
          backgroundColor: "#fff",
          color: shrinkLabel ? "#4abaeb" : undefined,
          padding: shrinkLabel ? "0 10px 0 5px" : undefined,
        }}
      >
        {definition.label}
      </InputLabel>
      <YamlEditor
        required={definition.required}
        name={definition.name}
        value={value ?? ""}
        onValueChange={handleValueChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        minHeight={200}
      />
      <FormHelperText>{definition.description}</FormHelperText>
    </FormControl>
  );
};
