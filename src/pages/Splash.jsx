import { useNavigate } from 'react-router-dom';

export default function Splash() {
  const navigate = useNavigate();

  // Automatically navigate to login after a delay
  setTimeout(() => {
    navigate('/login');
  }, 2000);

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center">
      <div className="h-2 bg-brand fixed top-0 left-0 right-0" />
      
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-bold text-brand">QUIZ</h1>
        <p className="text-sm text-gray-500 uppercase tracking-wider">APP</p>
      </div>
    </div>
  );
}