"use client";


import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/components/providers/language-provider";
import { useTranslations } from "@/hooks/use-translations";
import { useSuperadminAccounts } from "@/hooks/use-superadmin-accounts";
import { useSuperadminPlans } from "@/hooks/use-superadmin-plans";
import { Settings2, Edit2, Building2, Package, Check, Loader2, User as UserIcon, ShieldCheck, MoreHorizontal, Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BackButton } from "@/components/ui/back-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";

const accountSchema = z.object({
  name: z.string().min(2),
  status: z.enum(["trialing", "active", "past_due", "canceled"]),
  plan_id: z.number().nullable().optional(),
});

type AccountFormValues = z.infer<typeof accountSchema>;

export default function AccountsPage() {
  const { user } = useAuth();
  const { locale } = useLanguage();
  const { t } = useTranslations(locale);
  const { accounts, isLoading, updateAccount } = useSuperadminAccounts();
  const { plans } = useSuperadminPlans();
  const [isOpen, setIsOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAccounts = accounts.filter(account => 
    account.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    account.owner?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    account.owner?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: "",
      status: "active",
      plan_id: null,
    },
  });

  const onSubmit = async (values: AccountFormValues) => {
    if (editingAccount) {
      await updateAccount(editingAccount.id, values);
    }
    setIsOpen(false);
    setEditingAccount(null);
  };

  const handleEdit = (account: any) => {
    setEditingAccount(account);
    form.reset({
      name: account.name,
      status: account.status,
      plan_id: account.plan_id,
    });
    setIsOpen(true);
  };

  if (user?.role !== 'superadmin') return null;

  return (
    <TooltipProvider>
      <div className="space-y-6 text-foreground animate-in fade-in duration-500">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
              <BackButton fallbackUrl="/dashboard" />
              <div className="bg-primary/10 p-1.5 rounded-lg text-primary">
                <Building2 size={18} />
              </div>
              {t('superadmin.sidebar.accounts')}
            </h2>
            <p className="text-xs text-muted-foreground font-medium pl-9">{t('superadmin.dashboard.subtitle')}</p>
          </div>
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
                    <TableHead className="w-[300px] text-xs font-semibold text-zinc-700 dark:text-zinc-300 pl-4">{t('superadmin.dashboard.table.name')}</TableHead>
                    <TableHead className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">{t('superadmin.dashboard.table.plan')}</TableHead>
                    <TableHead className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">{t('superadmin.dashboard.table.status')}</TableHead>
                    <TableHead className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">{t('superadmin.dashboard.table.owner')}</TableHead>
                    <TableHead className="text-right text-xs font-semibold text-zinc-700 dark:text-zinc-300 pr-4">{t('superadmin.dashboard.table.actions')}</TableHead>
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
                  ) : filteredAccounts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center text-muted-foreground font-medium italic opacity-40 uppercase text-[10px] tracking-widest">
                        {searchTerm ? "No results found." : t('superadmin.dashboard.table.no_accounts')}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredAccounts.map((account) => (
                      <TableRow key={account.id} className="hover:bg-muted/30 border-border/40 transition-colors">
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-8 h-8 rounded-md bg-muted/50 text-muted-foreground">
                              <Building2 size={14} />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-semibold text-foreground text-xs">{account.name}</span>
                              <span className="text-[10px] text-muted-foreground font-medium opacity-60">ID: #{account.id}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800 text-foreground rounded-full w-fit border border-border/40 shadow-sm">
                            <Package size={10} className="opacity-50" />
                            <span className="text-[10px] font-bold uppercase tracking-wider">
                              {account.plan?.name || t('superadmin.form.no_plan')}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className={cn(
                            "px-2 py-0.5 rounded-md text-[9px] font-bold border uppercase tracking-wider w-fit flex items-center gap-1.5",
                            account.status === 'active' ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/20 dark:text-emerald-400" :
                            account.status === 'trialing' ? "bg-blue-500/10 text-blue-700 border-blue-500/20 dark:text-blue-400" :
                            account.status === 'past_due' ? "bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-400" :
                            "bg-red-500/10 text-red-700 border-red-500/20 dark:text-red-400"
                          )}>
                            <span className={cn(
                              "w-1 h-1 rounded-full",
                              account.status === 'active' ? "bg-emerald-500" :
                              account.status === 'trialing' ? "bg-blue-500" :
                              account.status === 'past_due' ? "bg-amber-500" :
                              "bg-red-500"
                            )} />
                            {t(`superadmin.form.${account.status}`)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3 group/owner">
                            <Avatar className="h-8 w-8 border border-border/40">
                              <AvatarImage src={`https://api.dicebear.com/7.x/notionists/svg?seed=${account.owner?.email || account.id}`} />
                              <AvatarFallback className="text-[9px] font-bold">{account.owner?.name?.substring(0,2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col leading-tight">
                              <span className="text-[11px] font-bold text-foreground">{account.owner?.name}</span>
                              <span className="text-[9px] text-muted-foreground font-medium opacity-60">{account.owner?.email}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-7 w-7 rounded-md hover:bg-muted transition-colors">
                                <MoreHorizontal size={16} className="text-muted-foreground" />
                              </Button>
                            </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 p-1">
                            <DropdownMenuItem 
                              onClick={() => handleEdit(account)}
                              className="focus:bg-zinc-100 dark:focus:bg-zinc-800 text-xs font-medium cursor-pointer py-2 px-3 rounded-md"
                            >
                              <Edit2 size={14} className="mr-2.5 text-muted-foreground" />
                              {t('superadmin.actions.edit')}
                            </DropdownMenuItem>
                            {account.status !== 'active' && (
                              <DropdownMenuItem 
                                className="text-emerald-600 focus:bg-emerald-50 dark:focus:bg-emerald-900/10 focus:text-emerald-700 cursor-pointer text-xs font-medium py-2 px-3 rounded-md mt-1"
                                onClick={() => updateAccount(account.id, { status: 'active' })}
                              >
                                <Check size={14} className="mr-2.5" />
                                {t('superadmin.form.set_active')}
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if(!open) setEditingAccount(null); }}>
          <DialogContent className="sm:max-w-[425px] rounded-3xl p-0 overflow-hidden border-border/40 bg-card shadow-3xl">
            <div className="bg-muted/30 px-6 py-8 relative border-b border-border/40">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold tracking-tight">
                  {t('superadmin.actions.edit')}
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground font-medium">
                  Update account details for <span className="font-bold text-foreground">{editingAccount?.name}</span>
                </DialogDescription>
              </DialogHeader>
            </div>
            
            <div className="p-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">{t('superadmin.form.name')}</FormLabel>
                        <FormControl>
                          <Input placeholder="Account Name" className="rounded-xl h-9 border-border/60 focus:ring-primary/20 bg-muted/20 font-bold px-3 hover:border-primary/30 transition-all shadow-none focus:bg-background text-xs" {...field} />
                        </FormControl>
                        <FormMessage className="text-[9px] uppercase font-black tracking-wider pl-1" />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">{t('superadmin.form.status')}</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="rounded-xl h-9 border-border/60 focus:ring-primary/20 bg-muted/20 font-bold px-3 hover:border-primary/30 transition-all shadow-none focus:bg-background text-xs">
                                <SelectValue placeholder="Status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="rounded-xl bg-card border-border/40 shadow-2xl p-1.5">
                              <SelectItem value="active" className="rounded-lg py-1.5 px-3 focus:bg-primary/5 font-bold text-xs">{t('superadmin.form.active')}</SelectItem>
                              <SelectItem value="trialing" className="rounded-lg py-1.5 px-3 focus:bg-primary/5 font-bold text-xs">{t('superadmin.form.trialing')}</SelectItem>
                              <SelectItem value="past_due" className="rounded-lg py-1.5 px-3 focus:bg-primary/5 font-bold text-xs">{t('superadmin.form.past_due')}</SelectItem>
                              <SelectItem value="canceled" className="rounded-lg py-1.5 px-3 focus:bg-primary/5 font-bold text-xs">{t('superadmin.form.canceled')}</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-[9px] uppercase font-black tracking-wider pl-1" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="plan_id"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">{t('superadmin.form.plan')}</FormLabel>
                          <Select onValueChange={(val) => field.onChange(val === "none" ? null : parseInt(val))} defaultValue={field.value?.toString() || "none"} value={field.value?.toString() || "none"}>
                            <FormControl>
                              <SelectTrigger className="rounded-xl h-9 border-border/60 focus:ring-primary/20 bg-muted/20 font-bold px-3 hover:border-primary/30 transition-all shadow-none focus:bg-background text-xs">
                                <SelectValue placeholder="Select Plan" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="rounded-xl bg-card border-border/40 shadow-2xl p-1.5">
                              <SelectItem value="none" className="rounded-lg py-1.5 px-3 focus:bg-primary/5 font-bold opacity-60 text-xs">{t('superadmin.form.no_plan')}</SelectItem>
                              {plans.map((p) => (
                                <SelectItem key={p.id} value={p.id.toString()} className="rounded-lg py-1.5 px-3 focus:bg-primary/5 font-bold text-xs">
                                  {p.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-[9px] uppercase font-black tracking-wider pl-1" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <DialogFooter className="pt-2 gap-2">
                    <Button type="button" variant="ghost" onClick={() => setIsOpen(false)} className="h-8 px-4 text-xs font-bold">
                      {t('superadmin.actions.cancel')}
                    </Button>
                    <Button type="submit" className="h-8 px-6 text-xs font-bold">
                      {t('superadmin.actions.save')}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}
