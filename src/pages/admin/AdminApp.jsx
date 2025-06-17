import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ResponsiveLayout from "../../components/ResponsiveLayout";
import AdminSidebar from "../../components/admin/AdminSidebar";
import Footer from "../../components/Footer";
import { useAdminAuth } from "../../context/AdminAuthContext";

// Admin pages/components
import Dashboard from "../../components/admin/Dashboard";
import NotFound from "../../components/admin/NotFound";
import ManageGrievances from "../../components/admin/ManageGrievances/ManageGrievances";
import TotalGrievances from "../../components/admin/ManageGrievances/TotalGrievances";
import SubmittedGrievances from "../../components/admin/ManageGrievances/SubmittedGrievances";
import PendingGrievances from "../../components/admin/ManageGrievances/PendingGrievances";
import ActionTakenGrievances from "../../components/admin/ManageGrievances/ActionTakenGrievances";
import ClosedGrievances from "../../components/admin/ManageGrievances/ClosedGrievances";
import ManageAdmin from "../../components/admin/ManageAdmin";
import ManageAreaAdmin from "../../components/admin/ManageAreaAdmin";
import ManageRegistrations from "../../components/admin/ManageRegistrations";
import AddCategoryPage from "../../components/admin/ManageCategories/AddCategoryPage";
import AddSubcategoryPage from "../../components/admin/ManageCategories/AddSubcategoryPage";

export default function AdminApp() {
  const { admin } = useAdminAuth();

  if (!admin) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <ResponsiveLayout
      SidebarComponent={AdminSidebar}
      sidebarProps={{ role: admin.role }}
      title="Coal India Admin Portal"
      isAdmin={true}
    >
      <Routes>
        <Route index element={<Dashboard adminRole={admin.role} />} />
        <Route path="dashboard" element={<Dashboard adminRole={admin.role} />} />

        {/* Manage Grievances */}
        <Route path="manage-grievances" element={<ManageGrievances adminRole={admin.role} />} />
        <Route path="manage-grievances/total" element={<TotalGrievances />} />
        <Route path="manage-grievances/submitted" element={<SubmittedGrievances adminRole={admin.role} />} />
        <Route path="manage-grievances/pending" element={<PendingGrievances adminRole={admin.role} />} />
        <Route path="manage-grievances/action-taken" element={<ActionTakenGrievances adminRole={admin.role} />} />
        <Route path="manage-grievances/closed" element={<ClosedGrievances adminRole={admin.role} />} />

        {/* Superadmin-specific routes */}
        {admin.role === "superadmin" && (
          <>
            <Route path="manage-categories/add-category" element={<AddCategoryPage />} />
            <Route path="manage-categories/add-subcategory" element={<AddSubcategoryPage />} />
            <Route path="manage-registrations" element={<ManageRegistrations adminRole={admin.role} />} />
            <Route path="manage-admin" element={<ManageAdmin />} />
          </>
        )}

        {/* Subsidiaryadmin-only route */}
        {admin.role === "subsidiaryadmin" && (
          <Route path="manage-area-admin" element={<ManageAreaAdmin />} />
        )}

        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </ResponsiveLayout>
  );
}
