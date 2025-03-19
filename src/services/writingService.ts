import { apiService } from './api';

export interface WritingSubmission {
  Requirement: string;  // Đổi từ prompt sang Requirement theo API thực tế
  Content: string;      // Đổi từ content sang Content theo API thực tế
  UserLevel?: number;   // Thêm trường UserLevel theo API thực tế
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

export interface WritingDraft extends Omit<WritingSubmission, 'UserLevel'> {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export const writingService = {
  // Submit writing for feedback
  submitWriting: async (submission: WritingSubmission): Promise<WritingFeedback | string> => {
    try {
      // Thiết lập mặc định UserLevel = 1 (Beginner) nếu không được cung cấp
      const completeSubmission = {
        ...submission,
        UserLevel: submission.UserLevel || 1
      };

      // Gọi API với endpoint chính xác
      const response = await fetch(`${apiService.getBaseUrl()}/api/Review/Generate?englishLevel=${completeSubmission.UserLevel}`, {
        method: 'POST',
        headers: apiService.getHeaders(),
        body: JSON.stringify(completeSubmission)
      });

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      // Kiểm tra content-type để xác định cách xử lý phản hồi
      const contentType = response.headers.get('content-type');

      if (contentType && contentType.includes('application/json')) {
        // Nếu là JSON, phân tích nó dưới dạng JSON
        const jsonData = await response.json();
        return jsonData.data || jsonData;
      } else {
        // Nếu không phải JSON, có thể là phản hồi dạng text
        const textData = await response.text();
        return textData;
      }
    } catch (error) {
      console.error('Error submitting writing:', error);
      throw error;
    }
  },

  // Hàm chuyển đổi phản hồi text sang đối tượng WritingFeedback có cấu trúc
  parseMarkdownFeedback: (markdownText: string): WritingFeedback => {
    // Khởi tạo đối tượng WritingFeedback
    const feedback: WritingFeedback = {
      title: "Phản hồi luyện viết",
      points: [],
      sections: []
    };

    // Chia văn bản thành các phần riêng biệt dựa trên tiêu đề
    const sections = markdownText.split(/## \d+\./g).filter(section => section.trim());

    // Xử lý phần Tổng quan (phần đầu tiên)
    if (sections.length > 0) {
      const overviewSection = sections[0];
      const overviewTitle = "1. Tổng quan";
      feedback.title = overviewTitle;

      // Lấy các điểm chính từ phần Tổng quan
      const overviewPoints = overviewSection.split(/\n- /).slice(1);
      feedback.points = overviewPoints.map(point => point.trim());

      // Xử lý các phần còn lại
      const remainingSections = sections.slice(1);
      feedback.sections = remainingSections.map((sectionText, index) => {
        const sectionTitle = `${index + 2}. ${sectionText.split('\n')[0].trim()}`;

        // Tìm các tiểu mục trong phần này
        const subsectionTexts = sectionText.split(/### \d+\.\d+\./g).slice(1);
        const subsections = subsectionTexts.map(subsectionText => {
          const subsectionLines = subsectionText.split('\n').filter(line => line.trim());
          const subsectionTitle = subsectionLines[0].trim();

          // Tìm các câu hỏi và câu trả lời
          const points = [];
          let currentQuestion = '';

          for (let i = 1; i < subsectionLines.length; i++) {
            const line = subsectionLines[i].trim();
            if (line.endsWith('?')) {
              currentQuestion = line;
            } else if (currentQuestion && line) {
              points.push({
                question: currentQuestion,
                answer: line
              });
              currentQuestion = '';
            }
          }

          return {
            title: `2.${index + 1}. ${subsectionTitle}`,
            points
          };
        });

        return {
          title: sectionTitle,
          subsections
        };
      });
    }

    return feedback;
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