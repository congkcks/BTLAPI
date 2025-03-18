
import React from 'react';
import { BookText, GraduationCap, Pen, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import FeatureCard from '@/components/FeatureCard';

const Index: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: "TỪ ĐIỂN",
      subtitle: "Tra cứu thông minh",
      description: "Truy cập định nghĩa từ, thành ngữ và cụm động từ với ngữ cảnh của từ.",
      icon: <BookText size={32} color="white" />,
      iconBg: "bg-engace-blue",
      delay: 100,
      onClick: () => navigate('/dictionary')
    },
    {
      title: "BÀI TẬP",
      subtitle: "Bài tập cá nhân hóa",
      description: "Luyện tập với các bài kiểm tra được điều chỉnh theo trình độ và sở thích của bạn.",
      icon: <GraduationCap size={32} color="white" />,
      iconBg: "bg-engace-pink",
      delay: 200,
      onClick: () => navigate('/exercises')
    },
    {
      title: "LUYỆN VIẾT",
      subtitle: "Thực hành viết",
      description: "Nhận phản hồi và gợi ý ngay lập tức để cải thiện kỹ năng viết tiếng Anh.",
      icon: <Pen size={32} color="white" />,
      iconBg: "bg-engace-green",
      delay: 300,
      onClick: () => navigate('/writing')
    },
    {
      title: "TƯ VẤN",
      subtitle: "Trò chuyện với gia sư ảo",
      description: "Tương tác với gia sư AI để được hướng dẫn và hỗ trợ tự học tiếng Anh.",
      icon: <MessageSquare size={32} color="white" />,
      iconBg: "bg-engace-orange",
      delay: 400,
      onClick: () => navigate('/consultation')
    }
  ];

  return (
    <div className="min-h-screen flex flex-col dark:bg-gray-900">
      <Header />
      <main className="flex-1 container max-w-screen-xl mx-auto py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index}
              title={feature.title}
              subtitle={feature.subtitle}
              description={feature.description}
              icon={feature.icon}
              iconBg={feature.iconBg}
              delay={feature.delay}
              onClick={feature.onClick}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Index;
