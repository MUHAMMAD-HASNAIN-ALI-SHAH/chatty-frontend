import { Navigate, Route, Routes } from "react-router-dom"
import Register from "./pages/Register"
import Login from "./pages/login"
import Home from "./pages/Home"
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "./store";
import Loader from "./components/Loader";
import { verifyToken } from "./slices/authSlice";
import { useEffect } from "react";
import { connectSocket } from "./lib/socket";

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, isAuthenticating, user } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    dispatch(verifyToken());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated && user) {
      connectSocket(user._id);
    }
  }, [isAuthenticated, user]);

  return (
    <>
      <Routes>
        <Route path="/" element={isAuthenticating ? <Loader /> : isAuthenticated ? <Home /> : <Navigate to="/login" />} />
        <Route path="/register" element={isAuthenticating ? <Loader /> : !isAuthenticated ? <Register /> : <Navigate to="/" />} />
        <Route path="/login" element={isAuthenticating ? <Loader /> : !isAuthenticated ? <Login /> : <Navigate to="/" />} />
      </Routes>
    </>
  )
}

export default App
