import DashboardIcon from "@mui/icons-material/Dashboard";
import AssignmentIcon from "@mui/icons-material/Assignment";
import GroupIcon from "@mui/icons-material/Group";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ListAltIcon from "@mui/icons-material/ListAlt";
import LogoutIcon from "@mui/icons-material/Logout";

export const SIDEBAR_CONFIG = {
  superadmin: [
    { section: "Main" },
    { label: "Dashboard", icon: <DashboardIcon />, path: "/admin" },
    {
      label: "Manage Grievances",
      icon: <AssignmentIcon />,
      submenu: [
        { label: "Submitted Grievances", path: "/admin/manage-grievances/submitted" },
        { label: "Pending Grievances", path: "/admin/manage-grievances/pending" },
        { label: "Action Taken", path: "/admin/manage-grievances/action-taken" },
        { label: "Closed Grievances", path: "/admin/manage-grievances/closed" },
      ],
    },
    { section: "Management" },
    { label: "Manage Admins", icon: <GroupIcon />, path: "/admin/manage-admins" },
    { label: "Logout", icon: <LogoutIcon />, path: "/admin/logout", bottom: true },
  ],
  subsidiaryadmin: [
    { section: "Main" },
    { label: "Dashboard", icon: <DashboardIcon />, path: "/admin" },
    {
      label: "Manage Grievances",
      icon: <AssignmentIcon />,
      submenu: [
        { label: "Submitted Grievances", path: "/admin/manage-grievances/submitted" },
        { label: "Pending Grievances", path: "/admin/manage-grievances/pending" },
        { label: "Action Taken", path: "/admin/manage-grievances/action-taken" },
        { label: "Closed Grievances", path: "/admin/manage-grievances/closed" },
      ],
    },
    { section: "Management" },
    { label: "Manage Area Admin", icon: <PersonAddIcon />, path: "/admin/manage-area-admin" },
    { label: "Logout", icon: <LogoutIcon />, path: "/admin/logout", bottom: true },
  ],
  areaadmin: [
    { section: "Main" },
    { label: "Dashboard", icon: <DashboardIcon />, path: "/admin" },
    {
      label: "Manage Grievances",
      icon: <AssignmentIcon />,
      submenu: [
        { label: "Pending Grievances", path: "/admin/manage-grievances/pending" },
        { label: "Action Taken", path: "/admin/manage-grievances/action-taken" },
        { label: "Closed Grievances", path: "/admin/manage-grievances/closed" },
      ],
    },
    { label: "Logout", icon: <LogoutIcon />, path: "/admin/logout", bottom: true },
  ],
};