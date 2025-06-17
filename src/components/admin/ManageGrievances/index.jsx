import AreaAdminView from "./AreaAdminView";
import SuperAdminView from "./SuperAdminView";
import SubsidiaryAdminView from "./SubsidiaryAdminView";

export default function ManageGrievances({ adminRole }) {
  if (adminRole === "areaadmin") return <AreaAdminView />;
  if (adminRole === "subsidiaryadmin") return <SubsidiaryAdminView />;
  return <SuperAdminView />;
}