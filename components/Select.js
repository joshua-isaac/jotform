import React from 'react'

const Select = ({ forms, updateValue, value }) => {

  // if theres a value in CMS, parse value
  let formData = value ? JSON.parse(value) : null;
  
  return (
    <select onChange={updateValue}  value={formData?.formId}>
      <option value="">Select a form...</option>
      {forms.map((form) => {
        return (
          <option key={form.formId} value={form.formId}>{form.title}</option>
        )
      })}
    </select>
  )
}

export default Select