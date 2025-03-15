// src/services/contentService.ts
import { API } from '@/services/apiService';
import { toast } from 'sonner';

export interface Content {
  id: string;
  title: string;
  description: string | null;
  type: 'blog' | 'linkedin';
  content: string | null;
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
  user_id: string;
  current_stage?: string;
}

export interface ContentCreateInput {
  title: string;
  description?: string;
  type: 'blog' | 'linkedin';
  content?: string;
  styleId?: string;
}

export interface ContentUpdateInput {
  title?: string;
  description?: string;
  content?: string;
  status?: 'draft' | 'published';
}

/**
 * Get all content for the current user
 */
export const getUserContents = async (): Promise<Content[]> => {
  try {
    // Get workflows from the API
    const workflows = await API.workflows.list();
    
    // Map workflows to content structure
    return workflows.map((workflow: any) => {
      // Extract content from workflow data
      let content = '';
      const stages = workflow.stages || {};
      
      // Try to get content from various stages based on priority
      if (stages.seo_optimization?.data?.article) {
        content = stages.seo_optimization.data.article;
      } else if (stages.editing?.data?.article) {
        content = stages.editing.data.article;
      } else if (stages.writing?.data?.article) {
        content = stages.writing.data.article;
      } else if (typeof stages.writing?.data === 'string') {
        content = stages.writing.data;
      }
      
      // Determine content type from metadata
      const contentType = workflow.metadata?.content_type || 'blog';
      
      // Determine status
      const status = workflow.current_stage === 'social_media' ? 'published' : 'draft';
      
      return {
        id: workflow.id,
        title: workflow.topic,
        description: workflow.metadata?.description || null,
        type: contentType as 'blog' | 'linkedin',
        content: content || null,
        status: status,
        created_at: workflow.created_at,
        updated_at: workflow.updated_at,
        user_id: workflow.user_id,
        current_stage: workflow.current_stage
      };
    });
  } catch (error: any) {
    toast.error(error.message || 'Fehler beim Laden der Inhalte');
    console.error('Error fetching contents:', error);
    return [];
  }
};

/**
 * Get content by ID
 */
export const getContentById = async (id: string): Promise<Content | null> => {
  try {
    // Get workflow from the API
    const workflow = await API.workflows.get(id);
    
    if (!workflow) {
      return null;
    }
    
    // Extract content from workflow data
    let content = '';
    const stages = workflow.stages || {};
    
    // Try to get content from various stages based on priority
    if (stages.seo_optimization?.data?.article) {
      content = stages.seo_optimization.data.article;
    } else if (stages.editing?.data?.article) {
      content = stages.editing.data.article;
    } else if (stages.writing?.data?.article) {
      content = stages.writing.data.article;
    } else if (typeof stages.writing?.data === 'string') {
      content = stages.writing.data;
    }
    
    // Determine content type from metadata
    const contentType = workflow.metadata?.content_type || 'blog';
    
    // Determine status
    const status = workflow.current_stage === 'social_media' ? 'published' : 'draft';
    
    return {
      id: workflow.id,
      title: workflow.topic,
      description: workflow.metadata?.description || null,
      type: contentType as 'blog' | 'linkedin',
      content: content || null,
      status: status,
      created_at: workflow.created_at,
      updated_at: workflow.updated_at,
      user_id: workflow.user_id,
      current_stage: workflow.current_stage
    };
  } catch (error: any) {
    toast.error(error.message || 'Fehler beim Laden des Inhalts');
    console.error('Error fetching content by id:', error);
    return null;
  }
};

/**
 * Create new content through workflow API
 */
export const createContent = async (input: ContentCreateInput): Promise<Content | null> => {
  try {
    // Create workflow
    const workflowData = {
      topic: input.title,
      metadata: {
        description: input.description,
        content_type: input.type,
        style_id: input.styleId
      }
    };
    
    const workflow = await API.workflows.create(workflowData);
    
    // Start first stage (style_analysis) automatically
    try {
      await API.workflows.startStage(workflow.id, 'style_analysis');
    } catch (stageError) {
      console.error('Error starting initial stage:', stageError);
      // Continue even if stage start fails
    }
    
    toast.success('Inhalt erfolgreich erstellt');
    
    // Format as content
    return {
      id: workflow.id,
      title: workflow.topic,
      description: workflow.metadata?.description || null,
      type: input.type,
      content: input.content || null,
      status: 'draft',
      created_at: workflow.created_at,
      updated_at: workflow.updated_at,
      user_id: workflow.user_id,
      current_stage: workflow.current_stage
    };
  } catch (error: any) {
    toast.error(error.message || 'Fehler beim Erstellen des Inhalts');
    console.error('Error creating content:', error);
    return null;
  }
};

/**
 * Update content
 */
export const updateContent = async (id: string, input: ContentUpdateInput): Promise<Content | null> => {
  try {
    // Get current workflow
    const workflow = await API.workflows.get(id);
    
    if (!workflow) {
      throw new Error('Workflow not found');
    }
    
    // Determine current stage
    const currentStage = workflow.current_stage || 'writing';
    
    // Update workflow metadata if needed
    if (input.title || input.description) {
      const workflowUpdate: any = {};
      
      if (input.title) {
        workflowUpdate.topic = input.title;
      }
      
      if (input.description) {
        workflowUpdate.metadata = {
          ...workflow.metadata,
          description: input.description
        };
      }
      
      // Update workflow
      await API.workflows.update(id, workflowUpdate);
    }
    
    // Update content if provided
    if (input.content) {
      // Determine which agent to use based on current stage
      if (currentStage === 'editing' || currentStage === 'fact_checking') {
        await API.agents.edit(input.content);
      } else if (currentStage === 'seo_optimization') {
        await API.agents.seoOptimize(input.content, workflow.topic || '');
      } else {
        // Default to writing stage
        const stages = workflow.stages || {};
        const researchData = stages.research?.data || '';
        const contentPlan = stages.planning?.data || '';
        const styleProfile = stages.style_analysis?.data || '';
        
        await API.agents.write(
          workflow.topic || '',
          typeof contentPlan === 'string' ? contentPlan : JSON.stringify(contentPlan),
          typeof researchData === 'string' ? researchData : JSON.stringify(researchData),
          typeof styleProfile === 'string' ? styleProfile : JSON.stringify(styleProfile)
        );
      }
    }
    
    // Update status if needed
    if (input.status === 'published' && workflow.current_stage !== 'social_media') {
      // Move to social media stage
      await API.workflows.startStage(id, 'social_media');
    }
    
    // Get updated content
    return await getContentById(id);
  } catch (error: any) {
    toast.error(error.message || 'Fehler beim Aktualisieren des Inhalts');
    console.error('Error updating content:', error);
    return null;
  }
};

/**
 * Delete content
 */
export const deleteContent = async (id: string): Promise<boolean> => {
  try {
    // Delete workflow
    await API.workflows.deleteWorkflow(id);
    
    toast.success('Inhalt erfolgreich gelöscht');
    return true;
  } catch (error: any) {
    toast.error(error.message || 'Fehler beim Löschen des Inhalts');
    console.error('Error deleting content:', error);
    return false;
  }
};

/**
 * Get workflow progress percentage based on current stage
 */
export const getWorkflowProgress = (currentStage: string | undefined, contentType: 'blog' | 'linkedin'): number => {
  const blogStages = [
    'style_analysis',
    'research',
    'planning',
    'writing',
    'fact_checking',
    'editing',
    'seo_optimization',
    'social_media'
  ];
  
  const linkedinStages = [
    'style_analysis',
    'planning',
    'writing',
    'editing',
    'social_media'
  ];
  
  const stages = contentType === 'blog' ? blogStages : linkedinStages;
  
  if (!currentStage) {
    return 0;
  }
  
  const currentIndex = stages.indexOf(currentStage);
  
  if (currentIndex === -1) {
    return 0;
  }
  
  // Calculate progress percentage based on stage index
  return Math.round(((currentIndex + 1) / stages.length) * 100);
};
