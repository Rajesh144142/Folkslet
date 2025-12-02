import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { BsFacebook } from 'react-icons/bs';
import { logIn, signUp } from '../redux/actions/AuthActions';
import { useSnackbar } from '../providers/SnackbarProvider.jsx';

const initialState = {
  email: '',
  password: '',
  confirmpass: '',
};

const Auth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showMessage } = useSnackbar();
  const { loading, authData } = useSelector((state) => state.authReducer);
  useEffect(() => {
    if (authData) {
      navigate('/home', { replace: true });
    }
  }, [authData, navigate]);
  const [isSignUp, setIsSignUp] = useState(false);
  const [formValues, setFormValues] = useState(initialState);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormValues(initialState);
  };

  const toggleMode = () => {
    resetForm();
    setIsSignUp((prev) => !prev);
  };

  const passwordsMatch = !isSignUp || formValues.password === formValues.confirmpass;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!passwordsMatch) {
      showMessage('Passwords do not match', { severity: 'error' });
      return;
    }

    const normalizedEmail = formValues.email.trim().toLowerCase();

    const payload = {
      email: normalizedEmail,
      password: formValues.password,
    };

    try {
      if (isSignUp) {
        await dispatch(signUp(payload));
        showMessage('Account created successfully', { severity: 'success' });
      } else {
        await dispatch(logIn(payload));
        showMessage('Signed in successfully', { severity: 'success' });
      }
      navigate('/home', { replace: true });
    } catch (error) {
      const apiMessage = error.response?.data?.message || error.message;
      showMessage(apiMessage || 'Unable to process request', { severity: 'error' });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-8 text-text-base transition-colors duration-200">
      <div className="flex w-full max-w-5xl overflow-hidden rounded-3xl border border-border bg-surface shadow-xl shadow-border/40 md:h-[80vh]">
        <div className="relative hidden h-full w-1/2 bg-background md:block">
          <img
            src="https://imgs.search.brave.com/dWA124YWqhgCLiNdTP0FKXTD7MY5cxIFs184DZET024/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMudW5zcGxhc2gu/Y29tL3Bob3RvLTE1/NTg4ODU1NDQtMmRl/ZmM2MmUyZTJiP2l4/bGliPXJiLTQuMC4z/Jml4aWQ9TTN3eE1q/QTNmREI4TUh4elpX/RnlZMmg4TVRGOGZH/MXZZbWxzWlNVeU1I/Qm9iMjVsZkdWdWZE/QjhmREI4Zkh3dyZ3/PTEwMDAmcT04MA"
            alt="Creative workspace"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-background/20 to-background/5" />
        </div>
        <div className="flex h-full w-full flex-col justify-center bg-surface px-6 py-10 sm:px-10 md:w-1/2">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-semibold text-primary">Folkslet</h1>
            <p className="mt-2 text-sm text-text-muted">
              {isSignUp ? 'Create a new account to get started.' : 'Welcome back, sign in to continue.'}
            </p>
          </div>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-xs font-medium uppercase tracking-wide text-text-muted"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formValues.email}
                onChange={handleChange}
                className="w-full rounded-lg border border-border bg-background p-3 text-sm text-text-base placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/70"
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-xs font-medium uppercase tracking-wide text-text-muted"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formValues.password}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-border bg-background p-3 text-sm text-text-base placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/70"
                />
              </div>
              {isSignUp && (
                <div>
                  <label
                    htmlFor="confirmpass"
                    className="mb-2 block text-xs font-medium uppercase tracking-wide text-text-muted"
                  >
                    Confirm password
                  </label>
                  <input
                    id="confirmpass"
                    name="confirmpass"
                    type="password"
                    required
                    value={formValues.confirmpass}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-border bg-background p-3 text-sm text-text-base placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/70"
                  />
                </div>
              )}
            </div>
            <button
              type="submit"
              disabled={loading || !passwordsMatch}
              className="flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-on-primary transition-colors duration-200 hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? 'Processing...' : isSignUp ? 'Create account' : 'Sign in'}
            </button>
          </form>
          {isSignUp && !passwordsMatch && (
            <p className="mt-2 text-xs font-medium text-red-500">
              Password and confirm password must match.
            </p>
          )}
          <div className="mt-6 flex items-center gap-3 text-sm text-text-muted">
            <span className="h-px flex-1 bg-border" />
            <span>or continue with</span>
            <span className="h-px flex-1 bg-border" />
          </div>
          <button
            type="button"
            className="mt-4 flex items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-text-base transition-colors duration-200 hover:border-primary hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <BsFacebook className="text-lg" />
            Log in with Facebook
          </button>
          <div className="mt-6 text-center text-sm text-text-muted">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              type="button"
              onClick={toggleMode}
              className="font-medium text-primary hover:underline"
            >
              {isSignUp ? 'Sign in' : 'Sign up'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;