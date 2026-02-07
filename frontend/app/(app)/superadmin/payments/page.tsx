"use client";

import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/components/providers/language-provider";
import { useTranslations } from "@/hooks/use-translations";
import { useSuperadminPayments } from "@/hooks/use-superadmin-payments";
import { CreditCard, DollarSign, Loader2, FileText, Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BackButton } from "@/components/ui/back-button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { format } from "date-fns";

export default function PaymentsPage() {
  const { user } = useAuth();
  const { locale } = useLanguage();
  const { t } = useTranslations(locale);
  const { payments, totalEarnings, isLoading } = useSuperadminPayments();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPayments = payments?.filter((payment: any) => 
    payment.account?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.account?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.status?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (user?.role !== 'superadmin') return null;

  return (
    <div className="space-y-6 text-foreground animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-0.5">
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <BackButton fallbackUrl="/superadmin/dashboard" />
            <div className="bg-primary/10 p-1.5 rounded-lg text-primary">
              <CreditCard size={18} />
            </div>
            {t('superadmin.sidebar.payments')}
          </h2>
          <p className="text-xs text-muted-foreground font-medium pl-9">{t('superadmin.payments.subtitle')}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm border-border/40 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-6 flex flex-col gap-1">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{t('superadmin.payments.total_revenue')}</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight text-primary">
                ${(totalEarnings / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
              <span className="text-[10px] font-medium text-emerald-600 bg-emerald-500/10 px-1.5 py-0.5 rounded-full border border-emerald-500/20">
                +100%
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-2xl shadow-primary/5 border-border/40 rounded-2xl bg-card/30 backdrop-blur-xl overflow-hidden">
        <div className="flex items-center justify-end p-3 px-4 border-b border-border/40 bg-card/50">
           <div className="relative w-full max-w-xs">
             <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
             <Input 
               placeholder={t('superadmin.actions.search') || "Search..."}
               className="w-full pl-9 h-8 text-xs bg-background/50 border-border/40 focus-visible:ring-1 focus-visible:ring-primary/20 focus-visible:ring-offset-0 placeholder:text-muted-foreground/60 rounded-lg shadow-sm"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
           </div>
        </div>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800">
                <TableRow className="hover:bg-transparent border-none">
                  <TableHead className="w-[180px] text-xs font-semibold text-zinc-700 dark:text-zinc-300 pl-4">{t('superadmin.payments.table.date')}</TableHead>
                  <TableHead className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">{t('superadmin.payments.table.account')}</TableHead>
                  <TableHead className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">{t('superadmin.payments.table.amount')}</TableHead>
                  <TableHead className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">{t('superadmin.payments.table.status')}</TableHead>
                  <TableHead className="text-right text-xs font-semibold text-zinc-700 dark:text-zinc-300 pr-4">{t('superadmin.payments.table.invoice')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="h-6 w-6 animate-spin text-primary opacity-50" />
                        <span className="font-medium text-[10px] opacity-60 uppercase tracking-widest">{t('superadmin.dashboard.table.loading')}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredPayments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground font-medium italic opacity-40 uppercase text-[10px] tracking-widest">
                      {searchTerm ? "No results found." : t('superadmin.payments.no_payments')}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPayments.map((payment: any) => (
                    <TableRow key={payment.id} className="hover:bg-muted/30 border-border/40 transition-colors">
                      <TableCell className="font-medium text-xs text-muted-foreground">
                        {format(new Date(payment.payment_date), 'MMM dd, yyyy HH:mm')}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-semibold text-foreground text-xs">{payment.account?.name}</span>
                          <span className="text-[10px] text-muted-foreground font-medium opacity-60">{payment.account?.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                         <span className="font-bold text-xs text-foreground">
                           ${payment.formatted_amount} <span className="text-[9px] text-muted-foreground font-medium uppercase">{payment.currency}</span>
                         </span>
                      </TableCell>
                      <TableCell>
                        <div className={cn(
                          "px-2 py-0.5 rounded-md text-[9px] font-bold border uppercase tracking-wider w-fit flex items-center gap-1.5",
                          payment.status === 'succeeded' ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/20 dark:text-emerald-400" :
                          "bg-red-500/10 text-red-700 border-red-500/20 dark:text-red-400"
                        )}>
                          <span className={cn(
                            "w-1 h-1 rounded-full",
                            payment.status === 'succeeded' ? "bg-emerald-500" : "bg-red-500"
                          )} />
                          {payment.status}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {payment.invoice_url && (
                          <a 
                            href={payment.invoice_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-[10px] font-medium text-primary hover:text-primary/80 transition-colors bg-primary/5 hover:bg-primary/10 px-2.5 py-1 rounded-md border border-primary/10"
                          >
                            <FileText size={12} />
                            View Invoice
                          </a>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
