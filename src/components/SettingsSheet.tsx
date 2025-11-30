import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Settings {
  scanFolders: string[];
  ignoreFolders: string[];
  showVideoFiles: boolean;
  showFileNames: boolean;
  defaultSortBy: 'name' | 'date' | 'path';
  defaultSortOrder: 'asc' | 'desc';
  checkerboardAlpha: boolean;
  swipeUpFolder: string;
  swipeDownFolder: string;
  screenOrientation: 'system' | 'sensor' | 'image-size';
  slideshowDuration: number;
  slideshowAnimation: 'fade' | 'slide' | 'zoom' | 'none';
  slideshowLoop: boolean;
  slideshowRandom: boolean;
  slideshowMaxBrightness: boolean;
  cacheFullscreen: boolean;
  videoPlayer: string;
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
              <h3 className="text-sm font-medium">Сканирование папок</h3>
              <div className="space-y-2">
                <Label>Папки для сканирования</Label>
                <Input
                  value={settings.scanFolders.join(', ')}
                  onChange={(e) =>
                    onSettingsChange({
                      ...settings,
                      scanFolders: e.target.value.split(',').map(s => s.trim()),
                    })
                  }
                  placeholder="/DCIM, /Pictures"
                />
              </div>
              <div className="space-y-2">
                <Label>Игнорировать папки</Label>
                <Input
                  value={settings.ignoreFolders.join(', ')}
                  onChange={(e) =>
                    onSettingsChange({
                      ...settings,
                      ignoreFolders: e.target.value.split(',').map(s => s.trim()),
                    })
                  }
                  placeholder="/.thumbnails, /.cache"
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Отображение</h3>
              <div className="flex items-center justify-between">
                <Label htmlFor="show-video">Показывать видео-файлы</Label>
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
              <div className="flex items-center justify-between">
                <Label htmlFor="checkerboard">Шахматный фон для альфа-канала</Label>
                <Switch
                  id="checkerboard"
                  checked={settings.checkerboardAlpha}
                  onCheckedChange={(checked) =>
                    onSettingsChange({ ...settings, checkerboardAlpha: checked })
                  }
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Сортировка по умолчанию</h3>
              <div className="space-y-2">
                <Label>Сортировать по</Label>
                <Select
                  value={settings.defaultSortBy}
                  onValueChange={(value: any) =>
                    onSettingsChange({ ...settings, defaultSortBy: value })
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
                  value={settings.defaultSortOrder}
                  onValueChange={(value: any) =>
                    onSettingsChange({ ...settings, defaultSortOrder: value })
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
                <Input
                  value={settings.swipeUpFolder}
                  onChange={(e) =>
                    onSettingsChange({ ...settings, swipeUpFolder: e.target.value })
                  }
                  placeholder="Best"
                />
              </div>
              <div className="space-y-2">
                <Label>Папка для свайпа вниз</Label>
                <Input
                  value={settings.swipeDownFolder}
                  onChange={(e) =>
                    onSettingsChange({ ...settings, swipeDownFolder: e.target.value })
                  }
                  placeholder="Bad"
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Ориентация экрана</h3>
              <Select
                value={settings.screenOrientation}
                onValueChange={(value: any) =>
                  onSettingsChange({ ...settings, screenOrientation: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="system">По системным настройкам</SelectItem>
                  <SelectItem value="sensor">По датчику</SelectItem>
                  <SelectItem value="image-size">По размеру изображения</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Настройки режима слайд-шоу</h3>
              <div className="space-y-2">
                <Label>Время просмотра (сек)</Label>
                <Input
                  type="number"
                  value={settings.slideshowDuration}
                  onChange={(e) =>
                    onSettingsChange({
                      ...settings,
                      slideshowDuration: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Эффект анимации при смене фото</Label>
                <Select
                  value={settings.slideshowAnimation}
                  onValueChange={(value: any) =>
                    onSettingsChange({ ...settings, slideshowAnimation: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fade">Растворение</SelectItem>
                    <SelectItem value="slide">Слайд</SelectItem>
                    <SelectItem value="zoom">Масштабирование</SelectItem>
                    <SelectItem value="none">Без анимации</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="slideshow-loop"
                  checked={settings.slideshowLoop}
                  onCheckedChange={(checked: boolean) =>
                    onSettingsChange({ ...settings, slideshowLoop: checked })
                  }
                />
                <Label htmlFor="slideshow-loop" className="cursor-pointer">
                  Зациклить просмотр
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="slideshow-random"
                  checked={settings.slideshowRandom}
                  onCheckedChange={(checked: boolean) =>
                    onSettingsChange({ ...settings, slideshowRandom: checked })
                  }
                />
                <Label htmlFor="slideshow-random" className="cursor-pointer">
                  Случайный порядок просмотра
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="slideshow-brightness"
                  checked={settings.slideshowMaxBrightness}
                  onCheckedChange={(checked: boolean) =>
                    onSettingsChange({ ...settings, slideshowMaxBrightness: checked })
                  }
                />
                <Label htmlFor="slideshow-brightness" className="cursor-pointer">
                  Максимальная яркость в режиме слайд-шоу
                </Label>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Кэширование</h3>
              <div className="flex items-center justify-between">
                <Label htmlFor="cache">Кэшировать полноэкранный просмотр</Label>
                <Switch
                  id="cache"
                  checked={settings.cacheFullscreen}
                  onCheckedChange={(checked) =>
                    onSettingsChange({ ...settings, cacheFullscreen: checked })
                  }
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Видео плеер</h3>
              <Select
                value={settings.videoPlayer}
                onValueChange={(value) =>
                  onSettingsChange({ ...settings, videoPlayer: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">По умолчанию</SelectItem>
                  <SelectItem value="vlc">VLC Player</SelectItem>
                  <SelectItem value="mxplayer">MX Player</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
