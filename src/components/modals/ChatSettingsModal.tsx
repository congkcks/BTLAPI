import React, { useState, useEffect } from 'react';
import { Save, Settings, X } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { userSettingsService, UserSettings, englishLevelMap } from '@/services/userSettingsService';
import { useToast } from '@/hooks/use-toast';

interface ChatSettingsModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave?: (settings: UserSettings) => void;
}

const ChatSettingsModal: React.FC<ChatSettingsModalProps> = ({
    open,
    onOpenChange,
    onSave
}) => {
    const { toast } = useToast();
    const [settings, setSettings] = useState<UserSettings>(userSettingsService.loadSettings());

    useEffect(() => {
        if (open) {
            // Reload settings when modal opens
            setSettings(userSettingsService.loadSettings());
        }
    }, [open]);

    const handleSave = () => {
        try {
            // Validate inputs
            if (!settings.username.trim()) {
                toast({
                    title: "Lỗi",
                    description: "Vui lòng nhập tên người dùng",
                    variant: "destructive"
                });
                return;
            }

            if (settings.age <= 0 || settings.age > 120) {
                toast({
                    title: "Lỗi",
                    description: "Vui lòng nhập tuổi hợp lệ (1-120)",
                    variant: "destructive"
                });
                return;
            }

            // Save settings
            userSettingsService.saveSettings(settings);

            toast({
                title: "Thành công",
                description: "Đã lưu cài đặt người dùng",
            });

            // Call onSave callback if provided
            if (onSave) {
                onSave(settings);
            }

            onOpenChange(false);
        } catch (err) {
            console.error('Error saving settings:', err);
            toast({
                title: "Lỗi",
                description: "Không thể lưu cài đặt người dùng",
                variant: "destructive"
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Settings size={18} />
                        Cài đặt người dùng
                    </DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="username" className="text-right">
                            Tên hiển thị
                        </Label>
                        <Input
                            id="username"
                            className="col-span-3"
                            value={settings.username}
                            onChange={(e) => setSettings({ ...settings, username: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="gender" className="text-right">
                            Giới tính
                        </Label>
                        <Select
                            value={settings.gender}
                            onValueChange={(value) => setSettings({ ...settings, gender: value })}
                        >
                            <SelectTrigger id="gender" className="col-span-3">
                                <SelectValue placeholder="Chọn giới tính" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Nam">Nam</SelectItem>
                                <SelectItem value="Nữ">Nữ</SelectItem>
                                <SelectItem value="Khác">Khác</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="age" className="text-right">
                            Tuổi
                        </Label>
                        <Input
                            id="age"
                            type="number"
                            className="col-span-3"
                            value={settings.age}
                            onChange={(e) => setSettings({ ...settings, age: parseInt(e.target.value) || 0 })}
                            min="1"
                            max="120"
                        />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="englishLevel" className="text-right">
                            Trình độ
                        </Label>
                        <Select
                            value={settings.englishLevel.toString()}
                            onValueChange={(value) => setSettings({ ...settings, englishLevel: parseInt(value) })}
                        >
                            <SelectTrigger id="englishLevel" className="col-span-3">
                                <SelectValue placeholder="Chọn trình độ tiếng Anh" />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.entries(englishLevelMap).map(([level, label]) => (
                                    <SelectItem key={level} value={level}>
                                        {label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="reasoning" className="text-right">
                            Suy luận sâu
                        </Label>
                        <div className="flex items-center space-x-2 col-span-3">
                            <Switch
                                id="reasoning"
                                checked={settings.enableReasoning}
                                onCheckedChange={(checked) => setSettings({ ...settings, enableReasoning: checked })}
                            />
                            <Label htmlFor="reasoning" className="text-sm text-gray-500">
                                Cho phép trí tuệ nhân tạo thực hiện suy luận sâu hơn
                            </Label>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="searching" className="text-right">
                            Tìm kiếm web
                        </Label>
                        <div className="flex items-center space-x-2 col-span-3">
                            <Switch
                                id="searching"
                                checked={settings.enableSearching}
                                onCheckedChange={(checked) => setSettings({ ...settings, enableSearching: checked })}
                            />
                            <Label htmlFor="searching" className="text-sm text-gray-500">
                                Cho phép trí tuệ nhân tạo tìm kiếm thông tin trên web
                            </Label>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        <X className="mr-2 h-4 w-4" />
                        Hủy
                    </Button>
                    <Button onClick={handleSave} className="bg-engace-orange hover:bg-engace-orange/90">
                        <Save className="mr-2 h-4 w-4" />
                        Lưu cài đặt
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ChatSettingsModal;