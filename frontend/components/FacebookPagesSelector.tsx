import React, { useEffect, useState } from "react";
import { FacebookPagesSelect } from "@/components/FacebookPagesSelect";
import { integrationsApi } from "@/lib/integrations-api";
import { useTranslations } from "@/hooks/use-translations";
import { Loader2 } from "lucide-react";

interface FacebookPagesSelectorProps {
  value?: string;
  onChange: (pageId: string) => void;
  disabled?: boolean;
}

export const FacebookPagesSelector: React.FC<FacebookPagesSelectorProps> = ({ value, onChange, disabled }) => {
  const [pages, setPages] = useState<{ id: string; name: string; access_token: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslations();

  useEffect(() => {
    setLoading(true);
    integrationsApi.getAllFacebookPages().then((accounts) => {
      // Unir todas las páginas de todas las cuentas
      const allPages = accounts.flatMap(acc => acc.pages.map(page => ({ ...page, accountName: acc.accountName })));
      setPages(allPages);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto px-4 md:px-0">
      {loading ? (
        <div className="flex items-center gap-2 h-9 text-sm text-muted-foreground">
          <Loader2 className="animate-spin" size={16} /> {t('loading') || 'Cargando fanpages...'}
        </div>
      ) : (
        <FacebookPagesSelect
          pages={pages}
          value={value}
          onChange={onChange}
          label={t('integrations.facebook.select_page') || 'Selecciona una fanpage'}
          disabled={disabled}
        />
      )}
    </div>
  );
};
