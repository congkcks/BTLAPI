
import React, { useState } from 'react';
import { Pen, Upload, ArrowLeft, Copy, Loader2 } from 'lucide-react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { writingService, WritingFeedback, WritingSubmission } from '@/services/writingService';

const WritingPractice: React.FC = () => {
  const navigate = useNavigate();
  const { success, error } = useToast();
  const [showFeedback, setShowFeedback] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [content, setContent] = useState('');
  const [feedbackData, setFeedbackData] = useState<WritingFeedback | null>(null);
  
  const handleSubmitWriting = async () => {
    if (!prompt.trim()) {
      error('Vui lòng nhập đề bài', 'Đề bài không được để trống');
      return;
    }
    
    if (!content.trim()) {
      error('Vui lòng nhập nội dung bài viết', 'Nội dung bài viết không được để trống');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const submission: WritingSubmission = {
        prompt: prompt,
        content: content
      };
      
      // In a real-world scenario with actual API:
      // const result = await writingService.submitWriting(submission);
      // setFeedbackData(result);
      
      // Mock response for development
      setTimeout(() => {
        const mockFeedback: WritingFeedback = {
          title: "1. Tổng quan",
          points: [
            "Bài viết của bạn là một đoạn văn ngắn gọn giới thiệu về gia đình và tầm quan trọng của gia đình đối với bạn.",
            "Nhìn chung, bài viết đã đáp ứng được yêu cầu đề bài ở mức độ cơ bản, thể hiện được tình cảm và sự trân trọng của bạn dành cho gia đình.",
            "Điểm mạnh nổi bật là bạn đã diễn đạt được ý chính một cách rõ ràng và mạch lạc, sử dụng từ vựng phù hợp với trình độ hiện tại.",
            "Tuy nhiên, để bài viết trở nên tốt hơn, bạn cần chú ý hơn đến việc sử dụng cấu trúc câu đơn giản và tự nhiên hơn, cũng như mở rộng vốn từ vựng cơ bản về chủ đề gia đình."
          ],
          sections: [
            {
              title: "2. Phân tích chi tiết",
              subsections: [
                {
                  title: "2.1. Mức độ hoàn thành yêu cầu đề bài",
                  points: [
                    {
                      question: "Bài viết có bám sát đề bài không?",
                      answer: "Có, bài viết bám sát đề bài \"gia đình\" bằng cách giới thiệu về gia đình bạn và những giá trị mà gia đình mang lại."
                    },
                    {
                      question: "Nội dung có đủ ý, phát triển tốt không?",
                      answer: "Nội dung ở mức độ cơ bản là đủ ý. Bạn đã đề cập đến tình yêu thương, sự hỗ trợ, sự khuyến khích từ cha mẹ và vai trò của anh chị em. Tuy nhiên, ở trình độ Beginner, bài viết có thể tập trung vào những khía cạnh đơn giản và cụ thể hơn về gia đình, ví dụ như các thành viên trong gia đình, hoạt động gia đình thường ngày."
                    },
                    {
                      question: "Các lập luận có thuyết phục, rõ ràng và có dẫn chứng phù hợp không?",
                      answer: "Vì đây là bài viết giới thiệu về gia đình nên không yêu cầu lập luận phức tạp. Các ý tưởng được trình bày rõ ràng và dễ hiểu, phù hợp với trình độ Beginner."
                    }
                  ]
                }
              ]
            }
          ]
        };
        
        setFeedbackData(mockFeedback);
        setIsSubmitting(false);
        success('Đã nhận phản hồi', 'Phản hồi cho bài viết của bạn đã sẵn sàng');
        setShowFeedback(true);
      }, 2000);
      
    } catch (err) {
      console.error('Error submitting writing:', err);
      error('Đã xảy ra lỗi', 'Không thể gửi bài viết của bạn');
      setIsSubmitting(false);
    }
  };

  const handleCopyFeedback = () => {
    if (!feedbackData) return;
    
    let feedbackText = `${feedbackData.title}\n\n`;
    
    feedbackData.points.forEach(point => {
      feedbackText += `- ${point}\n`;
    });
    
    feedbackData.sections.forEach(section => {
      feedbackText += `\n${section.title}\n`;
      
      section.subsections.forEach(subsection => {
        feedbackText += `\n${subsection.title}\n`;
        
        subsection.points.forEach(point => {
          feedbackText += `\n${point.question}\n${point.answer}\n`;
        });
      });
    });
    
    navigator.clipboard.writeText(feedbackText)
      .then(() => success('Đã sao chép', 'Nội dung phản hồi đã được sao chép vào clipboard'))
      .catch(() => error('Không thể sao chép', 'Vui lòng thử lại sau'));
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <Header />
      <main className="flex-1 container max-w-screen-xl mx-auto py-8 px-4 animate-fade-in">
        {!showFeedback ? (
          // Writing submission form
          <>
            <div className="flex justify-center mb-8">
              <div className="w-24 h-24 bg-engace-green rounded-2xl flex items-center justify-center">
                <Pen size={48} color="white" />
              </div>
            </div>
            
            <h1 className="text-4xl font-bold text-center mb-2 dark:text-white">LUYỆN VIẾT</h1>
            <p className="text-center text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              Nhận phản hồi chi tiết để nâng cao kỹ năng viết tiếng Anh của bạn.
            </p>
            
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <div className="mb-6">
                  <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">Đề bài</label>
                  <Textarea 
                    placeholder="Nhập đề bài hoặc yêu cầu bạn cần viết..." 
                    className="text-lg py-3 min-h-24 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                  />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-gray-700 dark:text-gray-300 font-medium">Bài viết của bạn</label>
                    <Button variant="outline" className="flex items-center gap-1 text-sm dark:border-gray-600 dark:text-gray-300">
                      <Upload size={15} />
                      Nhập từ ảnh
                    </Button>
                  </div>
                  <Textarea 
                    placeholder="Nhập nội dung bài viết của bạn ở đây..." 
                    className="text-lg py-3 min-h-48 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                </div>
              </div>
              
              <Button 
                className="w-full py-6 bg-engace-green hover:bg-engace-green/90 rounded-xl flex items-center justify-center gap-2 text-lg"
                onClick={handleSubmitWriting}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  'Nhận phản hồi'
                )}
              </Button>
            </div>
          </>
        ) : (
          // Feedback display
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <Button 
                variant="outline" 
                className="flex items-center gap-2 dark:bg-gray-800 dark:text-white dark:border-gray-700"
                onClick={() => setShowFeedback(false)}
              >
                <ArrowLeft size={18} />
                Quay lại
              </Button>
              <Button 
                variant="outline" 
                className="flex items-center gap-2 dark:bg-gray-800 dark:text-white dark:border-gray-700"
                onClick={handleCopyFeedback}
              >
                <Copy size={18} />
                Sao chép
              </Button>
            </div>
            
            {feedbackData && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
                <h2 className="text-2xl font-bold mb-6 dark:text-white">{feedbackData.title}</h2>
                
                <ul className="list-disc pl-6 space-y-4 mb-8">
                  {feedbackData.points.map((point, index) => (
                    <li key={index} className="text-gray-800 dark:text-gray-200">{point}</li>
                  ))}
                </ul>
                
                {feedbackData.sections.map((section, sectionIndex) => (
                  <div key={sectionIndex} className="mb-8">
                    <h2 className="text-2xl font-bold mb-6 dark:text-white">{section.title}</h2>
                    
                    {section.subsections.map((subsection, subsectionIndex) => (
                      <div key={subsectionIndex} className="mb-6">
                        <h3 className="text-xl font-semibold mb-4 dark:text-white">{subsection.title}</h3>
                        
                        {subsection.points.map((point, pointIndex) => (
                          <div key={pointIndex} className="mb-4">
                            <p className="font-bold text-gray-800 dark:text-gray-200 mb-2">{point.question}</p>
                            <p className="text-gray-700 dark:text-gray-300">{point.answer}</p>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default WritingPractice;
