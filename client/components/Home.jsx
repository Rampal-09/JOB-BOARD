import { Link } from "react-router-dom";
export default function Home() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Job Board</h1>
      <Link to="/login">Login</Link>
    </div>
  );
}
