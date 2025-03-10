// Mock-Daten für Testmodus ohne Backend
export const mockData = {
  // Beispiel-Workflows
  workflows: [
    {
      id: "mock-workflow-1",
      topic: "KI im Content Marketing",
      current_stage: "writing",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user_id: "test-user-id",
      metadata: {
        description: "Ein Artikel über KI im Content Marketing",
        content_type: "blog"
      },
      stages: {
        style_analysis: {
          id: "mock-stage-1",
          stage_name: "style_analysis",
          state: "completed",
          data: { tone: "professional" },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        research: {
          id: "mock-stage-2",
          stage_name: "research",
          state: "completed",
          data: { sources: 5 },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        writing: {
          id: "mock-stage-3",
          stage_name: "writing",
          state: "in_progress",
          data: { progress: 50 },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      }
    }
  ],
  
  // Mock-Profil
  profile: {
    id: "test-user-id",
    name: "Test User",
    email: "test@example.com",
    bio: "Dies ist ein Testbenutzer für die Entwicklung",
    location: "Test Location",
    joined_date: new Date().toISOString(),
    avatar_url: null
  },
  
  // Mock-Inhalte
  contents: [
    {
      id: "mock-content-1",
      title: "KI im Content Marketing",
      type: "blog",
      status: "draft",
      content: "Dies ist ein Beispielinhalt für KI im Content Marketing...",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user_id: "test-user-id",
      description: "Ein Artikel über KI im Content Marketing"
    }
  ],
  
  // Mock-Dateien
  files: [
    {
      id: "mock-file-1",
      name: "beispiel.pdf",
      size: 1024 * 1024,
      type: "application/pdf",
      path: "uploads/beispiel.pdf",
      content_id: "mock-content-1",
      created_at: new Date().toISOString(),
      user_id: "test-user-id"
    }
  ],
  
  // Mock-Quellen
  sources: [
    {
      id: "mock-source-1",
      title: "KI-Trends 2025",
      url: "https://example.com/ai-trends",
      author: "Max Mustermann",
      source_type: "article",
      quality: "high",
      content: "KI-Trends für das Jahr 2025...",
      date_published: new Date().toISOString(),
      user_id: "test-user-id"
    }
  ]
};

// Funktion zum Abrufen von Mock-Daten basierend auf dem Endpunkt
export function getMockData(endpoint: string): any {
  // Workflows
  if (endpoint.includes('/workflows')) {
    if (endpoint.includes('/workflows/mock-workflow-1')) {
      return mockData.workflows[0];
    }
    return mockData.workflows;
  }
  
  // Profil
  if (endpoint.includes('/profiles')) {
    return mockData.profile;
  }
  
  // Inhalte
  if (endpoint.includes('/contents')) {
    return mockData.contents;
  }
  
  // Dateien
  if (endpoint.includes('/documents')) {
    return mockData.files;
  }
  
  // Quellen
  if (endpoint.includes('/sources')) {
    return mockData.sources;
  }
  
  // Fallback
  return null;
}
