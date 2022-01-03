import React, { useState } from "react";
import AuthContext from "../context/AuthContext";

export default function AuthProvider(props) {
  const [authData, setAuthData] = useState();

  const setAuth = (data) => {
    setAuthData(data);
  };

  return (
    <AuthContext.Provider
      value={{
        auth: authData,
        setAuth,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
