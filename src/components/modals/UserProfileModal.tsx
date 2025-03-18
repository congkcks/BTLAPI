
import React, { useState } from 'react';
import { User, Edit, LogOut, Settings, ArrowLeft, Camera, Save } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

interface UserProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const profileFormSchema = z.object({
  fullName: z.string().min(2, {
    message: "Tên phải có ít nhất 2 ký tự",
  }),
  email: z.string().email({
    message: "Email không hợp lệ",
  }),
  phone: z.string().optional(),
  bio: z.string().optional(),
});

const accountSettingsSchema = z.object({
  language: z.string(),
  notifications: z.boolean().default(true),
  darkMode: z.boolean().default(false),
  sound: z.boolean().default(true),
});

const UserProfileModal: React.FC<UserProfileModalProps> = ({ open, onOpenChange }) => {
  const [currentView, setCurrentView] = useState<'profile' | 'edit-profile' | 'account-settings'>('profile');
  
  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      fullName: "Nguyen Van A",
      email: "nguyenvana@example.com",
      phone: "0912345678",
      bio: "Học viên CDKAce"
    },
  });

  const accountSettingsForm = useForm<z.infer<typeof accountSettingsSchema>>({
    resolver: zodResolver(accountSettingsSchema),
    defaultValues: {
      language: "vietnamese",
      notifications: true,
      darkMode: false,
      sound: true,
    },
  });

  const onProfileSubmit = (data: z.infer<typeof profileFormSchema>) => {
    console.log(data);
    setCurrentView('profile');
  };

  const onAccountSettingsSubmit = (data: z.infer<typeof accountSettingsSchema>) => {
    console.log(data);
    setCurrentView('profile');
  };

  // Main profile view
  if (currentView === 'profile') {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Thông tin cá nhân</DialogTitle>
          </DialogHeader>
          
          <div className="flex flex-col items-center py-4">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
              <User size={40} className="text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold">Nguyen Van A</h3>
            <p className="text-gray-500">nguyenvana@example.com</p>
            
            <div className="mt-4 w-full">
              <Separator className="my-4" />
              
              <div className="space-y-3 w-full">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setCurrentView('edit-profile')}
                >
                  <Edit size={16} className="mr-2" /> Chỉnh sửa hồ sơ
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setCurrentView('account-settings')}
                >
                  <Settings size={16} className="mr-2" /> Cài đặt tài khoản
                </Button>
                <Button variant="outline" className="w-full justify-start text-engace-red">
                  <LogOut size={16} className="mr-2" /> Đăng xuất
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Edit profile view
  if (currentView === 'edit-profile') {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Button 
                variant="ghost" 
                size="icon" 
                className="mr-2 h-8 w-8" 
                onClick={() => setCurrentView('profile')}
              >
                <ArrowLeft size={16} />
              </Button>
              Chỉnh sửa hồ sơ
            </DialogTitle>
          </DialogHeader>
          
          <Form {...profileForm}>
            <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
              <div className="flex flex-col items-center mb-4">
                <div className="relative">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-gray-200 text-gray-500">
                      <User size={40} />
                    </AvatarFallback>
                  </Avatar>
                  <Button 
                    size="icon" 
                    className="absolute bottom-0 right-0 rounded-full w-8 h-8 bg-engace-purple hover:bg-engace-purple/90"
                  >
                    <Camera size={14} className="text-white" />
                  </Button>
                </div>
              </div>
              
              <FormField
                control={profileForm.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Họ và tên</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập họ và tên" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={profileForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={profileForm.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số điện thoại</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập số điện thoại" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={profileForm.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giới thiệu</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập giới thiệu ngắn" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full bg-engace-purple hover:bg-engace-purple/90">
                <Save size={16} className="mr-2" /> Lưu thay đổi
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    );
  }

  // Account settings view
  if (currentView === 'account-settings') {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Button 
                variant="ghost" 
                size="icon" 
                className="mr-2 h-8 w-8" 
                onClick={() => setCurrentView('profile')}
              >
                <ArrowLeft size={16} />
              </Button>
              Cài đặt tài khoản
            </DialogTitle>
          </DialogHeader>
          
          <Form {...accountSettingsForm}>
            <form onSubmit={accountSettingsForm.handleSubmit(onAccountSettingsSubmit)} className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Cài đặt ngôn ngữ</h3>
                  <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                    <Label htmlFor="language" className="mb-2 block">Ngôn ngữ hiển thị</Label>
                    <select 
                      id="language"
                      className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                      value={accountSettingsForm.watch('language')}
                      onChange={(e) => accountSettingsForm.setValue('language', e.target.value)}
                    >
                      <option value="vietnamese">Tiếng Việt</option>
                      <option value="english">Tiếng Anh</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Bảo mật tài khoản</h3>
                  <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start mb-2"
                    >
                      Đổi mật khẩu
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                    >
                      Thiết lập xác thực 2 lớp
                    </Button>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Thông báo</h3>
                  <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span>Nhận thông báo</span>
                      <input 
                        type="checkbox" 
                        checked={accountSettingsForm.watch('notifications')} 
                        onChange={(e) => accountSettingsForm.setValue('notifications', e.target.checked)}
                        className="h-4 w-4"
                      />
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span>Âm thanh thông báo</span>
                      <input 
                        type="checkbox" 
                        checked={accountSettingsForm.watch('sound')} 
                        onChange={(e) => accountSettingsForm.setValue('sound', e.target.checked)}
                        className="h-4 w-4"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <Button type="submit" className="w-full bg-engace-purple hover:bg-engace-purple/90">
                <Save size={16} className="mr-2" /> Lưu cài đặt
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    );
  }

  return null;
};

export default UserProfileModal;
