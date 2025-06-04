import React, { useState } from "react";
import { GoogleOAuthProvider, GoogleLogin, CredentialResponse } from "@react-oauth/google";
import UploadView from "./UploadView";

const App: React.FC = () => {
  const [user, setUser] = useState<CredentialResponse | null>(null);

  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
      {!user ? (
        <GoogleLogin
          onSuccess={(credentialResponse: CredentialResponse) => {
            setUser(credentialResponse);
          }}
          onError={() => {
            alert("Login Failed");
          }}
        />
      ) : (
        <UploadView user={user} />
      )}
    </GoogleOAuthProvider>
  );
};

export default App;