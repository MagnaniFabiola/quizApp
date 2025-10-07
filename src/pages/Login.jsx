import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // For now, just navigate to classes page
    // Later we'll add actual authentication
    navigate('/classes');
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <div className="h-2 bg-brand" />
      
      <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-brand mb-2">QUIZ</h1>
          <p className="text-sm text-gray-500 uppercase tracking-wider">APP</p>
        </div>

        <div className="w-full space-y-6">
          <h2 className="text-xl font-medium">Welcome</h2>
          <p className="text-gray-600">Please Log in</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">UserName:</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border border-border px-4 py-2 rounded-lg bg-white focus:ring-1 focus:ring-brand focus:border-brand"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-border px-4 py-2 rounded-lg bg-white focus:ring-1 focus:ring-brand focus:border-brand"
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-brand text-white py-2 rounded-lg hover:bg-opacity-90 transition-colors"
            >
              Log In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}