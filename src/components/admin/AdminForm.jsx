import React from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";

const subsidiaryAreaMap = [
  {
    name: "Eastern Coalfields Limited (ECL)",
    areas: ["Sodepur Area", "Salanpur Area"],
  },
  {
    name: "Bharat Coking Coal Limited (BCCL)",
    areas: ["Katras Area", "Barora Area"],
  },
  {
    name: "Central Coalfields Limited (CCL)",
    areas: ["Argada Area", "Barka Sayal Area"],
  },
  {
    name: "Northern Coalfields Limited (NCL)",
    areas: ["Singrauli Area", "Jayant Area"],
  },
  {
    name: "Western Coalfields Limited (WCL)",
    areas: ["Nagpur Area", "Chandrapur Area"],
  },
  {
    name: "South Eastern Coalfields Limited (SECL)",
    areas: ["Korba Area", "Baikunthpur Area"],
  },
  {
    name: "Mahanadi Coalfields Limited (MCL)",
    areas: ["Talcher Area", "IB Valley Area"],
  },
  {
    name: "Central Mine Planning & Design Institute Limited (CMPDI)",
    areas: ["CMPDI HQ", "CMPDI Regional"],
  },
];

const subsidiaries = subsidiaryAreaMap.map((s) => s.name);

export default function AdminForm({
  heading = "Add New Admin",
  defaultSubsidiary = "",
  defaultRole = "",
  disableSubsidiary = false,
  disableRole = false,
  onSubmit,
}) {
  const [form, setForm] = React.useState({
    employeeCode: "",
    name: "",
    email: "",
    mobile: "",
    subsidiary: defaultSubsidiary,
    area: "",
    role: defaultRole,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(form);
  };

  const availableAreas = React.useMemo(() => {
    const found = subsidiaryAreaMap.find((s) => s.name === form.subsidiary);
    return found?.areas || [];
  }, [form.subsidiary]);

  return (
    <Box sx={{ maxWidth: 500, mx: "auto", p: 3, bgcolor: "#fff", borderRadius: 2, boxShadow: 2 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        {heading}
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Employee Code"
          name="employeeCode"
          value={form.employeeCode}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Email"
          name="email"
          value={form.email}
          onChange={handleChange}
          type="email"
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Mobile"
          name="mobile"
          value={form.mobile}
          onChange={handleChange}
          type="tel"
          fullWidth
          margin="normal"
          required
        />
        <FormControl fullWidth margin="normal" required disabled={disableSubsidiary}>
          <InputLabel>Subsidiary</InputLabel>
          <Select
            name="subsidiary"
            value={form.subsidiary}
            label="Subsidiary"
            onChange={handleChange}
          >
            {subsidiaries.map((s) => (
              <MenuItem key={s} value={s}>{s}</MenuItem>
            ))}
          </Select>
        </FormControl>
        {defaultRole === "areaadmin" && (
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Area</InputLabel>
            <Select
              name="area"
              value={form.area}
              label="Area"
              onChange={handleChange}
            >
              {availableAreas.map((a) => (
                <MenuItem key={a} value={a}>{a}</MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        <FormControl fullWidth margin="normal" required disabled={disableRole}>
          <InputLabel>Role</InputLabel>
          <Select
            name="role"
            value={form.role}
            label="Role"
            onChange={handleChange}
          >
            <MenuItem value="superadmin">Super Admin</MenuItem>
            <MenuItem value="subsidiaryadmin">Subsidiary Admin</MenuItem>
            <MenuItem value="areaadmin">Area Admin</MenuItem>
          </Select>
        </FormControl>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
        >
          Submit
        </Button>
      </form>
    </Box>
  );
}
