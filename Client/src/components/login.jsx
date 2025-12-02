import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { login as loginRequest } from '../api/authApi';
import { AUTH_START, AUTH_SUCCESS, AUTH_FAIL } from '../redux/actionTypes';
import { useSnackbar } from '../providers/SnackbarProvider.jsx';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showMessage } = useSnackbar();
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const signIn = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    dispatch({ type: AUTH_START });
    try {
      const { data } = await loginRequest(credentials);
      dispatch({ type: AUTH_SUCCESS, data });
      showMessage('Signed in successfully', { severity: 'success' });
      navigate('/home', { replace: true });
    } catch (error) {
      dispatch({ type: AUTH_FAIL, error: error.response?.data?.message || error.message });
      showMessage(error.response?.data?.message || 'Unable to sign in', { severity: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="bg-background text-text-base transition-colors duration-200">
      <div className="flex min-h-screen flex-col items-center justify-center px-6 py-8">
        <div className="w-full rounded-lg border border-border bg-surface shadow-sm sm:max-w-md">
          <div className="space-y-5 p-6 sm:p-8">
            <h1 className="text-xl font-semibold leading-tight tracking-tight sm:text-2xl">
              Sign in to your account
            </h1>
            <form className="space-y-5" onSubmit={signIn}>
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-text-base">
                  Your email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={credentials.email}
                  onChange={handleChange}
                  className="block w-full rounded-lg border border-border bg-background p-2.5 text-sm text-text-base placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/70"
                  placeholder="name@company.com"
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-text-base"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={credentials.password}
                  onChange={handleChange}
                  className="block w-full rounded-lg border border-border bg-background p-2.5 text-sm text-text-base placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/70"
                  placeholder="••••••••"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-on-primary transition-colors duration-200 hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting ? 'Signing in...' : 'Sign in'}
              </button>
              <p className="text-sm font-light text-text-muted">
                Don't have an account yet?{' '}
                <Link to="/auth" className="font-medium text-primary hover:underline">
                  Sign up
                </Link>
              </p>
              <Link to="/auth/forgetpassword" className="text-sm font-medium text-primary">
                Forget password?
              </Link>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;