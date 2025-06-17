import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
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
  Alert,
  CircularProgress,
} from "@mui/material";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import FeedbackIcon from "@mui/icons-material/Feedback";

const statusSteps = ["Submitted", "In Progress", "Resolved"];
const statusIcons = {
  pending: <HourglassEmptyIcon color="warning" />,
  "in progress": <AssignmentTurnedInIcon color="info" />,
  resolved: <CheckCircleIcon color="success" />,
  rejected: <HourglassEmptyIcon color="error" />,
};

export default function GrievanceDetailPage() {
  const { id } = useParams();
  const [grievance, setGrievance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedback, setFeedback] = useState({ rating: 0, comments: "" });
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  useEffect(() => {
    const fetchGrievance = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:5000/api/grievances/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setGrievance(res.data.grievance);
      } catch (err) {
        setError("Could not load grievance. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchGrievance();
  }, [id]);

  const handleFeedbackOpen = () => setFeedbackOpen(true);
  const handleFeedbackClose = () => setFeedbackOpen(false);

  const handleFeedbackSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:5000/api/grievances/${id}/feedback`,
        feedback,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setGrievance((prev) => ({
        ...prev,
        feedback: { ...feedback },
      }));
      setFeedbackSuccess(true);
      setFeedbackOpen(false);
    } catch (err) {
      setError("Could not submit feedback. Try again.");
    }
  };

  if (loading) return <CircularProgress sx={{ display: "block", mx: "auto", mt: 6 }} />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!grievance) return null;

  const stepIndex =
    grievance.status === "pending"
      ? 0
      : grievance.status === "in progress"
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
              Grievance ID: <b>{grievance._id}</b>
            </Typography>
            <Typography variant="h6" sx={{ mt: 2 }}>
              {grievance.title}
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              {grievance.description}
            </Typography>
            <Typography variant="body2" sx={{ mt: 2 }}>
              <b>Category:</b> {grievance.category || "-"}
            </Typography>
            <Typography variant="body2">
              <b>Submitted At:</b> {new Date(grievance.createdAt).toLocaleString()}
            </Typography>
            <Typography variant="body2">
              <b>Last Updated:</b> {new Date(grievance.updatedAt).toLocaleString()}
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Chip
                label={grievance.status}
                color={
                  grievance.status === "resolved"
                    ? "success"
                    : grievance.status === "in progress"
                    ? "info"
                    : grievance.status === "rejected"
                    ? "error"
                    : "warning"
                }
                icon={statusIcons[grievance.status?.toLowerCase()]}
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
        {grievance.response && (
          <Box sx={{ mt: 4, p: 2, bgcolor: "#f5f5f5", borderRadius: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold" color="primary">
              Official Response:
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              {grievance.response}
            </Typography>
          </Box>
        )}

        {/* Feedback Section */}
        {grievance.status === "resolved" && (
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
                  comments: e.target.value,
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