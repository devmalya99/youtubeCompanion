import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import {jwt_decode} from "jwt-decode";

const Login = () => {
  const handleLoginSuccess = async (credentialResponse) => {
    try {
      const idToken = credentialResponse.credential;
      console.log("✅ Google ID Token:", idToken);

      // Decode the ID token to get user info
      const decodedToken = jwt_decode(idToken);
      console.log("🔍 Decoded token:", decodedToken);

      // Send ID token to your backend for verification
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/google`,
        { token: idToken },
        { withCredentials: true } // Important for cookies if using them
      );

      // The backend should return both user info and OAuth token
      const { user, oauthToken } = response.data;

      // Store user info and OAuth token in localStorage
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("oauthToken", oAuthToken);

      console.log("🔑 OAuth Token stored:", oAuthToken);
      console.log("👤 Logged in user:", user);

     

    } catch (error) {
      console.error("❌ Google login error:", error);
      // Handle error (show message to user, etc.)
    }
  };

  return (
    <div className="flex justify-center mt-6">
      <GoogleLogin
        onSuccess={handleLoginSuccess}
        onError={() => {
          console.error("❌ Google Login Failed");
          // Optionally show error message to user
        }}
        useOneTap
        auto_select // Optional: automatically select the account if only one is available
      />
    </div>
  );
};

export default Login;