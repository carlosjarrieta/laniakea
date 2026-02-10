import React from "react";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Facebook } from "lucide-react";
import { useTranslations } from "@/hooks/use-translations";

interface FacebookPage {
  id: string;
  name: string;
  access_token: string;
}

interface FacebookPagesSelectProps {
  pages: FacebookPage[];
  value?: string;
  onChange: (pageId: string) => void;
  label?: string;
  disabled?: boolean;
}

export const FacebookPagesSelect: React.FC<FacebookPagesSelectProps> = ({
  pages,
  value,
  onChange,
  label,
  disabled = false,
}) => {
  const { t } = useTranslations();
  const labelText = label || t('integrations.facebook.select_page') || 'Fanpage';
  const placeholder = t('integrations.facebook.select_page_placeholder') || 'Selecciona una fanpage';
  const noPages = t('integrations.facebook.no_pages') || 'No hay fanpages disponibles';

  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-muted-foreground">
        <Facebook size={14} className="inline mr-1 text-primary" /> {labelText}
      </Label>
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger className="h-9 text-sm border-border/60 focus-visible:ring-1 focus-visible:ring-primary/20 focus-visible:border-primary/50 bg-muted/20">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {pages.length === 0 ? (
            <SelectItem value="" disabled>
              {noPages}
            </SelectItem>
          ) : (
            pages.map((page) => (
              <SelectItem key={page.id} value={page.id} className="flex items-center gap-2">
                <span className="text-xs font-medium">{page.name}</span>
                <Badge className="ml-2 bg-primary/10 text-primary border-none">ID: {page.id}</Badge>
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
};