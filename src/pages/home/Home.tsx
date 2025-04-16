import { useAppDispatch } from "../../app/hooks";

function HomePage() {
  const dispatch = useAppDispatch();

  const handleSignout = () => {
    dispatch({ type: "auth/signOut" });
  }

  return (
    <div data-testid="home-page">
      <h2>Home</h2>
      <button onClick={handleSignout}>Sign out</button>
    </div>
  );
};

export default HomePage;
