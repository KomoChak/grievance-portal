import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box, Card, CardContent, CardHeader, Divider, Typography,
  CircularProgress
} from "@mui/material";
import {
  PieChart, Pie, Cell, Tooltip,
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Label
} from "recharts";
import { useAdminAuth } from "../../context/AdminAuthContext";
import RecentActivity from "./Dashboard/RecentActivity";

// 🔄 Updated statusColorMap with all 4 statuses
const statusColorMap = {
  Submitted: "#FFB74D",
  Pending: "#42A5F5",
  "Action Taken": "#FF7043",
  Closed: "#66BB6A"
};

const pendencyColors = ["#81C784", "#FFD54F", "#FFB74D", "#E57373"];

export default function Dashboard() {
  const [statusData, setStatusData] = useState([]);
  const [pendencyData, setPendencyData] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAdminAuth();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/admins/dashboard-stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStatusData(res.data.statusData || []);
        setPendencyData(res.data.pendencyData || []);
        setRecentActivity(res.data.recentActivity || []);
      } catch (err) {
        console.error("❌ Error fetching dashboard stats:", err);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchStats();
  }, [token]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", maxWidth: 1400, mx: "auto", py: 3, px: { xs: 2, sm: 4 } }}>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 4, justifyContent: "center", mb: 4 }}>
        <Card sx={{ width: { xs: "100%", sm: "48%", md: "45%" }, boxShadow: 4 }}>
          <CardHeader title="Complaint Status" sx={{ pb: 0 }} />
          <Divider />
          <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
            <Box sx={{ width: "100%", height: 250 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData.length ? statusData : [{ name: "No Data", value: 1 }]}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    label
                  >
                    {(statusData.length ? statusData : [{ name: "No Data" }]).map((entry, idx) => (
                      <Cell
                        key={entry.name || idx}
                        fill={statusColorMap[entry.name] || "#ccc"}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "center", gap: 4, flexWrap: "wrap" }}>
              {Object.entries(statusColorMap).map(([label, color]) => (
                <Box key={label} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box sx={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: color }} />
                  <Typography variant="body2">{label}</Typography>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ width: { xs: "100%", sm: "48%", md: "45%" }, boxShadow: 4 }}>
          <CardHeader title="Grievance Pendency" sx={{ pb: 0 }} />
          <Divider />
          <CardContent sx={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={pendencyData.length ? pendencyData : [{ name: "No Data", value: 0 }]}
                margin={{ top: 10, bottom: 20 }}
              >
                <XAxis dataKey="name">
                  <Label value="Days" offset={10} position="insideBottom" />
                </XAxis>
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value">
                  {(pendencyData.length ? pendencyData : [{ name: "No Data" }]).map((entry, idx) => (
                    <Cell
                      key={entry.name || idx}
                      fill={pendencyColors[idx % pendencyColors.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Box>


    </Box>
  );
}
