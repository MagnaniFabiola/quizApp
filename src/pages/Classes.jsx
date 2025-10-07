import { useNavigate } from 'react-router-dom';

function ClassCard({ title, onClick }) {
  return (
    <div className="bg-surface rounded-xl p-6 w-56 border border-border">
      <div className="text-center mb-4 font-medium text-lg">{title}</div>
      <div className="flex justify-center">
        <button 
          onClick={onClick}
          className="bg-brand text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition-colors"
        >
          Create Quiz
        </button>
      </div>
    </div>
  );
}

export default function Classes() {
  const navigate = useNavigate();

  const handleCreateQuiz = (className) => {
    navigate(`/create-quiz/${className}`);
  };

  return (
    <div className="min-h-screen bg-bg text-text">
      {/* Top navy strip */}
      <div className="h-2 bg-brand" />

      <div className="max-w-6xl mx-auto px-8 py-6">
        {/* Classes */}
        <h1 className="text-2xl font-semibold mb-6">Classes</h1>
        <div className="flex flex-wrap gap-6">
          <ClassCard 
            title="HCI" 
            onClick={() => handleCreateQuiz('HCI')}
          />
          <ClassCard 
            title="Database" 
            onClick={() => handleCreateQuiz('Database')}
          />
        </div>
      </div>
    </div>
  );
}