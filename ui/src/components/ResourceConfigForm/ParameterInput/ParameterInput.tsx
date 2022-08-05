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
import { classes as classesUtil } from "../../../utils/styles";

import styles from "./parameter-input.module.scss";

export interface ParamInputProps<T> {
  classes?: { [name: string]: string };
  definition: ParameterDefinition;
  value?: T;
  onValueChange?: (v: T) => void;
}

export const ParameterInput: React.FC<ParamInputProps<any>> = (props) => {
  let classes = props.classes;
  if (props.definition.relevantIf != null) {
    classes = Object.assign(classes || {}, {
      root: classesUtil([classes?.root, styles.indent]),
    });
  }
  switch (props.definition.type) {
    case ParameterType.String:
      return <StringParamInput classes={classes} {...props} />;
    case ParameterType.Strings:
      return <StringsParamInput classes={classes} {...props} />;
    case ParameterType.Enum:
      return <EnumParamInput classes={classes} {...props} />;
    case ParameterType.Enums:
      return <EnumsParamInput classes={classes} {...props} />;
    case ParameterType.Bool:
      return <BoolParamInput classes={classes} {...props} />;
    case ParameterType.Int:
      return <IntParamInput classes={classes} {...props} />;
    case ParameterType.Map:
      return <MapParamInput classes={classes} {...props} />;
    case ParameterType.Yaml:
      return <YamlParamInput classes={classes} {...props} />;
    case ParameterType.Timezone:
      return <TimezoneParamInput classes={classes} {...props} />;
  }
};
