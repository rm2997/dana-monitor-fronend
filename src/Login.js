import React from "react";
import SingIn from "./components/singin/Sigin";

export default function Login({ setToken, apiAddress }) {
  return <SingIn setToken={setToken} apiAddress={apiAddress} />;
}
