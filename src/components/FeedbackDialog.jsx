import React, { useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography, Box, Rating, TextField, Alert
} from "@mui/material";

export default function FeedbackDialog({ open, onClose, onSubmit }) {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onSubmit(rating, feedback);
      onClose();
    }, 1500);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <img src="/thank-you.svg" alt="Thank You" style={{ height: 36 }} />
          Feedback
        </Box>
      </DialogTitle>
      <DialogContent>
        {submitted ? (
          <Alert severity="success" sx={{ mb: 2 }}>
            Thank you for your feedback!
          </Alert>
        ) : (
          <>
            <Typography sx={{ mb: 1 }}>How satisfied are you with the resolution?</Typography>
            <Rating
              value={rating}
              onChange={(_, val) => setRating(val)}
              size="large"
              sx={{ mb: 2 }}
            />
            <TextField
              label="Additional Comments"
              fullWidth
              multiline
              minRows={3}
              value={feedback}
              onChange={e => setFeedback(e.target.value)}
              sx={{ mb: 2 }}
            />
          </>
        )}
      </DialogContent>
      <DialogActions>
        {!submitted && (
          <>
            <Button onClick={onClose}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained" disabled={rating === 0}>
              Submit
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}
