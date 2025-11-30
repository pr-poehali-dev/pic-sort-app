import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Settings {
  showVideoFiles: boolean;
  showFileNames: boolean;
  sortBy: 'name' | 'date' | 'path';
  sortOrder: 'asc' | 'desc';
  swipeUpFolder: string;
  swipeDownFolder: string;
  slideshowDuration: number;
}

interface SettingsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  settings: Settings;
  onSettingsChange: (settings: Settings) => void;
}

export const SettingsSheet = ({
  open,
  onOpenChange,
  settings,
  onSettingsChange,
}: SettingsSheetProps) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Настройки</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-8rem)] mt-6">
          <div className="space-y-6 pr-4">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Отображение</h3>
              <div className="flex items-center justify-between">
                <Label htmlFor="show-video">Показывать видео</Label>
                <Switch
                  id="show-video"
                  checked={settings.showVideoFiles}
                  onCheckedChange={(checked) =>
                    onSettingsChange({ ...settings, showVideoFiles: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="show-names">Показывать имена файлов</Label>
                <Switch
                  id="show-names"
                  checked={settings.showFileNames}
                  onCheckedChange={(checked) =>
                    onSettingsChange({ ...settings, showFileNames: checked })
                  }
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Сортировка</h3>
              <div className="space-y-2">
                <Label>Сортировать по</Label>
                <Select
                  value={settings.sortBy}
                  onValueChange={(value: any) =>
                    onSettingsChange({ ...settings, sortBy: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Имени</SelectItem>
                    <SelectItem value="date">Дате</SelectItem>
                    <SelectItem value="path">Пути</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Порядок</Label>
                <Select
                  value={settings.sortOrder}
                  onValueChange={(value: any) =>
                    onSettingsChange({ ...settings, sortOrder: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asc">По возрастанию</SelectItem>
                    <SelectItem value="desc">По убыванию</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Быстрое перемещение</h3>
              <div className="space-y-2">
                <Label>Папка для свайпа вверх</Label>
                <Select
                  value={settings.swipeUpFolder}
                  onValueChange={(value) =>
                    onSettingsChange({ ...settings, swipeUpFolder: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Best">Best</SelectItem>
                    <SelectItem value="Favorites">Favorites</SelectItem>
                    <SelectItem value="Archive">Archive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Папка для свайпа вниз</Label>
                <Select
                  value={settings.swipeDownFolder}
                  onValueChange={(value) =>
                    onSettingsChange({ ...settings, swipeDownFolder: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Bad">Bad</SelectItem>
                    <SelectItem value="Delete">Delete</SelectItem>
                    <SelectItem value="Trash">Trash</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Слайдшоу</h3>
              <div className="space-y-2">
                <Label>Длительность показа (сек)</Label>
                <Select
                  value={String(settings.slideshowDuration)}
                  onValueChange={(value) =>
                    onSettingsChange({ ...settings, slideshowDuration: Number(value) })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2 секунды</SelectItem>
                    <SelectItem value="3">3 секунды</SelectItem>
                    <SelectItem value="5">5 секунд</SelectItem>
                    <SelectItem value="10">10 секунд</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
