import { useEffect, useRef, useState } from "react";
import {
  Button,
  TextField,
  FormControl,
  InputLabel,
  Input,
  InputAdornment,
  IconButton,
  makeStyles,
  Typography,
  Link,
  createTheme,
  ThemeProvider,
  FormHelperText,
} from "@material-ui/core";
import { Visibility, VisibilityOff } from "@material-ui/icons";

import "react-phone-input-2/lib/style.css";
import gsap from "gsap";
import { useNavigate } from "react-router-dom";
import { useCurrentUser } from "../context/useCurrentUser";
import toast from "react-hot-toast";

const theme = createTheme({
  palette: {
    primary: {
      main: "#3f51b5",
    },
    secondary: {
      main: "#f50057",
    },
    background: {
      default: "#f0f2f5",
    },
  },
});

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
  },
  formContainer: {
    display: "flex",
    flexDirection: "column",
    maxWidth: 400,
    borderRadius: theme.shape.borderRadius,
    overflow: "hidden",
    boxShadow: theme.shadows[4],
  },
  form: {
    padding: theme.spacing(4),
    backgroundColor: theme.palette.background.paper,
  },
  submitButton: {
    margin: theme.spacing(2, 0),
    padding: theme.spacing(1.5),
  },
}));

const SignInPage = () => {
  const { data: currentUser } = useCurrentUser();
  const navigate = useNavigate();
  const classes = useStyles();

  useEffect(() => {
    if (currentUser) {
      navigate("/");
    }
  }, [currentUser, navigate]);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const isValid = validateForm();
      if (!isValid) {
        return;
      }

      const res = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      console.log("Form submitted:", formData);

      if (!res.ok) {
        // If the response status is not in the range 200-299, it's an error
        // Throw an error with the error message from the response
        const errorMessage = await res.text();
        throw new Error(errorMessage);
      }

      const data = await res.json();
      console.log(data);
      localStorage.setItem("token", data.access_token);
      // If the response is successful, display a success message
      toast.success("Sign in successful");

      navigate("/");
      // Redirect or perform other actions after successful sign-in
    } catch (error: any) {
      // If an error occurs during the request or the response status is not ok
      console.error("Sign in error:", error.message);
      console.log(JSON.parse(error.message));
      if (error.message) {
        return toast.error(
          "Error signing in: " + JSON.parse(error.message).message
        );
      }
      toast.error("Error signing");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const validateForm = () => {
    // Add your form validation logic here
    if (!formData.email.trim() || !formData.password.trim()) {
      toast.error("Please fill in all fields");
      return false;
    }
    return true;
  };

  const myhand = useRef(null);
  useEffect(() => {
    gsap.to(myhand.current, {
      duration: 1,
      rotate: -10, // Rotate the element by 10 degrees
      transformOrigin: "left",
      yoyo: true, // Reverse the animation
      repeat: -1, // Repeat indefinitely
      ease: "power1.inOut", // Easing function for smooth animation
    });
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.root}>
        <div className={classes.formContainer}>
          <div className={classes.form}>
            <Typography variant="h5" component="h2" gutterBottom>
              Sign In
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={formData.email}
                onChange={handleInputChange}
              />
              <FormControl
                variant="outlined"
                fullWidth
                margin="normal"
                required
              >
                <InputLabel htmlFor="outlined-adornment-password">
                  Password
                </InputLabel>
                <Input
                  id="outlined-adornment-password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  name="password"
                  onChange={handleInputChange}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={togglePasswordVisibility}
                        edge="end"
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  }
                  labelWidth={70}
                />
              </FormControl>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submitButton}
              >
                Sign In
              </Button>
              <FormHelperText>
                Don't have an account?{" "}
                <Link href="/signup" color="secondary">
                  Sign Up
                </Link>
              </FormHelperText>
              <FormHelperText>
                Did you forget your password?
                <Link href="/forgotpassword" color="secondary">
                  Forgot password
                </Link>
              </FormHelperText>
            </form>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default SignInPage;
