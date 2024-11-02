import {
  Alert,
  Box,
  Button,
  Card,
  Container,
  Divider,
  FormControl,
  Link,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";

import React, { useState } from "react";
import { setTokenToSessionStorage } from "../../services";
import UseFetch from "../../hooks/UseFetch";
import { ApiMaps } from "../../configs";
import { UserModel } from "../../models";

export default function SingIn({ setUser }) {
  const [userNameError, setUserNameError] = useState(false);
  const [userNameErrorMessage, setUserNameErrorMessage] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setpasswordErrorMessage] = useState("");
  const [snack, setSnack] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const { loading, fetchData } = UseFetch();

  async function validateForm() {
    const userName = document.getElementById("txtUserName");
    const password = document.getElementById("txtPassword");
    let isValid = true;

    if (!userName.value) {
      isValid = false;
      setUserNameError(true);
      setUserNameErrorMessage("Please enter user name");
    } else {
      setUserNameError(false);
      setUserNameErrorMessage("");
    }

    if (!password.value) {
      isValid = false;
      setPasswordError(true);
      setpasswordErrorMessage("Please enter password");
    } else {
      setPasswordError(false);
      setpasswordErrorMessage("");
    }
    return isValid;
  }

  function handleCloseSnack() {
    setSnack(false);
  }
  async function handleSubmit(event) {
    event.preventDefault();
    const userName = document.getElementById("txtUserName").value;
    const userPassword = document.getElementById("txtPassword").value;
    const data = JSON.stringify({
      userName: userName,
      password: userPassword,
    });

    const returnValue = await fetchData(ApiMaps.LoginRequest, "", data);

    if (returnValue.status >= 400) {
      setSnackMessage(`Error in fetching data, ${returnValue.error}`);
      setSnack(true);
      return;
    } else if (returnValue.status > 201) {
      setSnackMessage("Incorect user name or password");
      setSnack(true);
    } else {
      const user = new UserModel();
      user.userName = userName;
      user.userToken = returnValue.data.access_token;
      console.log(user);
      setUser(user);
      setTokenToSessionStorage(user);
    }
  }

  return (
    <Container>
      <Card
        variant="outlined"
        sx={{
          paddingLeft: "15px",
          paddingRight: "15px",
          width: "40%",
          margin: "70px auto",
          height: "80vh",
          boxShadow:
            "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px,hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
          borderRadius: "10px",
        }}
      >
        <Box sx={{ textAlign: "center", marginTop: "20px" }}>
          <img
            alt="Logo"
            loading="lazy"
            src="/Dana_logo.png"
            style={{ height: "200px", width: "240px" }}
          />
        </Box>
        <Typography
          component="h1"
          variant="h3"
          sx={{
            width: "100%",
            fontSize: "clamp(2rem, 10vw, 2.15rem)",
            marginBottom: "30px",
          }}
        >
          Sign in
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            gap: 2,
            marginTop: "10px",
            marginBottom: "40px",
          }}
        >
          <FormControl>
            <TextField
              placeholder="User name"
              error={userNameError}
              helperText={userNameErrorMessage}
              variant="standard"
              autoFocus={true}
              focused={true}
              id="txtUserName"
              type="text"
              required={true}
              fullWidth
              color={userNameError ? "error" : "primary"}
            ></TextField>
          </FormControl>
          <FormControl>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span></span>
              <Link
                component="button"
                variant="body2"
                sx={{ alignSelf: "flex-end" }}
              >
                Forget password?
              </Link>
            </Box>
            <TextField
              placeholder="Password"
              error={passwordError}
              helperText={passwordErrorMessage}
              variant="standard"
              id="txtPassword"
              type="password"
              required={true}
              fullWidth
              color={passwordError ? "error" : "primary"}
            ></TextField>
          </FormControl>
          <Button
            variant="contained"
            type="submit"
            onClick={() => validateForm()}
            disabled={loading}
          >
            Sign in
          </Button>

          <Divider>or</Divider>
          <Box
            sx={{
              marginTop: "10px",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: "2",
            }}
          >
            <Typography sx={{ textAlign: "center" }}>
              Don&apos;t have an account?{" "}
              <span>
                <Link href="" variant="body2" sx={{ alignSelf: "center" }}>
                  Sign up
                </Link>
              </span>
            </Typography>
          </Box>
        </Box>
      </Card>
      <Snackbar autoHideDuration={6000} open={snack} onClose={handleCloseSnack}>
        <Alert severity="error" variant="filled" onClose={handleCloseSnack}>
          {snackMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}
