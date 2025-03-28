import { useState } from 'react';
import { handleSubmitType } from '../../pages/auth/SignIn';

interface SignInFormProps {
  handleSubmit: handleSubmitType;
}

function SignInForm({ handleSubmit }: SignInFormProps) {
  const [email, setEmail] = useState(import.meta.env.VITE_DEFAULT_USERNAME);
  const [password, setPassword] = useState(import.meta.env.VITE_DEFAULT_PASSWORD);


  const handleChange = (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    if (name === 'email') {
      setEmail(event.target.value);
    } else if (name === 'password') {
      setPassword(event.target.value);
    }
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    handleSubmit(event, email, password);
  };

  return (
    <>
      <h1>Sign In</h1>
      <form onSubmit={onSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            onChange={handleChange('email')}
            value={email}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            onChange={handleChange('password')}
            value={password}
          />
        </div>
        <button type="submit">Sign in</button>
      </form>
    </>
  );
}

export default SignInForm;