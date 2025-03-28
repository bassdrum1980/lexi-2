import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signInAction } from "../../features/auth/authSlice-actions";
import { selectToken } from "../../features/auth/authSlice";
import type { AppDispatch } from "../../app/store";
import SignInForm from "../../features/auth/SignInForm";

export type handleSubmitType = (event: React.FormEvent<HTMLFormElement>, email: string, password: string) => void;

function SignInPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const token = useSelector(selectToken);

  const handleSubmit: handleSubmitType = (event, email, password) => {
    event.preventDefault();
    dispatch(signInAction({ email, password }));
  };

  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token]);

  return (
    <SignInForm handleSubmit={handleSubmit} />
  );
};

export default SignInPage;
