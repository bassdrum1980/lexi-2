import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSignInMutation } from "../../services/lexiApiSlice";
import SignInForm from "../../features/auth/SignInForm";
import { selectIsAuthenticated } from "../../features/auth/authSlice";

export type handleSubmitType = (event: React.FormEvent<HTMLFormElement>, email: string, password: string) => void;

function SignInPage() {
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [signIn, { isLoading }] = useSignInMutation();

  const handleSubmit: handleSubmitType = (event, email, password) => {
    event.preventDefault();
    signIn({ email, password })
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  if (isLoading) {
    return <div data-testId="signin-page"><div>Loading...</div></div>;
  }

  return (
    <div data-testId="signin-page">
      <SignInForm handleSubmit={handleSubmit} />
    </div>
  );
};

export default SignInPage;
