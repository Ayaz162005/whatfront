import { useEffect, useState } from "react";
import { Button, Container, Typography, makeStyles } from "@material-ui/core";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import toast from "react-hot-toast";
import { useCurrentUser } from "../context/useCurrentUser";

const useStyles = makeStyles(() => ({
  root: {
    position: "absolute",
    top: "50%",
    left: "50%",
    maxWidth: "700px",

    transform: "translate(-50%, -50%)",
    textAlign: "center",
    border: "1px grey solid",
    borderRadius: "10px",
    padding: "20px",
  },
  input: {
    width: 30,
    height: 30,
    fontSize: 20,
    border: "1px solid #000",
    borderRadius: 4,
    margin: "0 5px",
    textAlign: "center",
    marginBlock: "10px",
  },
  verify: {
    margin: "10px",
    backgroundColor: "blue",
    "&:hover": {
      backgroundColor: "blue",
    },
  },
  resend: {
    margin: "10px",
    color: "blue",
  },
}));

const PhoneVerify = () => {
  const { data: currentUser, loading } = useCurrentUser();
  const classes = useStyles();

  const navigate = useNavigate();

  const [code, setCode] = useState(["", "", "", "", "", ""]);

  const handleChange = (index: number, value: string) => {
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    if (value !== "" && index < 5) {
      // Move focus to the next input field
      document.getElementById(`input-${index + 1}`)!.focus();
    }
  };
  useEffect(() => {
    if (currentUser?.me?.phoneChecked) {
      navigate("/");
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    if (!currentUser && !loading) {
      navigate("/signup");
    }
  }, [currentUser, navigate, loading]);
  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    // Handle backspace and delete keys
    if (
      (event.key === "Backspace" && index > 0 && code[index] === "") ||
      (event.key === "Delete" && index < 5 && code[index] === "")
    ) {
      // Move focus to the previous input field
      document.getElementById(`input-${index - 1}`)!.focus();
    }
  };
  async function verifyHandle() {
    try {
      const codeString = code.join("");

      const res = await axios.post("http://localhost:3000/auth/phone-verify", {
        code: codeString,
        phone: currentUser?.me?.phone,
      });
      console.log(res);
      toast.success("Phone verified");
      navigate("/");
    } catch (e: any) {
      if (e.response.data.message) {
        return toast.error(e.response.data.message);
      } else {
        toast.error("Something wrong happened");
      }
    }
    // Call the verify email mutation here
  }

  async function resendHandle() {
    try {
      const res = await axios.post(
        "http://localhost:3000/auth/phone-verify-code-sendagain",
        {
          phone: currentUser?.me?.phone,
        }
      );
      console.log(res);
      toast.success("Phone code sent");
    } catch (e: any) {
      if (e.response.data.message) {
        return toast.error(e.response.data.message);
      } else {
        toast.error("Something wrong happened");
      }
    }
  }
  return (
    <Container className={classes.root}>
      <Typography variant="h5" gutterBottom>
        Let's get your phone verified
      </Typography>
      <Typography>
        To keep your account secure we need to verify your phone number. Enter
        the code we have sent to{" "}
        <span style={{ fontWeight: "bold" }}>{currentUser?.me?.phone}</span>
        below.
      </Typography>
      <div>
        {code.map((value, index) => (
          <input
            key={index}
            id={`input-${index}`}
            className={classes.input}
            type="text"
            value={value}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            maxLength={1}
            autoComplete="off"
          />
        ))}
      </div>
      <div>
        <Button
          variant="contained"
          color="primary"
          className={classes.verify}
          onClick={verifyHandle}
        >
          Verify
        </Button>

        <Button
          variant="text"
          color="primary"
          className={classes.resend}
          onClick={resendHandle}
        >
          Resend code
        </Button>
      </div>
    </Container>
  );
};

export default PhoneVerify;
