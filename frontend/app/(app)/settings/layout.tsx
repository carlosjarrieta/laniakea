"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { User, CreditCard, Shield, Bell } from "lucide-react";
import { useTranslations } from "@/hooks/use-translations";
import { useLanguage } from "@/components/providers/language-provider";

export default function SettingsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const { locale } = useLanguage();
    const { t } = useTranslations(locale);

    const menuItems = [
        {
            title: t('settings.menu.profile'),
            href: "/settings/profile",
            icon: User,
        },
        {
            title: t('settings.menu.billing'),
            href: "/settings/billing",
            icon: CreditCard,
        },
        {
            title: t('settings.menu.security'),
            href: "/settings/security",
            icon: Shield,
        },
        {
            title: t('settings.menu.notifications'),
            href: "/settings/notifications",
            icon: Bell,
        },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-foreground mb-0.5">
                    {t('settings.title')}
                </h1>
                <p className="text-xs md:text-sm text-muted-foreground">
                    {t('settings.subtitle')}
                </p>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
                {/* Sidebar Menu - horizontal scroll on mobile, vertical on desktop */}
                <aside className="w-full md:w-48 shrink-0">
                    <div className="flex md:flex-col gap-1 overflow-x-auto pb-2 md:pb-0">
                        {menuItems.map((item) => {
                            const isActive = pathname === item.href;
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap",
                                        isActive
                                            ? "bg-primary/10 text-primary dark:bg-primary/20"
                                            : "text-muted-foreground hover:bg-muted/60"
                                    )}
                                >
                                    <Icon size={16} />
                                    {item.title}
                                </Link>
                            );
                        })}
                    </div>
                </aside>

                {/* Main Content */}
                <div className="flex-1 min-w-0">
                    {children}
                </div>
            </div>
        </div>
    );
}
