import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { TextField, Button, Typography, Container, Grid } from "@mui/material";
import { toast } from "react-hot-toast";

const ResetPassword = () => {
  const [searchParam, setSearchParam] = useSearchParams();

  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [confirmPassword, setConfirmPassword] = useState("");
  //   const history = useHistory();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Validate password and confirm password
      if (!password.trim() || !confirmPassword.trim()) {
        toast.error("Please enter both password and confirm password");
        return;
      }

      if (password !== confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }

      // Assuming you have an API endpoint for resetting the password
      const res = await fetch(
        `http://localhost:3000/auth/reset-password?token=${searchParam.get(
          "token"
        )}&id=${searchParam.get("id")}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password, passwordConfirm: confirmPassword }), // Send token and new password
        }
      );

      if (!res.ok) {
        const errorMessage = await res.text();
        throw new Error(errorMessage);
      }

      toast.success("Password reset successfully");
      //   history.push("/login"); // Redirect to login page
      navigate("/login");
    } catch (error) {
      console.error("Reset password error:", error);
      toast.error("Error resetting password");
    }
  };

  return (
    <Container maxWidth="sm">
      <div>
        <Typography variant="h4" gutterBottom>
          Reset Password
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="password"
                name="password"
                label="New Password"
                type="password"
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="confirmPassword"
                name="confirmPassword"
                label="Confirm New Password"
                type="password"
                variant="outlined"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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

export default ResetPassword;
