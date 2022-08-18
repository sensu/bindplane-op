import { useMemo } from "react";
import {
  BoolParamInput,
  EnumParamInput,
  EnumsParamInput,
  IntParamInput,
  MapParamInput,
  StringParamInput,
  StringsParamInput,
  TimezoneParamInput,
  YamlParamInput,
} from ".";
import { ParameterDefinition, ParameterType } from "../../../graphql/generated";
import { useResourceFormValues } from "../ResourceFormContext";

export interface ParamInputProps<T> {
  definition: ParameterDefinition;
  value?: T;
  onValueChange?: (v: T) => void;
}

export const ParameterInput: React.FC<{ definition: ParameterDefinition }> = ({
  definition,
}) => {
  const { formValues, setFormValues } = useResourceFormValues();
  const onValueChange = useMemo(
    () => (newValue: any) => {
      setFormValues((prev) => ({ ...prev, [definition.name]: newValue }));
    },
    [definition.name, setFormValues]
  );

  switch (definition.type) {
    case ParameterType.String:
      return (
        <StringParamInput
          definition={definition}
          value={formValues[definition.name]}
          onValueChange={onValueChange}
        />
      );
    case ParameterType.Strings:
      return (
        <StringsParamInput
          definition={definition}
          value={formValues[definition.name]}
          onValueChange={onValueChange}
        />
      );
    case ParameterType.Enum:
      return (
        <EnumParamInput
          definition={definition}
          value={formValues[definition.name]}
          onValueChange={onValueChange}
        />
      );
    case ParameterType.Enums:
      return (
        <EnumsParamInput
          definition={definition}
          value={formValues[definition.name]}
          onValueChange={onValueChange}
        />
      );
    case ParameterType.Bool:
      return (
        <BoolParamInput
          definition={definition}
          value={formValues[definition.name]}
          onValueChange={onValueChange}
        />
      );
    case ParameterType.Int:
      return (
        <IntParamInput
          definition={definition}
          value={formValues[definition.name]}
          onValueChange={onValueChange}
        />
      );
    case ParameterType.Map:
      return (
        <MapParamInput
          definition={definition}
          value={formValues[definition.name]}
          onValueChange={onValueChange}
        />
      );
    case ParameterType.Yaml:
      return (
        <YamlParamInput
          definition={definition}
          value={formValues[definition.name]}
          onValueChange={onValueChange}
        />
      );
    case ParameterType.Timezone:
      return (
        <TimezoneParamInput
          definition={definition}
          value={formValues[definition.name]}
          onValueChange={onValueChange}
        />
      );
  }
};
