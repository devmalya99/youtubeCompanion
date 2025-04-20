import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const handleLoginSuccess = async (credentialResponse) => {
    try {
      const idToken = credentialResponse.credential;
      console.log("✅ Google ID Token:", idToken);

      // Decode the ID token to get user info
      const decodedToken = jwtDecode(idToken);  // This should now work
      console.log("🔍 Decoded token:", decodedToken);

      // Send ID token to your backend for verification
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/google`,
        { token: idToken },
        { withCredentials: true }
      );

      console.log("response after google login",response)

      // The backend should return both user info and OAuth token
      const { user, oauthToken } = response.data;

      // Store user info and OAuth token in localStorage
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("oauthToken", oauthToken);

      console.log("🔑 OAuth Token stored:", oauthToken);
      console.log("👤 Logged in user:", user);

    } catch (error) {
      console.error("❌ Google login error:", error);
    }
  };

  return (
    <div className="flex justify-center mt-6">
      <GoogleLogin
        onSuccess={handleLoginSuccess}
        onError={() => {
          console.error("❌ Google Login Failed");
        }}
        useOneTap
        auto_select
      />
    </div>
  );
};

export default Login;
