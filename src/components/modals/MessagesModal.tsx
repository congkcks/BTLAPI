
import React from 'react';
import { MessageCircle, Star } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface MessagesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MessagesModal: React.FC<MessagesModalProps> = ({ open, onOpenChange }) => {
  const messages = [
    {
      id: 1,
      title: 'Học phần đã hoàn thành',
      description: 'Chúc mừng! Bạn đã hoàn thành học phần "Từ vựng về du lịch"',
      time: '1 giờ trước',
      isUnread: true
    },
    {
      id: 2,
      title: 'Lời nhắc ôn tập',
      description: 'Đã 3 ngày bạn chưa ôn tập các từ đã lưu. Hãy ôn tập để ghi nhớ tốt hơn!',
      time: '3 giờ trước',
      isUnread: true
    },
    {
      id: 3,
      title: 'Cập nhật tính năng mới',
      description: 'EngAce vừa cập nhật tính năng luyện phát âm mới. Hãy thử ngay!',
      time: 'Hôm qua',
      isUnread: false
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Thông báo</DialogTitle>
        </DialogHeader>
        
        <div className="py-2 max-h-[400px] overflow-y-auto">
          {messages.length > 0 ? (
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className="relative">
                  <div className={`p-3 rounded-lg ${message.isUnread ? 'bg-blue-50' : 'bg-gray-50'}`}>
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">{message.title}</h4>
                      {message.isUnread && (
                        <div className="w-2 h-2 rounded-full bg-engace-blue"></div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{message.description}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-gray-500">{message.time}</span>
                      <Button variant="ghost" size="sm" className="h-6 px-2">
                        <Star size={14} className="text-gray-400" />
                      </Button>
                    </div>
                  </div>
                  {message.id !== messages.length && <Separator className="my-2" />}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8">
              <MessageCircle size={40} className="text-gray-300 mb-2" />
              <p className="text-gray-500">Không có thông báo mới</p>
            </div>
          )}
        </div>
        
        <div className="flex justify-center mt-2">
          <Button variant="outline" size="sm">Đánh dấu tất cả là đã đọc</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MessagesModal;
