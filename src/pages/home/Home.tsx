import { useDispatch } from "react-redux";

function HomePage() {
  const dispatch = useDispatch();

  const handleSignout = () => {
    dispatch({ type: "auth/signOut" });
  }

  return (
    <div>
      <h2>Home</h2>
      <button onClick={handleSignout}>Sign out</button>
    </div>
  );
};

export default HomePage;
