
import React from 'react';

interface LoginPageProps {
  onLoginSuccess: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [name, setName] = React.useState('');
  const [error, setError] = React.useState('');
  const [isReturningUser, setIsReturningUser] = React.useState(false);
  const [rememberMe, setRememberMe] = React.useState(false);

  React.useEffect(() => {
    const storedEmail = localStorage.getItem('user_email');
    const storedName = localStorage.getItem('user_name');
    if (storedEmail) {
      setIsReturningUser(true);
      setEmail(storedEmail); // Pre-fill email
      if (storedName) setName(storedName);
    }
  }, []);

  const handleLogin = () => {
    if (!email || !password || (!isReturningUser && !name)) {
      setError('Please fill in all fields');
      return;
    }

    if (isReturningUser) {
      // Validation for returning user
      const storedPassword = localStorage.getItem('user_password');
      if (storedPassword && password !== storedPassword) {
        setError('Incorrect password');
        return;
      }
    }

    // Success - Save credentials
    localStorage.setItem('user_email', email);
    localStorage.setItem('user_name', name || localStorage.getItem('user_name') || 'User');
    localStorage.setItem('user_password', password); // In a real app, never store passwords in local storage!

    if (rememberMe) {
      localStorage.setItem('remember_me', 'true');
    } else {
      localStorage.removeItem('remember_me');
    }

    localStorage.setItem('login_timestamp', new Date().toISOString());
    onLoginSuccess();
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F0F7F9]">
      <div className="w-full max-w-md p-10 bg-white rounded-3xl shadow-xl animate-[slideUp_0.6s_ease-out]">
        <h2 className="text-3xl font-bold text-[#0F4C75] text-center mb-2">{isReturningUser ? `Welcome Back, ${name || 'User'}` : 'Create Account'}</h2>
        <p className="text-[#547D9A] text-center mb-8">
          {isReturningUser ? 'Enter your password to continue.' : 'Sign in to explore antibiotic resistance patterns.'}
        </p>

        <div className="space-y-4 mb-6">
          {!isReturningUser && (
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => { setName(e.target.value); setError(''); }}
              className="w-full px-5 py-3 border border-[#E1E8ED] rounded-xl outline-none focus:ring-2 focus:ring-[#0FA3B1] transition-all"
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(''); }}
            disabled={isReturningUser} // Lock email for returning (simplified flow)
            className={`w-full px-5 py-3 border border-[#E1E8ED] rounded-xl outline-none focus:ring-2 focus:ring-[#0FA3B1] transition-all ${isReturningUser ? 'bg-gray-50 text-gray-500' : ''}`}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(''); }}
            className="w-full px-5 py-3 border border-[#E1E8ED] rounded-xl outline-none focus:ring-2 focus:ring-[#0FA3B1] transition-all"
          />

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="remember"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 text-[#0FA3B1] rounded border-gray-300 focus:ring-[#0FA3B1]"
            />
            <label htmlFor="remember" className="text-sm text-[#547D9A]">Remember me</label>
          </div>

          {error && <p className="text-red-500 text-sm font-bold text-center animate-pulse">{error}</p>}
        </div>

        <button
          onClick={handleLogin}
          className="w-full py-4 bg-[#0FA3B1] text-white font-bold rounded-xl hover:bg-[#12B4C3] transition-all mb-4 shadow-lg shadow-teal-500/20"
        >
          {isReturningUser ? 'Login' : 'Get Started'}
        </button>

        {isReturningUser && (
          <button onClick={() => { setIsReturningUser(false); setEmail(''); setName(''); setPassword(''); }} className="w-full text-center text-sm text-[#547D9A] hover:text-[#0F4C75] font-semibold">
            Not you? Switch account
          </button>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
