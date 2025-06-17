import React from "react";
import AdminForm from "./AdminForm";
import axios from "@/utils/axiosConfig";
import { useAdminAuth } from "../../context/AdminAuthContext";

export default function ManageAdmin() {
  const { admin } = useAdminAuth();

  const handleSubmit = async (data) => {
    try {
      const payload = {
        name: data.name,
        email: data.email,
        employeeId: data.employeeCode,
        password: "welcome123", // Default password (can be made dynamic)
        subsidiary: data.subsidiary,
      };

      await axios.post("/admins/add-subsidiary-admin", payload, {
        headers: {
          Authorization: `Bearer ${admin.token}`,
        },
      });

      alert("✅ Subsidiary admin added successfully!");
    } catch (err) {
      console.error("❌ Error adding subsidiary admin:", err);
      alert(err?.response?.data?.message || "Failed to add admin.");
    }
  };

  return (
    <AdminForm
      heading="Add New Admin"
      defaultRole="subsidiaryadmin"
      disableRole={true}
      onSubmit={handleSubmit}
    />
  );
}
