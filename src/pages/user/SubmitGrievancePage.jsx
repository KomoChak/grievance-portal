import React, { useState, useEffect } from "react";
import {
  Box, Typography, Paper, TextField, MenuItem, Button,
  FormControl, Select, Alert, Stack
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const COLORS = {
  primary: "#1A237E",
  background: "#f4f6f8",
  cardBg: "#fff",
};

const hardcodedSubsidiaries = [
  { name: "Eastern Coalfields Limited (ECL)", areas: [{ name: "Sodepur Area", units: ["Unit S1", "Unit S2"] }, { name: "Salanpur Area", units: ["Unit SA1", "Unit SA2"] }] },
  { name: "Bharat Coking Coal Limited (BCCL)", areas: [{ name: "Katras Area", units: ["Unit K1", "Unit K2"] }, { name: "Barora Area", units: ["Unit B1", "Unit B2"] }] },
  { name: "Central Coalfields Limited (CCL)", areas: [{ name: "Argada Area", units: ["Unit A1", "Unit A2"] }, { name: "Barka Sayal Area", units: ["Unit BS1", "Unit BS2"] }] },
  { name: "Northern Coalfields Limited (NCL)", areas: [{ name: "Singrauli Area", units: ["Unit SG1", "Unit SG2"] }, { name: "Jayant Area", units: ["Unit J1", "Unit J2"] }] },
  { name: "Western Coalfields Limited (WCL)", areas: [{ name: "Nagpur Area", units: ["Unit N1", "Unit N2"] }, { name: "Chandrapur Area", units: ["Unit C1", "Unit C2"] }] },
  { name: "South Eastern Coalfields Limited (SECL)", areas: [{ name: "Korba Area", units: ["Unit KOR1", "Unit KOR2"] }, { name: "Baikunthpur Area", units: ["Unit BK1", "Unit BK2"] }] },
  { name: "Mahanadi Coalfields Limited (MCL)", areas: [{ name: "Talcher Area", units: ["Unit T1", "Unit T2"] }, { name: "IB Valley Area", units: ["Unit IB1", "Unit IB2"] }] },
  { name: "Central Mine Planning & Design Institute Limited (CMPDI)", areas: [{ name: "CMPDI HQ", units: ["Unit HQ1", "Unit HQ2"] }, { name: "CMPDI Regional", units: ["Unit R1", "Unit R2"] }] },
];

const hardcodedCategories = [
  { name: "Payment of Provident Fund", subcategories: ["Delay in Payment", "Incorrect Amount", "Transfer Issues", "Statement Issues", "Others"] },
  { name: "Payment of Pension", subcategories: ["Delay in Payment", "Incorrect Amount", "Non-receipt of Orders", "Transfer Issues", "Others"] },
  { name: "Payment of Gratuity", subcategories: ["Delay", "Incorrect Calculation", "Others"] },
  { name: "Payment of PRP/ Bonus", subcategories: ["Delay", "Incorrect Payment", "Others"] },
  { name: "Payment of Leave Encashment", subcategories: ["Delay", "Incorrect Amount", "Others"] },
  { name: "Payment of settling allowance", subcategories: ["Delay", "Non-payment", "Others"] },
  { name: "CPRMSE/CPRMS-NE related", subcategories: ["Enrollment Issues", "Claim Issues", "Others"] },
  { name: "Payment of Compensation/Ex Gratia", subcategories: ["Delay", "Incorrect Amount", "Others"] },
  { name: "Payment of Life Cover Scheme", subcategories: ["Claim Issues", "Enrollment Problems", "Others"] },
  { name: "Payment of Monthly Monetary Compensation", subcategories: ["Delay", "Non-receipt", "Others"] },
  { name: "Payment of arrears arising out of pay/wage revision", subcategories: ["Delay", "Incorrect Calculation", "Others"] },
  { name: "Other Grievances", subcategories: ["Service Certificate", "Experience Certificate", "Policy Clarification", "Any Other"] }
];

export default function SubmitGrievancePage() {
  const [form, setForm] = useState({
    subsidiary: "",
    area: "",
    unit: "",
    dateOfRetirement: "",
    category: "",
    subcategory: "",
    details: "",
    attachment: null,
  });
  const [message, setMessage] = useState("");
  const [dynamicCategories, setDynamicCategories] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/categories")
      .then((res) => res.json())
      .then((data) => setDynamicCategories(data))
      .catch((err) => console.error("Category fetch error:", err));
  }, []);

  const selectedSubsidiary = hardcodedSubsidiaries.find(s => s.name === form.subsidiary);
  const selectedArea = selectedSubsidiary?.areas.find(a => a.name === form.area);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value,
      ...(name === "subsidiary" ? { area: "", unit: "" } : {}),
      ...(name === "area" ? { unit: "" } : {}),
      ...(name === "category" ? { subcategory: "" } : {})
    }));
  };

  const mergedCategories = [...hardcodedCategories];
  dynamicCategories.forEach(dynamicCat => {
    if (!mergedCategories.find(h => h.name === dynamicCat.name)) {
      mergedCategories.push({ name: dynamicCat.name, subcategories: dynamicCat.subcategories.map(s => s.name) });
    }
  });

  const handleSubmit = async () => {
    setMessage("");
    const { subsidiary, area, unit, dateOfRetirement, category, subcategory, details } = form;

    if (!subsidiary || !area || !unit || !dateOfRetirement || !category || !subcategory || !details) {
      setMessage("All fields are required.");
      return;
    }

    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("subsidiary", subsidiary);
    formData.append("area", area);
    formData.append("unit", unit);
    formData.append("dateOfRetirement", dateOfRetirement);
    formData.append("category", category);
    formData.append("subcategory", subcategory);
    formData.append("description", details);
    formData.append("title", `${category} - ${subcategory}`);
    if (form.attachment) formData.append("attachment", form.attachment);

    try {
      const res = await fetch("http://localhost:5000/api/grievances", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Submission failed");
      setMessage("Grievance submitted successfully.");
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", background: COLORS.background, py: 5 }}>
      <Box sx={{ maxWidth: "800px", mx: "auto" }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3, background: COLORS.cardBg }}>
          <Typography variant="h5" fontWeight="bold" align="center" sx={{ mb: 3, color: COLORS.primary }}>
            Submit a Grievance
          </Typography>

          {/* Personal Information Section */}
          <Typography variant="h6" gutterBottom>Personal Information</Typography>
          <Stack spacing={2} mb={3}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl fullWidth>
                <Select name="subsidiary" value={form.subsidiary} onChange={handleChange} displayEmpty>
                  <MenuItem value="" disabled>Select Subsidiary</MenuItem>
                  {hardcodedSubsidiaries.map((s) => (
                    <MenuItem key={s.name} value={s.name}>{s.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <Select name="area" value={form.area} onChange={handleChange} displayEmpty disabled={!form.subsidiary}>
                  <MenuItem value="" disabled>Select Area</MenuItem>
                  {selectedSubsidiary?.areas.map((a) => (
                    <MenuItem key={a.name} value={a.name}>{a.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl fullWidth>
                <Select name="unit" value={form.unit} onChange={handleChange} displayEmpty disabled={!form.area}>
                  <MenuItem value="" disabled>Select Unit</MenuItem>
                  {selectedArea?.units.map((u) => (
                    <MenuItem key={u} value={u}>{u}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField fullWidth type="date" name="dateOfRetirement" label="Date of Retirement" value={form.dateOfRetirement} onChange={handleChange} InputLabelProps={{ shrink: true }} />
            </Box>
          </Stack>

          {/* Grievance Information Section */}
          <Typography variant="h6" gutterBottom>Grievance Information</Typography>
          <Stack spacing={2} mb={3}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl fullWidth>
                <Select name="category" value={form.category} onChange={handleChange} displayEmpty>
                  <MenuItem value="" disabled>Select Category</MenuItem>
                  {mergedCategories.map(c => <MenuItem key={c.name} value={c.name}>{c.name}</MenuItem>)}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <Select name="subcategory" value={form.subcategory} onChange={handleChange} displayEmpty disabled={!form.category}>
                  <MenuItem value="" disabled>Select Subcategory</MenuItem>
                  {mergedCategories.find(c => c.name === form.category)?.subcategories.map(sub => (
                    <MenuItem key={sub} value={sub}>{sub}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <TextField fullWidth label="Grievance Details" multiline minRows={4} name="details" value={form.details} onChange={handleChange} inputProps={{ maxLength: 2000 }} />
          </Stack>

          {/* File Upload */}
          <Typography variant="h6" gutterBottom>Supporting Document (Optional)</Typography>
          <Button component="label" variant="outlined" startIcon={<CloudUploadIcon />} sx={{ width: "100%", mb: 3 }}>
            {form.attachment ? form.attachment.name : "Upload File (PDF, JPG, PNG, DOC)"}
            <input type="file" hidden onChange={(e) => setForm(prev => ({ ...prev, attachment: e.target.files[0] }))} accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" />
          </Button>

          {/* Submit Button */}
          <Box textAlign="center" mt={2}>
            <Button variant="contained" size="large" sx={{ px: 6, borderRadius: 2, backgroundColor: COLORS.primary }} onClick={handleSubmit}>
              Submit Grievance
            </Button>
          </Box>

          {/* Message Alert */}
          {message && <Alert severity={message.includes("successfully") ? "success" : "error"} sx={{ mt: 3 }}>{message}</Alert>}
        </Paper>
      </Box>
    </Box>
  );
}
