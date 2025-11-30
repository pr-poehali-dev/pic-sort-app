import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';

interface MenuSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedItemsCount: number;
  onShowExif: () => void;
  onOpenSettings: () => void;
  onOpenSort: () => void;
}

export const MenuSheet = ({
  open,
  onOpenChange,
  selectedItemsCount,
  onShowExif,
  onOpenSettings,
  onOpenSort,
}: MenuSheetProps) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-80">
        <SheetHeader>
          <SheetTitle>Меню</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-2 mt-6">
          <Button
            variant="ghost"
            className="justify-start"
            disabled={selectedItemsCount !== 1}
            onClick={onShowExif}
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
            disabled={selectedItemsCount === 0}
          >
            <Icon name="PlaySquare" size={20} className="mr-2" />
            Слайдшоу (выбранные)
          </Button>
          <Separator className="my-2" />
          <Button
            variant="ghost"
            className="justify-start"
            disabled={selectedItemsCount === 0}
          >
            <Icon name="Copy" size={20} className="mr-2" />
            Копировать выбранные
          </Button>
          <Button
            variant="ghost"
            className="justify-start"
            disabled={selectedItemsCount === 0}
          >
            <Icon name="FolderInput" size={20} className="mr-2" />
            Переместить выбранные
          </Button>
          <Button
            variant="ghost"
            className="justify-start text-destructive"
            disabled={selectedItemsCount === 0}
          >
            <Icon name="Trash2" size={20} className="mr-2" />
            Удалить выбранные
          </Button>
          <Separator className="my-2" />
          <Button
            variant="ghost"
            className="justify-start"
            onClick={() => {
              onOpenChange(false);
              onOpenSort();
            }}
          >
            <Icon name="ArrowUpDown" size={20} className="mr-2" />
            Сортировка
          </Button>
          <Button
            variant="ghost"
            className="justify-start"
            onClick={() => {
              onOpenChange(false);
              onOpenSettings();
            }}
          >
            <Icon name="Settings" size={20} className="mr-2" />
            Настройки
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};