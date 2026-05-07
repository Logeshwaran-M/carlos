import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { auth, confirmPasswordReset } from '../firebase';
import { Lock, CheckCircle2, AlertTriangle, ArrowLeft } from 'lucide-react';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();

  // Get the oobCode from the URL query parameters
  const query = new URLSearchParams(location.search);
  const hashQuery = new URLSearchParams(location.hash.substring(location.hash.indexOf('?')));
  const oobCode = query.get('oobCode') || hashQuery.get('oobCode');

  useEffect(() => {
    console.log("Current URL:", window.location.href);
    console.log("Extracted oobCode:", oobCode);
    if (!oobCode) {
      setError('Invalid or expired password reset link.');
    }
  }, [oobCode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await confirmPasswordReset(auth, oobCode, password);
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      console.error(err);
      setError('Failed to reset password. The link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-32 pb-24">
      <div className="max-w-md w-full mx-auto px-6">
        <div className="bg-white rounded-[3rem] p-10 lg:p-16 shadow-2xl shadow-pink-100/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-pink-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          
          <div className="relative z-10 text-center">
            <div className="w-16 h-16 bg-pink-50 rounded-2xl flex items-center justify-center text-pink-600 mx-auto mb-6">
              <Lock size={32} />
            </div>
            
            <h2 className="text-pink-600 font-['Outfit'] font-black uppercase tracking-[0.3em] text-[10px] mb-4">Security</h2>
            <h3 className="text-4xl font-['Outfit'] font-black text-gray-900 uppercase tracking-tighter mb-8">New Password</h3>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3">
                <AlertTriangle className="text-red-600 shrink-0" size={20} />
                <p className="text-red-600 text-xs font-bold text-left">{error}</p>
              </div>
            )}

            {success ? (
              <div className="space-y-6">
                <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
                  <CheckCircle2 size={32} />
                </div>
                <p className="text-gray-600 font-medium">Password reset successful! Redirecting you to login...</p>
                <button 
                  onClick={() => navigate('/login')}
                  className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-pink-600 transition-all shadow-xl"
                >
                  Go To Login
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-4 text-left">New Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-pink-600 transition-all font-medium placeholder:text-gray-300"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-4 text-left">Confirm Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-pink-600 transition-all font-medium placeholder:text-gray-300"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !oobCode}
                  className={`w-full bg-gray-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-sm transition-all shadow-xl active:scale-95 mt-4 ${loading || !oobCode ? 'opacity-50 cursor-not-allowed' : 'hover:bg-pink-600'}`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Updating...</span>
                    </div>
                  ) : (
                    'Reset Password'
                  )}
                </button>
              </form>
            )}

            <button
              onClick={() => navigate('/login')}
              className="mt-8 flex items-center justify-center space-x-2 text-gray-400 hover:text-pink-600 transition-colors mx-auto group"
            >
              <ArrowLeft size={16} className="transform group-hover:-translate-x-1 transition-transform" />
              <span className="font-black uppercase tracking-widest text-[10px]">Back to Login</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
