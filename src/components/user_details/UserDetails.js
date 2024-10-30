import { Label } from "@mui/icons-material";
import {
  Box,
  Card,
  Container,
  FormControl,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";

export default function UserDetails() {
  return (
    <Container>
      <Card variant="outlined">
        <Typography
          component="h1"
          variant="h3"
          sx={{
            width: "100%",
            fontSize: "clamp(2rem, 10vw, 2.15rem)",
            marginBottom: "30px",
          }}
        >
          User Details
        </Typography>
        <Box component="form">
          <FormControl>
            <TextField
              placeholder="User name"
              disabled={true}
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
            <TextField
              placeholder="Password"
              disabled={true}
              error={userPasswordError}
              helperText={passwordErrorMessage}
              variant="standard"
              autoFocus={true}
              id="txtPassword"
              type="password"
              required={true}
              fullWidth
              color={passwordError ? "error" : "primary"}
            ></TextField>
          </FormControl>
        </Box>
      </Card>
    </Container>
  );
}
