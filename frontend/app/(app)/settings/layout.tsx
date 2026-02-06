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
        <div className="p-8 space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-zinc-900 mb-1">
                    {t('settings.title')}
                </h1>
                <p className="text-zinc-500">
                    {t('settings.subtitle')}
                </p>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar Menu */}
                <aside className="w-full md:w-64 space-y-1">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400"
                                        : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                                )}
                            >
                                <Icon size={18} />
                                {item.title}
                            </Link>
                        );
                    })}
                </aside>

                {/* Main Content */}
                <div className="flex-1">
                    {children}
                </div>
            </div>
        </div>
    );
}
