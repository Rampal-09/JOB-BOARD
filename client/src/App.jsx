import Login from "../pages/Login";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { AuthProvider } from "../context/Authcontext";
import { lazy, Suspense } from "react";
import "./App.css";
const Home = lazy(() => import("../components/Home"));
const RecruiterDash = lazy(() => import("../components/RecruiterDash"));
const ProtectedRoute = lazy(() => import("../components/ProtectedRoute"));
const SeekerDash = lazy(() => import("../components/SeekerDash"));

function Spinner() {
  return <div style={{ padding: "2rem", textAlign: "center" }}>Loading...</div>;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<Spinner />}>
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/login" element={<Login />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowRole="seeker">
                  <SeekerDash></SeekerDash>
                </ProtectedRoute>
              }
            ></Route>

            <Route
              path="/recruiter"
              element={
                <ProtectedRoute allowRole="recruiter">
                  {" "}
                  <RecruiterDash />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
