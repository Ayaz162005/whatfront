import { useState } from "react";

import { TextField, Button, Typography, Container, Grid } from "@mui/material";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  //   const history = useHistory();
  const navigate = useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Validate email format
      if (!email.trim()) {
        toast.error("Please enter your email");
        return;
      }

      // Assuming you have an API endpoint for sending password reset emails
      const res = await fetch("http://localhost:3000/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const errorMessage = await res.text();
        throw new Error(errorMessage);
      }

      toast.success("Password reset email sent successfully");
      navigate("/");
      //   history.push("/login"); // Redirect to login page
    } catch (error: any) {
      console.error("Forgot password error:", error);
      if (error.message) {
        return toast.error(
          "Error sending password reset email: " +
            JSON.parse(error.message).message
        );
      }
      toast.error("Error sending password reset email");
    }
  };

  return (
    <Container maxWidth="sm">
      <div>
        <Typography variant="h4" gutterBottom>
          Forgot Password
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="email"
                name="email"
                label="Email"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Reset Password
              </Button>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
};

export default ForgotPassword;
