import Icon from '@/components/ui/icon';

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

interface MediaGridProps {
  mediaItems: MediaItem[];
  selectedItems: Set<string>;
  showFileNames: boolean;
  onItemClick: (item: MediaItem) => void;
  onLongPress: (itemId: string) => void;
}

export const MediaGrid = ({
  mediaItems,
  selectedItems,
  showFileNames,
  onItemClick,
  onLongPress,
}: MediaGridProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
      {mediaItems.map((item) => (
        <div
          key={item.id}
          className={`group relative cursor-pointer transition-all hover:scale-105 ${
            selectedItems.has(item.id) ? 'ring-2 ring-primary' : ''
          }`}
          onClick={() => onItemClick(item)}
          onContextMenu={(e) => {
            e.preventDefault();
            onLongPress(item.id);
          }}
        >
          <div className="relative bg-card border border-border rounded-lg overflow-hidden h-48">
            {item.type === 'folder' ? (
              <div className="absolute inset-0 flex items-center justify-center bg-secondary">
                <Icon name="Folder" size={48} className="text-primary" />
              </div>
            ) : (
              <>
                <img
                  src={item.thumbnail}
                  alt={item.name}
                  className="absolute inset-0 w-full h-full object-contain"
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
          {(showFileNames || item.type === 'folder') && (
            <p className="mt-2 text-sm text-foreground truncate">{item.name}</p>
          )}
        </div>
      ))}
    </div>
  );
};