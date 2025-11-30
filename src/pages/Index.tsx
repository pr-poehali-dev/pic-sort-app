import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { SheetTrigger } from '@/components/ui/sheet';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { MediaGrid } from '@/components/MediaGrid';
import { ImageViewer } from '@/components/ImageViewer';
import { MenuSheet } from '@/components/MenuSheet';
import { SettingsSheet } from '@/components/SettingsSheet';

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

            <Button variant="ghost" size="icon" onClick={() => setMenuOpen(true)}>
              <Icon name="Menu" size={24} />
            </Button>
          </div>
        </div>
      </header>

      <main className="p-4">
        <MediaGrid
          mediaItems={mediaItems}
          selectedItems={selectedItems}
          showFileNames={settings.showFileNames}
          onItemClick={handleItemClick}
          onLongPress={handleLongPress}
        />
      </main>

      <ImageViewer
        open={viewerOpen}
        onOpenChange={setViewerOpen}
        currentImage={currentImage}
        zoomLevel={zoomLevel}
        onZoom={handleZoom}
        onSwipeMove={handleSwipeMove}
      />

      <MenuSheet
        open={menuOpen}
        onOpenChange={setMenuOpen}
        selectedItemsCount={selectedItems.size}
        onShowExif={() => setExifDialogOpen(true)}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      <SettingsSheet
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        settings={settings}
        onSettingsChange={setSettings}
      />

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
    </div>
  );
};

export default Index;
