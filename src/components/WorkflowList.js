import React, { useState, useEffect } from 'react';
import { workflowService } from '../services/api';

export default function WorkflowList() {
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadWorkflows();
  }, []);

  const loadWorkflows = async () => {
    setLoading(true);
    try {
      const data = await workflowService.getAll();
      setWorkflows(data);
    } catch (err) {
      console.error('Fehler beim Laden der Workflows:', err);
      setError('Workflows konnten nicht geladen werden');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-4">Workflows werden geladen...</div>;
  if (error) return <div className="text-center py-4 text-red-600">{error}</div>;
  if (workflows.length === 0) return <div className="text-center py-4">Keine Workflows gefunden.</div>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-gray-100 border-b">
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thema</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Erstellt am</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aktionen</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {workflows.map((workflow) => (
            <tr key={workflow.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{workflow.topic}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  workflow.current_stage ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {workflow.current_stage || 'Nicht gestartet'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(workflow.created_at).toLocaleString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <a 
                  href={`/workflows/${workflow.id}`} 
                  className="text-blue-600 hover:text-blue-900"
                >
                  Details
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
