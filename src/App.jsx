import { Routes, Route, Navigate } from "react-router-dom";
import AuthenticationPage from "./AuthenticationPage";
import Forum from "./HomePage";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase/firebase";
import ModalExample from "./modal";
import ModalWithBlur from "./modal";
import ProfilePage from "./ProfilePage";
import { ChatPage } from "./ChatPage";


function App() {
  const [user, loading, error] = useAuthState(auth);

  

  if (error) {
    return (
      <div className="error-screen">
        <h2>Authentication Error</h2>
        <p>{error.message}</p>
      </div>
    );
  }

  return (
  
    <Routes>
      <Route
        path="/"
        element={
          !user ? (
            <AuthenticationPage />
          ) : (
            <Navigate to="/forum" replace />
          )
        }
      />
      <Route
        path="/forum"
        element={
          user ? (
            <Forum />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
    <Route
    path="/modal" element={<ModalWithBlur/>} > </Route>
      <Route
        path="*"
        element={<Navigate to={user ? "/forum" : "/"} replace />}
      />

    <Route
    path="/pp" element={<ProfilePage/>} > </Route>
    <Route
    path="/chat" element={<ChatPage/>} > </Route>

      
    </Routes>
    
  );
}

export default App;

