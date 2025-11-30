import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';

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

interface ImageViewerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentImage: MediaItem | null;
  zoomLevel: number;
  onZoom: (delta: number) => void;
  onSwipeMove: (direction: 'up' | 'down') => void;
  onNavigate: (direction: 'prev' | 'next') => void;
  hasPrev: boolean;
  hasNext: boolean;
  slideshowActive?: boolean;
}

export const ImageViewer = ({
  open,
  onOpenChange,
  currentImage,
  zoomLevel,
  onZoom,
  onSwipeMove,
  onNavigate,
  hasPrev,
  hasNext,
  slideshowActive = false,
}: ImageViewerProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-full h-full p-0 bg-black">
        {currentImage && (
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src={currentImage.thumbnail}
              alt={currentImage.name}
              className="max-w-full max-h-full object-contain"
              style={{ transform: `scale(${zoomLevel})` }}
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-card/90 backdrop-blur"
              onClick={() => onNavigate('prev')}
              disabled={!hasPrev}
            >
              <Icon name="ChevronLeft" size={32} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-card/90 backdrop-blur"
              onClick={() => onNavigate('next')}
              disabled={!hasNext}
            >
              <Icon name="ChevronRight" size={32} />
            </Button>
            {slideshowActive && (
              <div className="absolute top-4 left-4 bg-destructive/90 backdrop-blur rounded-full px-4 py-2 text-white font-medium">
                <Icon name="Play" size={16} className="inline mr-2" />
                Слайд-шоу
              </div>
            )}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-card/90 backdrop-blur rounded-full px-4 py-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onZoom(-0.5)}
                disabled={zoomLevel <= 1}
              >
                <Icon name="ZoomOut" size={20} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onZoom(0.5)}
                disabled={zoomLevel >= 5}
              >
                <Icon name="ZoomIn" size={20} />
              </Button>
              <Separator orientation="vertical" className="h-auto" />
              <Button variant="ghost" size="icon" onClick={() => onSwipeMove('up')}>
                <Icon name="ArrowUp" size={20} />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => onSwipeMove('down')}>
                <Icon name="ArrowDown" size={20} />
              </Button>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 bg-card/90 backdrop-blur"
              onClick={() => onOpenChange(false)}
            >
              <Icon name="X" size={24} />
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};