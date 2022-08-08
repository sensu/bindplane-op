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

export interface ParamInputProps<T> {
  definition: ParameterDefinition;
  value?: T;
  onValueChange?: (v: T) => void;
}

export const ParameterInput: React.FC<ParamInputProps<any>> = (props) => {
  switch (props.definition.type) {
    case ParameterType.String:
      return <StringParamInput {...props} />;
    case ParameterType.Strings:
      return <StringsParamInput {...props} />;
    case ParameterType.Enum:
      return <EnumParamInput {...props} />;
    case ParameterType.Enums:
      return <EnumsParamInput {...props} />;
    case ParameterType.Bool:
      return <BoolParamInput {...props} />;
    case ParameterType.Int:
      return <IntParamInput {...props} />;
    case ParameterType.Map:
      return <MapParamInput {...props} />;
    case ParameterType.Yaml:
      return <YamlParamInput {...props} />;
    case ParameterType.Timezone:
      return <TimezoneParamInput {...props} />;
  }
};
