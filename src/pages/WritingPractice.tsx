import React, { useState, useRef } from 'react';
import { Pen, Upload, ArrowLeft, Copy, Loader2, Image, X } from 'lucide-react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { writingService, WritingFeedback, WritingSubmission } from '@/services/writingService';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { imageService } from '@/services/imageService';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';

const WritingPractice: React.FC = () => {
  const navigate = useNavigate();
  const { success, error } = useToast();
  const [showFeedback, setShowFeedback] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requirement, setRequirement] = useState('');
  const [content, setContent] = useState('');
  const [userLevel, setUserLevel] = useState('1'); // Default to Beginner
  const [feedbackData, setFeedbackData] = useState<WritingFeedback | null>(null);
  const [rawFeedback, setRawFeedback] = useState<string | null>(null);

  // State cho chức năng image to text
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [imageFor, setImageFor] = useState<'requirement' | 'content'>('content');
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Chỉ hiển thị đoạn code xử lý phản hồi trong handleSubmitWriting

  const handleSubmitWriting = async () => {
    if (!requirement.trim()) {
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
        Requirement: requirement,
        Content: content,
        UserLevel: parseInt(userLevel)
      };

      // Gọi API để submit bài viết
      const result = await writingService.submitWriting(submission);

      if (typeof result === 'string') {
        // Chỉ loại bỏ dấu sao (*) từ phản hồi
        const cleanedFeedback = result.replace(/\*/g, '');
        setRawFeedback(cleanedFeedback);

        // Thử phân tích cấu trúc feedback từ markdown
        try {
          const parsedFeedback = writingService.parseMarkdownFeedback(cleanedFeedback);
          setFeedbackData(parsedFeedback);
        } catch (parseError) {
          console.error('Error parsing feedback:', parseError);
          // Nếu không thể phân tích, tạo một đối tượng feedback cơ bản
          setFeedbackData({
            title: "Phản hồi luyện viết",
            points: [],
            sections: [{
              title: "Nội dung phản hồi",
              subsections: [{
                title: "Chi tiết",
                points: [{
                  question: "Phản hồi từ hệ thống:",
                  answer: cleanedFeedback
                }]
              }]
            }]
          });
        }
      } else {
        // Nếu kết quả đã là đối tượng có cấu trúc
        setFeedbackData(result as WritingFeedback);
        setRawFeedback(null);
      }

      setIsSubmitting(false);
      success('Đã nhận phản hồi', 'Phản hồi cho bài viết của bạn đã sẵn sàng');
      setShowFeedback(true);

    } catch (err) {
      console.error('Error submitting writing:', err);
      error('Đã xảy ra lỗi', 'Không thể gửi bài viết của bạn');
      setIsSubmitting(false);
    }
  };
  const handleCopyFeedback = () => {
    if (rawFeedback) {
      navigator.clipboard.writeText(rawFeedback)
        .then(() => success('Đã sao chép', 'Nội dung phản hồi đã được sao chép vào clipboard'))
        .catch(() => error('Không thể sao chép', 'Vui lòng thử lại sau'));
      return;
    }

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

  // Hàm xử lý khi người dùng chọn ảnh
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) {
      return;
    }

    const file = files[0];
    // Kiểm tra nếu file là ảnh
    if (!file.type.startsWith('image/')) {
      error('Loại file không hợp lệ', 'Vui lòng chọn file ảnh (JPEG, PNG, etc.)');
      return;
    }

    // Tạo URL tạm thời để hiển thị ảnh preview
    const previewUrl = URL.createObjectURL(file);
    setPreviewImage(previewUrl);
    setSelectedFile(file);
  };

  // Hàm xử lý khi người dùng muốn xóa ảnh đã chọn
  const handleClearImage = () => {
    if (previewImage) {
      URL.revokeObjectURL(previewImage);
    }
    setPreviewImage(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Hàm mở modal chọn ảnh
  const openImageModal = (type: 'requirement' | 'content') => {
    setImageFor(type);
    setIsImageModalOpen(true);
    handleClearImage(); // Xóa ảnh cũ nếu có
  };

  // Hàm xử lý convert ảnh thành text
  const handleProcessImage = async () => {
    if (!selectedFile) {
      error('Chưa có ảnh', 'Vui lòng chọn một ảnh để xử lý');
      return;
    }

    try {
      setIsProcessingImage(true);

      // Gọi API để chuyển đổi ảnh thành text
      const result = await imageService.imageToText(selectedFile);

      if (result.success && result.text) {
        // Văn bản đã được làm sạch trong imageService.imageToText()
        const cleanedText = result.text;

        // Cập nhật nội dung dựa trên loại đã chọn
        if (imageFor === 'requirement') {
          setRequirement(cleanedText);
        } else {
          setContent(cleanedText);
        }

        // Đóng modal và hiển thị thông báo thành công
        setIsImageModalOpen(false);
        success('Chuyển đổi thành công', 'Đã nhập văn bản từ ảnh');
      } else {
        error('Không thể trích xuất văn bản', result.message || 'Hãy thử lại với ảnh khác');
      }
    } catch (err) {
      console.error('Error processing image:', err);
      error('Lỗi xử lý ảnh', 'Không thể chuyển đổi ảnh thành văn bản');
    } finally {
      setIsProcessingImage(false);
    }
  };

  // Hàm hiển thị nội dung markdown đã được làm sạch
  const renderMarkdownContent = (text: string) => {
    // Tách các dòng và định dạng đúng cách
    return text.split('\n').map((line, index) => {
      // Kiểm tra nếu dòng là tiêu đề
      if (line.startsWith('## ')) {
        return (
          <h2 key={index} className="text-2xl font-bold mb-4 mt-6 dark:text-white">
            {line.replace('## ', '')}
          </h2>
        );
      }
      // Kiểm tra nếu dòng là tiêu đề phụ
      else if (line.startsWith('### ')) {
        return (
          <h3 key={index} className="text-xl font-semibold mb-3 mt-4 dark:text-white">
            {line.replace('### ', '')}
          </h3>
        );
      }
      // Kiểm tra nếu dòng là mục danh sách
      else if (line.startsWith('- ')) {
        return <li key={index} className="ml-6 mb-2 dark:text-gray-200">{line.substring(2)}</li>;
      }
      // Kiểm tra nếu dòng là khoảng trống
      else if (line.trim() === '') {
        return <div key={index} className="h-2"></div>;
      }
      // Đoạn văn bản thông thường
      else {
        return <p key={index} className="mb-2 dark:text-gray-300">{line}</p>;
      }
    });
  };

  const englishLevels = [
    { value: '1', label: 'Beginner (A1-A2)' },
    { value: '2', label: 'Intermediate (B1-B2)' },
    { value: '3', label: 'Advanced (C1-C2)' }
  ];

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
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-gray-700 dark:text-gray-300 font-medium">Đề bài</label>
                    <Button
                      variant="outline"
                      className="flex items-center gap-1 text-sm dark:border-gray-600 dark:text-gray-300"
                      onClick={() => openImageModal('requirement')}
                    >
                      <Image size={15} />
                      Nhập từ ảnh
                    </Button>
                  </div>
                  <Textarea
                    placeholder="Nhập đề bài hoặc yêu cầu bạn cần viết..."
                    className="text-lg py-3 min-h-24 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    value={requirement}
                    onChange={(e) => setRequirement(e.target.value)}
                  />
                </div>

                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-gray-700 dark:text-gray-300 font-medium">Bài viết của bạn</label>
                    <Button
                      variant="outline"
                      className="flex items-center gap-1 text-sm dark:border-gray-600 dark:text-gray-300"
                      onClick={() => openImageModal('content')}
                    >
                      <Image size={15} />
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

                <div>
                  <Label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">Trình độ của bạn</Label>
                  <Select value={userLevel} onValueChange={setUserLevel}>
                    <SelectTrigger className="dark:bg-gray-700 dark:text-white dark:border-gray-600">
                      <SelectValue placeholder="Chọn trình độ tiếng Anh" />
                    </SelectTrigger>
                    <SelectContent>
                      {englishLevels.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
              {rawFeedback ? (
                // Hiển thị phản hồi dạng văn bản thuần túy
                <div className="prose dark:prose-invert max-w-none">
                  {renderMarkdownContent(rawFeedback)}
                </div>
              ) : feedbackData ? (
                // Hiển thị phản hồi có cấu trúc
                <>
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
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">Không có dữ liệu phản hồi.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Modal nhập từ ảnh */}
      <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {imageFor === 'requirement' ? 'Nhập đề bài từ ảnh' : 'Nhập nội dung từ ảnh'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {!previewImage ? (
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-12">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="mb-2"
                >
                  <Upload size={16} className="mr-2" />
                  Chọn ảnh
                </Button>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  Hỗ trợ JPG, PNG, JPEG, GIF
                </p>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={previewImage}
                  alt="Preview"
                  className="w-full h-auto rounded-lg max-h-80 object-contain"
                />
                <Button
                  size="icon"
                  variant="destructive"
                  className="absolute top-2 right-2 rounded-full h-8 w-8"
                  onClick={handleClearImage}
                >
                  <X size={16} />
                </Button>
              </div>
            )}
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" disabled={isProcessingImage}>
                Hủy
              </Button>
            </DialogClose>
            <Button
              onClick={handleProcessImage}
              disabled={!selectedFile || isProcessingImage}
              className="bg-engace-green hover:bg-engace-green/90"
            >
              {isProcessingImage ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                'Chuyển đổi'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WritingPractice;