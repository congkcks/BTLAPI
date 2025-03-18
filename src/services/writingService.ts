
import { apiService } from './api';

export interface WritingSubmission {
  prompt: string;
  content: string;
}

export interface WritingFeedback {
  title: string;
  points: string[];
  sections: {
    title: string;
    subsections: {
      title: string;
      points: {
        question: string;
        answer: string;
      }[];
    }[];
  }[];
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  status: number;
  success: boolean;
}

export interface WritingDraft extends WritingSubmission {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export const writingService = {
  // Submit writing for feedback
  submitWriting: async (submission: WritingSubmission): Promise<WritingFeedback> => {
    try {
      // Get the raw response first
      const response = await fetch(`${apiService.getBaseUrl()}/api/Writing/Feedback`, {
        method: 'POST',
        headers: apiService.getHeaders(),
        body: JSON.stringify(submission)
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      // Check the content type to determine how to process the response
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        // If it's JSON, parse it as JSON
        const jsonData = await response.json();
        return jsonData.data || jsonData;
      } else {
        // If it's not JSON, throw an error since we expect a WritingFeedback object
        throw new Error('Unexpected response format');
      }
    } catch (error) {
      console.error('Error submitting writing:', error);
      throw error;
    }
  },
  
  // Get writing history
  getWritingHistory: async (): Promise<WritingSubmission[]> => {
    try {
      const response = await apiService.get<ApiResponse<WritingSubmission[]>>('/api/Writing/History');
      return (response as ApiResponse<WritingSubmission[]>).data || [];
    } catch (error) {
      console.error('Error fetching writing history:', error);
      throw error;
    }
  },
  
  // Save draft
  saveDraft: async (submission: WritingSubmission): Promise<{ id: string }> => {
    try {
      const response = await apiService.post<ApiResponse<{ id: string }>>(
        '/api/Writing/Drafts', 
        submission
      );
      return (response as ApiResponse<{ id: string }>).data || { id: '' };
    } catch (error) {
      console.error('Error saving draft:', error);
      throw error;
    }
  },
  
  // Get drafts
  getDrafts: async (): Promise<WritingDraft[]> => {
    try {
      const response = await apiService.get<ApiResponse<WritingDraft[]>>('/api/Writing/Drafts');
      return (response as ApiResponse<WritingDraft[]>).data || [];
    } catch (error) {
      console.error('Error fetching drafts:', error);
      throw error;
    }
  },
  
  // Get draft by ID
  getDraftById: async (draftId: string): Promise<WritingDraft> => {
    try {
      const response = await apiService.get<ApiResponse<WritingDraft>>(`/api/Writing/Drafts/${draftId}`);
      return (response as ApiResponse<WritingDraft>).data;
    } catch (error) {
      console.error('Error fetching draft:', error);
      throw error;
    }
  },
  
  // Update draft
  updateDraft: async (draftId: string, submission: WritingSubmission): Promise<WritingDraft> => {
    try {
      const response = await apiService.put<ApiResponse<WritingDraft>>(
        `/api/Writing/Drafts/${draftId}`, 
        submission
      );
      return (response as ApiResponse<WritingDraft>).data;
    } catch (error) {
      console.error('Error updating draft:', error);
      throw error;
    }
  },
  
  // Delete draft
  deleteDraft: async (draftId: string): Promise<{ success: boolean }> => {
    try {
      const response = await apiService.delete<ApiResponse<{ success: boolean }>>(
        `/api/Writing/Drafts/${draftId}`
      );
      return (response as ApiResponse<{ success: boolean }>).data || { success: true };
    } catch (error) {
      console.error('Error deleting draft:', error);
      throw error;
    }
  }
};
