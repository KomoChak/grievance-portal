import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Chip,
  Grid,
  Divider,
  Button,
  Stepper,
  Step,
  StepLabel,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Rating,
  Alert
} from "@mui/material";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import FeedbackIcon from "@mui/icons-material/Feedback";

const mockGrievance = {
  id: "GRV-2025-00123",
  subsidiary: "Central Coalfields Limited",
  category: "Salary/Payment",
  subject: "Salary not credited for April 2025",
  details:
    "My salary for April 2025 has not been credited yet. Please look into this issue urgently.",
  date: "2025-05-02",
  status: "Resolved", // "Pending", "In Progress", "Resolved", "Rejected"
  submittedAt: "2025-05-02T10:15:00Z",
  updatedAt: "2025-05-10T15:30:00Z",
  adminResponse:
    "Your salary issue has been resolved and the amount has been credited on 10th May 2025. Please check your bank account.",
  attachments: [
    {
      name: "salary-slip-april-2025.pdf",
      url: "/attachments/salary-slip-april-2025.pdf"
    }
  ],
  feedback: null // or { rating: 4, comments: "Issue resolved quickly." }
};

const statusSteps = [
  "Submitted",
  "In Progress",
  "Resolved"
];

const statusIcons = {
  Pending: <HourglassEmptyIcon color="warning" />,
  "In Progress": <AssignmentTurnedInIcon color="info" />,
  Resolved: <CheckCircleIcon color="success" />,
  Rejected: <HourglassEmptyIcon color="error" />
};

export default function GrievanceDetailPage() {
  // In real app, fetch grievance by ID from backend using useParams()
  const [grievance, setGrievance] = useState(mockGrievance);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedback, setFeedback] = useState({ rating: 0, comments: "" });
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  const handleFeedbackOpen = () => setFeedbackOpen(true);
  const handleFeedbackClose = () => setFeedbackOpen(false);

  const handleFeedbackSubmit = () => {
    setGrievance({
      ...grievance,
      feedback: { ...feedback }
    });
    setFeedbackSuccess(true);
    setFeedbackOpen(false);
    // TODO: Send feedback to backend
  };

  // Determine active step for Stepper
  const stepIndex =
    grievance.status === "Pending"
      ? 0
      : grievance.status === "In Progress"
      ? 1
      : 2;

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", mt: 6, mb: 4 }}>
      <Paper elevation={4} sx={{ p: { xs: 2, md: 4 } }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom color="primary">
          Grievance Details
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <Typography variant="subtitle2" color="text.secondary">
              Grievance ID: <b>{grievance.id}</b>
            </Typography>
            <Typography variant="h6" sx={{ mt: 2 }}>
              {grievance.subject}
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              {grievance.details}
            </Typography>
            <Typography variant="body2" sx={{ mt: 2 }}>
              <b>Category:</b> {grievance.category}
            </Typography>
            <Typography variant="body2">
              <b>Subsidiary:</b> {grievance.subsidiary}
            </Typography>
            <Typography variant="body2">
              <b>Date of Incident:</b> {grievance.date}
            </Typography>
            <Typography variant="body2">
              <b>Submitted At:</b> {new Date(grievance.submittedAt).toLocaleString()}
            </Typography>
            <Typography variant="body2">
              <b>Last Updated:</b> {new Date(grievance.updatedAt).toLocaleString()}
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Chip
                label={grievance.status}
                color={
                  grievance.status === "Resolved"
                    ? "success"
                    : grievance.status === "In Progress"
                    ? "info"
                    : grievance.status === "Rejected"
                    ? "error"
                    : "warning"
                }
                icon={statusIcons[grievance.status]}
                sx={{ fontWeight: "bold", fontSize: 16 }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Attachments:
            </Typography>
            {grievance.attachments && grievance.attachments.length > 0 ? (
              grievance.attachments.map((file) => (
                <Button
                  key={file.name}
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outlined"
                  size="small"
                  sx={{ mb: 1, textTransform: "none" }}
                >
                  {file.name}
                </Button>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                No attachments
              </Typography>
            )}
          </Grid>
        </Grid>

        {/* Stepper for status */}
        <Box sx={{ mt: 4, mb: 2 }}>
          <Stepper activeStep={stepIndex} alternativeLabel>
            {statusSteps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        {/* Admin Response */}
        {grievance.adminResponse && (
          <Box sx={{ mt: 4, p: 2, bgcolor: "#f5f5f5", borderRadius: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold" color="primary">
              Official Response:
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              {grievance.adminResponse}
            </Typography>
          </Box>
        )}

        {/* Feedback Section */}
        {grievance.status === "Resolved" && (
          <Box sx={{ mt: 4 }}>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="h6" sx={{ mb: 2 }}>
              <FeedbackIcon sx={{ mr: 1, verticalAlign: "middle" }} />
              Your Feedback
            </Typography>
            {grievance.feedback ? (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body1">
                  <b>Rating:</b>{" "}
                  <Rating value={grievance.feedback.rating} readOnly />
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                  <b>Comments:</b> {grievance.feedback.comments}
                </Typography>
              </Box>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={handleFeedbackOpen}
                startIcon={<FeedbackIcon />}
              >
                Give Feedback
              </Button>
            )}
          </Box>
        )}

        {/* Feedback Dialog */}
        <Dialog open={feedbackOpen} onClose={handleFeedbackClose}>
          <DialogTitle>Submit Your Feedback</DialogTitle>
          <DialogContent>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Please rate your grievance resolution experience.
            </Typography>
            <Rating
              name="rating"
              value={feedback.rating}
              onChange={(_, value) =>
                setFeedback((prev) => ({ ...prev, rating: value }))
              }
              size="large"
            />
            <TextField
              label="Comments"
              name="comments"
              value={feedback.comments}
              onChange={(e) =>
                setFeedback((prev) => ({
                  ...prev,
                  comments: e.target.value
                }))
              }
              fullWidth
              multiline
              minRows={2}
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleFeedbackClose}>Cancel</Button>
            <Button
              onClick={handleFeedbackSubmit}
              variant="contained"
              color="primary"
              disabled={feedback.rating === 0}
            >
              Submit
            </Button>
          </DialogActions>
        </Dialog>

        {/* Success Alert */}
        {feedbackSuccess && (
          <Alert
            severity="success"
            sx={{ mt: 3 }}
            onClose={() => setFeedbackSuccess(false)}
          >
            Thank you for your feedback!
          </Alert>
        )}
      </Paper>
    </Box>
  );
}