import { useEffect, useState, useRef } from "react";
import agilityAppSDK from "@agility/app-sdk";
import axios from "axios";
import Select from "./Select";

export default function Jotform() {
  // set up state
  const [value, setValue] = useState("");
  const [fieldConfig, setFieldConfig] = useState(null);
  const [configValues, setConfigValues] = useState({});
  const [sdk, setSDK] = useState({});
  const [forms, setForms] = useState([]);

  console.log(value)

  // set ref
  const containerRef = useRef();

  // initialize field
  useEffect(() => {
    agilityAppSDK.initializeField({ containerRef }).then((fieldSDK) => {
      setSDK(fieldSDK);
      setValue(fieldSDK.field.value);
      setConfigValues(fieldSDK.configValues);
      setFieldConfig(fieldSDK.field);
    });
  }, []);

  // fetch forms from jotform
  useEffect(() => {
    (async () => {
      if (configValues.apiKey) {
        const { data } = await axios.get("/api/getForms", {
          params: { apiKey: configValues.apiKey },
        });
        // ignore unecessary data
        const mappedFormData = data.content.map(form => ({title: form.title, formId: form.id, url: form.url}));
        setForms(mappedFormData)
      }
    })();
  }, [configValues]);

  // update value
  const updateValue = (e) => {
    const formId = e.target.value;
    const form = forms.find((form) => form.formId === formId);
    let data = JSON.stringify(form);
    data = data && data !== "{}" ? data : "";
    console.log(data)
    setValue(data);
    sdk.updateFieldValue({ fieldValue: data });
  };

  if (fieldConfig) {
    return (
      <div className="field-row" ref={containerRef}>
        <label className="control-label">
          <span>{fieldConfig.label}</span>
          {fieldConfig.required && (
            <span className="required" title="This field is required.">
              *
            </span>
          )}
        </label>
        <div className="control-select">
          <Select forms={forms} updateValue={updateValue} value={value} />
        </div>
      </div>
    );
  } else {
    return (
      <div className="field-row" ref={containerRef}>
        <label>
          <span>Loading...</span>
        </label>
      </div>
    );
  }
}