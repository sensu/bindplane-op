import { createContext, useContext, useState } from "react";
import { FormValues } from ".";

interface ResourceFormContextValue {
  formValues: FormValues;
  setFormValues: React.Dispatch<React.SetStateAction<FormValues>>;
}

const ResourceFormDefaults: ResourceFormContextValue = {
  formValues: {},
  setFormValues: () => {},
};

const ResourceFormValueContext = createContext(ResourceFormDefaults);

export const FormValueContextProvider: React.FC<{
  initValues: Record<string, any>;
}> = ({ children, initValues }) => {
  const [formValues, setFormValues] = useState<FormValues>(initValues);

  return (
    <ResourceFormValueContext.Provider value={{ formValues, setFormValues }}>
      {children}
    </ResourceFormValueContext.Provider>
  );
};

export function useResourceFormValues(): ResourceFormContextValue {
  return useContext(ResourceFormValueContext);
}
