import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

type MediaType = 'image' | 'video' | 'folder';

interface MediaItem {
  id: string;
  name: string;
  type: MediaType;
  thumbnail: string;
  aspectRatio: number;
  path: string;
  size?: string;
  date?: string;
  exif?: {
    camera?: string;
    lens?: string;
    iso?: string;
    aperture?: string;
    shutter?: string;
    focalLength?: string;
  };
}

interface Settings {
  showVideoFiles: boolean;
  showFileNames: boolean;
  sortBy: 'name' | 'date' | 'path';
  sortOrder: 'asc' | 'desc';
  swipeUpFolder: string;
  swipeDownFolder: string;
  slideshowDuration: number;
}

const Index = () => {
  const [currentPath, setCurrentPath] = useState('/');
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [viewerOpen, setViewerOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState<MediaItem | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [settings, setSettings] = useState<Settings>({
    showVideoFiles: true,
    showFileNames: true,
    sortBy: 'name',
    sortOrder: 'asc',
    swipeUpFolder: 'Best',
    swipeDownFolder: 'Bad',
    slideshowDuration: 3,
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [exifDialogOpen, setExifDialogOpen] = useState(false);

  useEffect(() => {
    loadMockData();
  }, [currentPath, settings.sortBy, settings.sortOrder, settings.showVideoFiles]);

  const loadMockData = () => {
    const mockData: MediaItem[] = [
      {
        id: '1',
        name: 'Vacation Photos',
        type: 'folder',
        thumbnail: '',
        aspectRatio: 1,
        path: '/Vacation Photos',
      },
      {
        id: '2',
        name: 'Nature',
        type: 'folder',
        thumbnail: '',
        aspectRatio: 1,
        path: '/Nature',
      },
      {
        id: '3',
        name: 'IMG_001.jpg',
        type: 'image',
        thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300',
        aspectRatio: 4 / 3,
        path: '/IMG_001.jpg',
        size: '2.4 MB',
        date: '2025-11-28',
        exif: {
          camera: 'Canon EOS R5',
          lens: 'RF 24-70mm f/2.8',
          iso: '200',
          aperture: 'f/5.6',
          shutter: '1/500',
          focalLength: '50mm',
        },
      },
      {
        id: '4',
        name: 'IMG_002.jpg',
        type: 'image',
        thumbnail: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=600',
        aspectRatio: 2 / 3,
        path: '/IMG_002.jpg',
        size: '3.1 MB',
        date: '2025-11-27',
      },
      {
        id: '5',
        name: 'IMG_003.jpg',
        type: 'image',
        thumbnail: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&h=400',
        aspectRatio: 3 / 2,
        path: '/IMG_003.jpg',
        size: '2.8 MB',
        date: '2025-11-26',
      },
      {
        id: '6',
        name: 'VIDEO_001.mp4',
        type: 'video',
        thumbnail: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=400&h=300',
        aspectRatio: 16 / 9,
        path: '/VIDEO_001.mp4',
        size: '45.2 MB',
        date: '2025-11-25',
      },
      {
        id: '7',
        name: 'IMG_004.jpg',
        type: 'image',
        thumbnail: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=500&h=500',
        aspectRatio: 1,
        path: '/IMG_004.jpg',
        size: '1.9 MB',
        date: '2025-11-24',
      },
    ];

    const filtered = settings.showVideoFiles ? mockData : mockData.filter(item => item.type !== 'video');
    
    filtered.sort((a, b) => {
      if (a.type === 'folder' && b.type !== 'folder') return -1;
      if (a.type !== 'folder' && b.type === 'folder') return 1;

      let comparison = 0;
      if (settings.sortBy === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (settings.sortBy === 'date') {
        comparison = (a.date || '').localeCompare(b.date || '');
      } else if (settings.sortBy === 'path') {
        comparison = a.path.localeCompare(b.path);
      }

      return settings.sortOrder === 'asc' ? comparison : -comparison;
    });

    setMediaItems(filtered);
  };

  const handleItemClick = (item: MediaItem) => {
    if (selectedItems.size > 0) {
      toggleSelection(item.id);
    } else {
      if (item.type === 'folder') {
        setCurrentPath(item.path);
      } else if (item.type === 'image') {
        setCurrentImage(item);
        setViewerOpen(true);
        setZoomLevel(1);
      }
    }
  };

  const handleLongPress = (itemId: string) => {
    toggleSelection(itemId);
  };

  const toggleSelection = (itemId: string) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const clearSelection = () => {
    setSelectedItems(new Set());
  };

  const handleZoom = (delta: number) => {
    setZoomLevel(prev => Math.max(1, Math.min(5, prev + delta)));
  };

  const handleSwipeMove = (direction: 'up' | 'down') => {
    if (currentImage) {
      const targetFolder = direction === 'up' ? settings.swipeUpFolder : settings.swipeDownFolder;
      console.log(`Moving ${currentImage.name} to ${targetFolder}`);
      
      const currentIndex = mediaItems.findIndex(item => item.id === currentImage.id);
      if (currentIndex < mediaItems.length - 1) {
        const nextImage = mediaItems[currentIndex + 1];
        if (nextImage.type === 'image') {
          setCurrentImage(nextImage);
        } else {
          setViewerOpen(false);
        }
      } else {
        setViewerOpen(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <Icon name="Camera" className="text-primary-foreground" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold">PicSort</h1>
              <p className="text-xs text-muted-foreground">{currentPath}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {selectedItems.size > 0 && (
              <>
                <Badge variant="secondary" className="px-3">
                  {selectedItems.size} выбрано
                </Badge>
                <Button variant="ghost" size="icon" onClick={clearSelection}>
                  <Icon name="X" size={20} />
                </Button>
              </>
            )}

            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Icon name="Menu" size={24} />
                </Button>
              </SheetTrigger>
              <SheetContent className="w-80">
                <SheetHeader>
                  <SheetTitle>Меню</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-2 mt-6">
                  <Button
                    variant="ghost"
                    className="justify-start"
                    disabled={selectedItems.size !== 1}
                    onClick={() => setExifDialogOpen(true)}
                  >
                    <Icon name="Info" size={20} className="mr-2" />
                    Показать EXIF
                  </Button>
                  <Button variant="ghost" className="justify-start">
                    <Icon name="Play" size={20} className="mr-2" />
                    Слайдшоу (текущая папка)
                  </Button>
                  <Button
                    variant="ghost"
                    className="justify-start"
                    disabled={selectedItems.size === 0}
                  >
                    <Icon name="PlaySquare" size={20} className="mr-2" />
                    Слайдшоу (выбранные)
                  </Button>
                  <Separator className="my-2" />
                  <Button
                    variant="ghost"
                    className="justify-start"
                    disabled={selectedItems.size === 0}
                  >
                    <Icon name="Copy" size={20} className="mr-2" />
                    Копировать выбранные
                  </Button>
                  <Button
                    variant="ghost"
                    className="justify-start"
                    disabled={selectedItems.size === 0}
                  >
                    <Icon name="FolderInput" size={20} className="mr-2" />
                    Переместить выбранные
                  </Button>
                  <Button
                    variant="ghost"
                    className="justify-start text-destructive"
                    disabled={selectedItems.size === 0}
                  >
                    <Icon name="Trash2" size={20} className="mr-2" />
                    Удалить выбранные
                  </Button>
                  <Separator className="my-2" />
                  <Button variant="ghost" className="justify-start" onClick={() => {
                    setMenuOpen(false);
                    setSettingsOpen(true);
                  }}>
                    <Icon name="Settings" size={20} className="mr-2" />
                    Настройки
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="p-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {mediaItems.map((item) => (
            <div
              key={item.id}
              className={`group relative cursor-pointer transition-all hover:scale-105 ${
                selectedItems.has(item.id) ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => handleItemClick(item)}
              onContextMenu={(e) => {
                e.preventDefault();
                handleLongPress(item.id);
              }}
            >
              <div
                className="relative bg-card border border-border rounded-lg overflow-hidden"
                style={{
                  paddingBottom: `${(1 / item.aspectRatio) * 100}%`,
                }}
              >
                {item.type === 'folder' ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-secondary">
                    <Icon name="Folder" size={48} className="text-primary" />
                  </div>
                ) : (
                  <>
                    <img
                      src={item.thumbnail}
                      alt={item.name}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    {item.type === 'video' && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                        <Icon name="PlayCircle" size={48} className="text-white" />
                      </div>
                    )}
                  </>
                )}
                {selectedItems.has(item.id) && (
                  <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <Icon name="Check" size={16} className="text-primary-foreground" />
                  </div>
                )}
              </div>
              {(settings.showFileNames || item.type === 'folder') && (
                <p className="mt-2 text-sm text-foreground truncate">{item.name}</p>
              )}
            </div>
          ))}
        </div>
      </main>

      <Dialog open={viewerOpen} onOpenChange={setViewerOpen}>
        <DialogContent className="max-w-full h-full p-0 bg-black">
          {currentImage && (
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                src={currentImage.thumbnail}
                alt={currentImage.name}
                className="max-w-full max-h-full object-contain"
                style={{ transform: `scale(${zoomLevel})` }}
              />
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-card/90 backdrop-blur rounded-full px-4 py-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleZoom(-0.5)}
                  disabled={zoomLevel <= 1}
                >
                  <Icon name="ZoomOut" size={20} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleZoom(0.5)}
                  disabled={zoomLevel >= 5}
                >
                  <Icon name="ZoomIn" size={20} />
                </Button>
                <Separator orientation="vertical" className="h-auto" />
                <Button variant="ghost" size="icon" onClick={() => handleSwipeMove('up')}>
                  <Icon name="ArrowUp" size={20} />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleSwipeMove('down')}>
                  <Icon name="ArrowDown" size={20} />
                </Button>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 bg-card/90 backdrop-blur"
                onClick={() => setViewerOpen(false)}
              >
                <Icon name="X" size={24} />
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={exifDialogOpen} onOpenChange={setExifDialogOpen}>
        <DialogContent className="max-w-md">
          <SheetHeader>
            <SheetTitle>EXIF информация</SheetTitle>
          </SheetHeader>
          {currentImage?.exif && (
            <div className="grid grid-cols-2 gap-3 mt-4">
              {Object.entries(currentImage.exif).map(([key, value]) => (
                <div key={key}>
                  <p className="text-xs text-muted-foreground capitalize">{key}</p>
                  <p className="text-sm font-medium">{value}</p>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Sheet open={settingsOpen} onOpenChange={setSettingsOpen}>
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
                      setSettings({ ...settings, showVideoFiles: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-names">Показывать имена файлов</Label>
                  <Switch
                    id="show-names"
                    checked={settings.showFileNames}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, showFileNames: checked })
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
                      setSettings({ ...settings, sortBy: value })
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
                      setSettings({ ...settings, sortOrder: value })
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
                      setSettings({ ...settings, swipeUpFolder: value })
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
                      setSettings({ ...settings, swipeDownFolder: value })
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
                      setSettings({ ...settings, slideshowDuration: Number(value) })
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
    </div>
  );
};

export default Index;
