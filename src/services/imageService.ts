import { apiService } from './api';

export interface ImageToTextResponse {
    text: string;
    confidence?: number;
    success: boolean;
    message?: string;
}

export const imageService = {
    // Chuyển đổi ảnh thành văn bản
    imageToText: async (imageFile: File): Promise<ImageToTextResponse> => {
        try {
            // Tạo FormData để gửi file ảnh
            const formData = new FormData();
            formData.append('image', imageFile);

            // Sử dụng phương thức postFormData từ apiService
            const result = await apiService.postFormData<ImageToTextResponse>('/api/Image/Ocr', formData);

            // Nếu nhận được văn bản thành công, chỉ loại bỏ dấu sao
            if (result.success && result.text) {
                result.text = imageService.cleanOcrText(result.text);
            }

            return result;
        } catch (error) {
            console.error('Error converting image to text:', error);
            throw error;
        }
    },

    // Xử lý văn bản để loại bỏ dấu sao (*)
    cleanOcrText: (text: string): string => {
        if (!text) return '';

        // Chỉ loại bỏ tất cả dấu sao (*) theo yêu cầu
        return text.replace(/\*/g, '');
    }
};