import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface SortSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sortBy: 'name' | 'date' | 'path';
  sortOrder: 'asc' | 'desc';
  onSortChange: (sortBy: 'name' | 'date' | 'path', sortOrder: 'asc' | 'desc') => void;
}

export const SortSheet = ({
  open,
  onOpenChange,
  sortBy,
  sortOrder,
  onSortChange,
}: SortSheetProps) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-80">
        <SheetHeader>
          <SheetTitle>Сортировка</SheetTitle>
        </SheetHeader>
        <div className="space-y-4 mt-6">
          <div className="space-y-2">
            <Label>Сортировать по</Label>
            <Select
              value={sortBy}
              onValueChange={(value: any) => onSortChange(value, sortOrder)}
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
              value={sortOrder}
              onValueChange={(value: any) => onSortChange(sortBy, value)}
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
          <Button 
            className="w-full mt-4" 
            onClick={() => onOpenChange(false)}
          >
            Применить
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
