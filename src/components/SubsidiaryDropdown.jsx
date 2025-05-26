import React from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const subsidiaries = [
  "Northern Coalfields Limited",
  "Central Coalfields Limited",
  "Eastern Coalfields Limited",
  "Western Coalfields Limited",
  "South Eastern Coalfields Limited",
  "Mahanadi Coalfields Limited",
  "Bharat Coking Coal Limited",
  "North Eastern Coalfields",
  "Coal India HQ"
];

export default function SubsidiaryDropBox({ value, onChange, error }) {
  return (
    <FormControl fullWidth error={!!error}>
      <InputLabel>Subsidiary</InputLabel>
      <Select
        value={value}
        label="Subsidiary"
        onChange={onChange}
      >
        {subsidiaries.map((s) => (
          <MenuItem key={s} value={s}>{s}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
