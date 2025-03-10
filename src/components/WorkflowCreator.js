import React, { useState } from 'react';
import { workflowService } from '../services/api';

export default function WorkflowCreator() {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [workflowId, setWorkflowId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const data = {
        topic,
        metadata: {
          created_from: 'web_interface',
          auto_progress: false
        }
      };
      
      const result = await workflowService.create(data);
      setWorkflowId(result.id);
      setSuccess(true);
    } catch (err) {
      console.error('Fehler beim Erstellen des Workflows:', err);
      setError(err.info?.message || 'Es ist ein Fehler aufgetreten');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Neuen Blog-Workflow erstellen</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-1">
            Blog-Thema
          </label>
          <input
            type="text"
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="z.B. Die Vorteile von KI im Content Marketing"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 rounded-md text-white font-medium ${
            loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Wird erstellt...' : 'Workflow erstellen'}
        </button>
      </form>
      
      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mt-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
          Workflow erfolgreich erstellt! ID: {workflowId}
        </div>
      )}
    </div>
  );
}
