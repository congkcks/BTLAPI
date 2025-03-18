
import React, { useState } from 'react';
import { HelpCircle, BookOpen, Lightbulb, Mail, ExternalLink, ArrowLeft, Search } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

interface HelpModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type HelpItemType = {
  icon: React.ReactNode;
  title: string;
  description: string;
  content?: React.ReactNode;
};

const HelpModal: React.FC<HelpModalProps> = ({ open, onOpenChange }) => {
  const [selectedItem, setSelectedItem] = useState<HelpItemType | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const helpItems: HelpItemType[] = [
    {
      icon: <BookOpen size={20} />,
      title: 'Hướng dẫn sử dụng',
      description: 'Tìm hiểu cách sử dụng CDKAce hiệu quả nhất',
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Hướng dẫn sử dụng CDKAce</h3>
          
          <div className="space-y-3">
            <h4 className="font-medium">1. Bắt đầu sử dụng</h4>
            <p>Để bắt đầu sử dụng CDKAce, hãy đăng nhập vào tài khoản của bạn và chọn chức năng bạn muốn sử dụng từ trang chủ.</p>
            
            <h4 className="font-medium">2. Tra cứu từ điển</h4>
            <p>Từ điển CDKAce cung cấp không chỉ nghĩa của từ mà còn cả cách phát âm, ví dụ và ngữ cảnh sử dụng.</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Nhập từ bạn muốn tra cứu vào ô tìm kiếm</li>
              <li>Xem kết quả hiển thị với đầy đủ thông tin</li>
              <li>Lưu từ vựng vào danh sách cá nhân bằng cách nhấn vào biểu tượng dấu sao</li>
              <li>Nghe phát âm bằng cách nhấn vào biểu tượng loa</li>
            </ul>
            
            <h4 className="font-medium">3. Làm bài tập</h4>
            <p>CDKAce cung cấp các bài tập được cá nhân hóa giúp bạn cải thiện vốn từ vựng và kỹ năng ngôn ngữ.</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Chọn chủ đề và số lượng câu hỏi</li>
              <li>Làm bài tập theo hướng dẫn</li>
              <li>Nhận kết quả và giải thích chi tiết</li>
              <li>Theo dõi tiến độ qua thời gian</li>
            </ul>
            
            <h4 className="font-medium">4. Luyện viết</h4>
            <p>Tính năng luyện viết giúp bạn cải thiện kỹ năng viết tiếng Anh thông qua phản hồi chi tiết.</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Chọn chủ đề hoặc nhập chủ đề tùy chỉnh</li>
              <li>Viết bài theo yêu cầu</li>
              <li>Nhận phản hồi chi tiết về ngữ pháp, từ vựng, cấu trúc</li>
              <li>Xem gợi ý cải thiện</li>
            </ul>
            
            <h4 className="font-medium">5. Tương tác với trợ lý ảo</h4>
            <p>Tính năng tư vấn cho phép bạn tương tác với trợ lý ảo để được hỗ trợ học tiếng Anh.</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Đặt câu hỏi về ngữ pháp, từ vựng</li>
              <li>Nhận giải thích chi tiết và ví dụ</li>
              <li>Luyện tập hội thoại</li>
              <li>Nhận gợi ý tài liệu học tập</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      icon: <Lightbulb size={20} />,
      title: 'Mẹo và thủ thuật',
      description: 'Các mẹo học tiếng Anh hiệu quả với CDKAce',
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Mẹo và thủ thuật sử dụng CDKAce</h3>
          
          <div className="space-y-3">
            <h4 className="font-medium">1. Học từ vựng hiệu quả</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Sử dụng tính năng nhắc lại thông minh để ôn tập từ vựng</li>
              <li>Tạo danh sách từ vựng theo chủ đề</li>
              <li>Kết hợp hình ảnh và âm thanh để ghi nhớ tốt hơn</li>
              <li>Thực hành từ vựng mới trong các câu hoàn chỉnh</li>
            </ul>
            
            <h4 className="font-medium">2. Cải thiện kỹ năng viết</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Sử dụng công cụ kiểm tra ngữ pháp trước khi nộp bài</li>
              <li>Học từ những lỗi thường gặp thông qua phản hồi</li>
              <li>Xây dựng ngân hàng cụm từ và câu mẫu</li>
              <li>Thực hành viết đều đặn với các chủ đề khác nhau</li>
            </ul>
            
            <h4 className="font-medium">3. Tối ưu hóa thời gian học</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Thiết lập lịch học tập cá nhân</li>
              <li>Sử dụng tính năng học nhanh trong thời gian rảnh</li>
              <li>Đặt mục tiêu học tập hàng ngày và hàng tuần</li>
              <li>Theo dõi tiến độ và điều chỉnh kế hoạch học tập</li>
            </ul>
            
            <h4 className="font-medium">4. Tùy chỉnh trải nghiệm học tập</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Cá nhân hóa giao diện và cài đặt thông báo</li>
              <li>Điều chỉnh mức độ khó của bài tập</li>
              <li>Tạo thư viện tài liệu học tập cá nhân</li>
              <li>Kết nối với người học khác để trao đổi kinh nghiệm</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      icon: <HelpCircle size={20} />,
      title: 'Câu hỏi thường gặp',
      description: 'Các câu hỏi và giải đáp phổ biến',
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Câu hỏi thường gặp</h3>
          
          <div className="space-y-3">
            <div>
              <h4 className="font-medium">1. Làm thế nào để reset mật khẩu?</h4>
              <p>Bạn có thể reset mật khẩu bằng cách nhấn vào "Quên mật khẩu" ở trang đăng nhập. Một email khôi phục sẽ được gửi đến địa chỉ email đã đăng ký của bạn.</p>
            </div>
            
            <div>
              <h4 className="font-medium">2. CDKAce có phiên bản di động không?</h4>
              <p>Có, CDKAce có phiên bản ứng dụng di động cho cả iOS và Android. Bạn có thể tải về từ App Store hoặc Google Play.</p>
            </div>
            
            <div>
              <h4 className="font-medium">3. Làm thế nào để xuất dữ liệu học tập của tôi?</h4>
              <p>Bạn có thể xuất dữ liệu học tập từ mục "Cài đặt tài khoản" {'>>'} "Dữ liệu cá nhân" {'>>'} "Xuất dữ liệu". Dữ liệu sẽ được xuất dưới dạng file CSV hoặc PDF.</p>
            </div>
            
            <div>
              <h4 className="font-medium">4. Tôi có thể sử dụng CDKAce khi không có kết nối internet không?</h4>
              <p>Có, CDKAce có chế độ ngoại tuyến cho phép bạn tải xuống nội dung và làm bài tập khi không có kết nối internet. Dữ liệu sẽ được đồng bộ khi bạn kết nối lại.</p>
            </div>
            
            <div>
              <h4 className="font-medium">5. Làm thế nào để CDKAce cá nhân hóa bài tập cho tôi?</h4>
              <p>CDKAce sử dụng thuật toán học máy để phân tích mức độ thành thạo và lỗi thường gặp của bạn. Từ đó, hệ thống sẽ tạo ra các bài tập phù hợp giúp bạn cải thiện những điểm yếu.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      icon: <Mail size={20} />,
      title: 'Liên hệ hỗ trợ',
      description: 'Gửi yêu cầu hỗ trợ đến đội ngũ CDKAce',
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Liên hệ hỗ trợ</h3>
          
          <p>Đội ngũ CDKAce luôn sẵn sàng hỗ trợ bạn trong quá trình học tập. Vui lòng liên hệ với chúng tôi nếu bạn gặp bất kỳ vấn đề nào.</p>
          
          <div className="space-y-2">
            <h4 className="font-medium">Kênh hỗ trợ:</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Email:</strong> support@cdkace.com</li>
              <li><strong>Hotline:</strong> 1900-XXX-XXX (8:00 - 22:00)</li>
              <li><strong>Live chat:</strong> Khả dụng trên trang web và ứng dụng</li>
              <li><strong>Diễn đàn:</strong> forum.cdkace.com</li>
            </ul>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium">Gửi yêu cầu hỗ trợ:</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Tiêu đề:</label>
                <Input placeholder="Nhập tiêu đề yêu cầu" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Mô tả vấn đề:</label>
                <textarea 
                  className="w-full p-2 border rounded-md min-h-[100px] dark:bg-gray-700 dark:border-gray-600" 
                  placeholder="Mô tả chi tiết vấn đề bạn đang gặp phải..."
                />
              </div>
              <Button className="w-full bg-engace-purple hover:bg-engace-purple/90">
                Gửi yêu cầu
              </Button>
            </div>
          </div>
          
          <div className="text-sm text-gray-500 mt-3">
            <p>Thời gian phản hồi thông thường: trong vòng 24 giờ làm việc.</p>
          </div>
        </div>
      )
    }
  ];

  const filteredItems = searchQuery 
    ? helpItems.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : helpItems;

  // Detail view
  if (selectedItem) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Button 
                variant="ghost" 
                size="icon" 
                className="mr-2 h-8 w-8" 
                onClick={() => setSelectedItem(null)}
              >
                <ArrowLeft size={16} />
              </Button>
              {selectedItem.title}
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            {selectedItem.content}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Main view
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Trợ giúp</DialogTitle>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm trợ giúp..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {filteredItems.length > 0 ? (
            filteredItems.map((item, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full justify-start p-4 h-auto"
                onClick={() => setSelectedItem(item)}
              >
                <div className="mr-3 text-engace-purple">
                  {item.icon}
                </div>
                <div className="text-left">
                  <h4 className="font-medium">{item.title}</h4>
                  <p className="text-sm text-gray-500">{item.description}</p>
                </div>
                <ExternalLink size={14} className="ml-auto text-gray-400" />
              </Button>
            ))
          ) : (
            <div className="text-center py-8">
              <HelpCircle size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">Không tìm thấy kết quả phù hợp</p>
            </div>
          )}
          
          {!searchQuery && (
            <div className="mt-6 pt-4 border-t text-center">
              <p className="text-sm text-gray-500 mb-2">Phiên bản hiện tại: v1.0.0</p>
              <Button variant="link" className="text-engace-purple">
                Kiểm tra cập nhật
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HelpModal;
