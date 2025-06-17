import React from "react";
import AdminForm from "./AdminForm";
import axios from "@/utils/axiosConfig";
import { useAdminAuth } from "../../context/AdminAuthContext";

export default function ManageAreaAdmin() {
  const { admin } = useAdminAuth();

  const handleSubmit = async (data) => {
    try {
      const payload = {
        name: data.name,
        email: data.email,
        employeeId: data.employeeCode,
        password: "welcome123", // Default password (can be changed securely)
        area: data.area,
        unit: "Default Unit", // You can update this later if unit selection is added
      };

      await axios.post("/admins/add-area-admin", payload, {
        headers: {
          Authorization: `Bearer ${admin.token}`,
        },
      });

      alert("✅ Area admin added successfully!");
    } catch (err) {
      console.error("❌ Error adding area admin:", err);
      alert(err?.response?.data?.message || "Failed to add admin.");
    }
  };

  return (
    <AdminForm
      heading="Add New Admin"
      defaultSubsidiary={admin?.subsidiary || ""}
      disableSubsidiary={true}
      defaultRole="areaadmin"
      disableRole={true}
      onSubmit={handleSubmit}
    />
  );
}
