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
import { SortSheet } from '@/components/SortSheet';

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

const Index = () => {
  const [currentPath, setCurrentPath] = useState('/');
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [viewerOpen, setViewerOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState<MediaItem | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'path'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [settings, setSettings] = useState<Settings>({
    scanFolders: ['/DCIM', '/Pictures'],
    ignoreFolders: ['/.thumbnails', '/.cache'],
    showVideoFiles: true,
    showFileNames: true,
    defaultSortBy: 'name',
    defaultSortOrder: 'asc',
    checkerboardAlpha: false,
    swipeUpFolder: 'Best',
    swipeDownFolder: 'Bad',
    screenOrientation: 'system',
    slideshowDuration: 3,
    slideshowAnimation: 'fade',
    slideshowLoop: false,
    slideshowRandom: false,
    slideshowMaxBrightness: false,
    cacheFullscreen: true,
    videoPlayer: 'default',
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [exifDialogOpen, setExifDialogOpen] = useState(false);
  const [slideshowActive, setSlideshowActive] = useState(false);
  const [slideshowImages, setSlideshowImages] = useState<MediaItem[]>([]);
  const [slideshowIndex, setSlideshowIndex] = useState(0);

  useEffect(() => {
    loadMockData();
  }, [currentPath, sortBy, sortOrder, settings.showVideoFiles]);

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
      if (sortBy === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === 'date') {
        comparison = (a.date || '').localeCompare(b.date || '');
      } else if (sortBy === 'path') {
        comparison = a.path.localeCompare(b.path);
      }

      return sortOrder === 'asc' ? comparison : -comparison;
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
    if (!currentImage) return;

    const targetFolder = direction === 'up' ? settings.swipeUpFolder : settings.swipeDownFolder;
    
    const updatedItems = mediaItems.filter(item => item.id !== currentImage.id);
    setMediaItems(updatedItems);
    
    const images = updatedItems.filter(item => item.type === 'image');
    const currentIndex = images.findIndex(item => item.id === currentImage.id);
    
    if (images.length > 0) {
      const nextIndex = currentIndex >= 0 && currentIndex < images.length ? currentIndex : 0;
      setCurrentImage(images[nextIndex]);
      setZoomLevel(1);
    } else {
      setViewerOpen(false);
    }
  };

  const handleNavigate = (direction: 'prev' | 'next') => {
    if (!currentImage) return;
    
    const images = mediaItems.filter(item => item.type === 'image');
    const currentIndex = images.findIndex(item => item.id === currentImage.id);
    
    if (direction === 'prev' && currentIndex > 0) {
      setCurrentImage(images[currentIndex - 1]);
      setZoomLevel(1);
    } else if (direction === 'next' && currentIndex < images.length - 1) {
      setCurrentImage(images[currentIndex + 1]);
      setZoomLevel(1);
    }
  };

  const getNavigationStatus = () => {
    if (!currentImage) return { hasPrev: false, hasNext: false };
    
    const images = mediaItems.filter(item => item.type === 'image');
    const currentIndex = images.findIndex(item => item.id === currentImage.id);
    
    return {
      hasPrev: currentIndex > 0,
      hasNext: currentIndex < images.length - 1,
    };
  };

  const startSlideshow = (images: MediaItem[]) => {
    if (images.length === 0) return;
    
    let sortedImages = [...images];
    if (settings.slideshowRandom) {
      sortedImages = sortedImages.sort(() => Math.random() - 0.5);
    }
    
    setSlideshowImages(sortedImages);
    setSlideshowIndex(0);
    setCurrentImage(sortedImages[0]);
    setViewerOpen(true);
    setSlideshowActive(true);
    setZoomLevel(1);
  };

  const stopSlideshow = () => {
    setSlideshowActive(false);
  };

  useEffect(() => {
    if (!slideshowActive || !viewerOpen) return;

    const timer = setTimeout(() => {
      const nextIndex = slideshowIndex + 1;
      
      if (nextIndex < slideshowImages.length) {
        setSlideshowIndex(nextIndex);
        setCurrentImage(slideshowImages[nextIndex]);
        setZoomLevel(1);
      } else if (settings.slideshowLoop) {
        setSlideshowIndex(0);
        setCurrentImage(slideshowImages[0]);
        setZoomLevel(1);
      } else {
        setSlideshowActive(false);
        setViewerOpen(false);
      }
    }, settings.slideshowDuration * 1000);

    return () => clearTimeout(timer);
  }, [slideshowActive, slideshowIndex, slideshowImages, settings.slideshowDuration, settings.slideshowLoop, viewerOpen]);

  useEffect(() => {
    if (!viewerOpen) {
      setSlideshowActive(false);
    }
  }, [viewerOpen]);

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
        onNavigate={handleNavigate}
        {...getNavigationStatus()}
        slideshowActive={slideshowActive}
      />

      <MenuSheet
        open={menuOpen}
        onOpenChange={setMenuOpen}
        selectedItemsCount={selectedItems.size}
        onShowExif={() => setExifDialogOpen(true)}
        onOpenSettings={() => setSettingsOpen(true)}
        onOpenSort={() => setSortOpen(true)}
        onStartSlideshowAll={() => {
          const images = mediaItems.filter(item => item.type === 'image');
          startSlideshow(images);
          setMenuOpen(false);
        }}
        onStartSlideshowSelected={() => {
          const images = mediaItems.filter(item => 
            item.type === 'image' && selectedItems.has(item.id)
          );
          startSlideshow(images);
          setMenuOpen(false);
        }}
      />

      <SortSheet
        open={sortOpen}
        onOpenChange={setSortOpen}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={(newSortBy, newSortOrder) => {
          setSortBy(newSortBy);
          setSortOrder(newSortOrder);
        }}
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