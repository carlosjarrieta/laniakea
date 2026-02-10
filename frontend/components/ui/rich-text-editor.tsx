"use client";

import { useRef, useState } from 'react';
import { EditorContent } from '@tiptap/react';
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List, 
  ListOrdered, 
  CheckSquare,
  Quote, 
  Undo, 
  Redo,
  Smile,
  Type,
  Image as ImageIcon,
  Highlighter,
  Palette,
  Eraser,
  ChevronDown
} from 'lucide-react';
import { Button } from './button';
import { Separator } from './separator';
import { cn } from '@/lib/utils';
import { useRichTextEditor } from '@/hooks/use-rich-text-editor';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';
import { useLanguage } from '../providers/language-provider';
import { useTranslations } from '@/hooks/use-translations';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import EmojiPicker, { Theme } from 'emoji-picker-react';
import { useTheme } from 'next-themes';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
  label?: string;
}

const COLORS = [
  { name: 'Default', value: 'inherit' },
  { name: 'Primary', value: 'hsl(var(--primary))' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Amber', value: '#f59e0b' },
  { name: 'Yellow', value: '#eab308' },
  { name: 'Lime', value: '#84cc16' },
  { name: 'Green', value: '#22c55e' },
  { name: 'Emerald', value: '#10b981' },
  { name: 'Teal', value: '#14b8a6' },
  { name: 'Cyan', value: '#06b6d4' },
  { name: 'Sky', value: '#0ea5e9' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Indigo', value: '#6366f1' },
  { name: 'Violet', value: '#8b5cf6' },
  { name: 'Purple', value: '#a855f7' },
  { name: 'Fuchsia', value: '#d946ef' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Rose', value: '#f43f5e' },
];

const HIGHLIGHTS = [
  { name: 'Yellow', value: '#fef08a' },
  { name: 'Green', value: '#bbf7d0' },
  { name: 'Blue', value: '#bfdbfe' },
  { name: 'Pink', value: '#fbcfe8' },
  { name: 'Purple', value: '#e9d5ff' },
];

export function RichTextEditor({ 
  content, 
  onChange, 
  placeholder,
  className,
  label
}: RichTextEditorProps) {
  const { locale } = useLanguage();
  const { t } = useTranslations(locale);
  const { resolvedTheme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);
  
  const { 
    editor, 
    toggleBold, 
    toggleItalic, 
    toggleUnderline,
    toggleStrike,
    toggleHighlight,
    toggleBulletList, 
    toggleOrderedList, 
    toggleTaskList,
    toggleBlockquote, 
    setTextAlign,
    setHeading,
    setTextColor,
    clearFormatting,
    addImage,
    addEmoji,
    undo, 
    redo,
    canUndo,
    canRedo,
    isActive,
    characterCount,
    wordCount
  } = useRichTextEditor({ 
    content, 
    placeholder: placeholder || t('common.rich_text_editor.placeholder'), 
    onChange 
  });

  if (!editor) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        addImage(url);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider ml-0.5 flex items-center gap-1.5">
          <Type size={12} className="text-primary" />
          {label}
        </label>
      )}
      
      <div className={cn(
        "flex flex-col w-full rounded-xl border border-border/40 bg-muted/5 overflow-hidden focus-within:ring-1 focus-within:ring-primary/20 focus-within:border-primary/50 transition-all",
        className
      )}>
        <TooltipProvider delayDuration={400}>
          {/* Toolbar Toolbar Toolbar */}
          <div className="flex flex-wrap items-center gap-0.5 p-1 border-b border-border/40 bg-muted/30">
            
            {/* Headings */}
            <DropdownMenu>
              <Tooltip>
                <DropdownMenuTrigger asChild>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 gap-1 px-2 text-[10px] font-bold uppercase transition-colors">
                      <Type size={14} className="text-primary" />
                      <ChevronDown size={10} className="opacity-50" />
                    </Button>
                  </TooltipTrigger>
                </DropdownMenuTrigger>
                <TooltipContent side="top" className="text-[10px] font-bold">Encabezados</TooltipContent>
              </Tooltip>
              <DropdownMenuContent align="start" className="w-40">
                <DropdownMenuItem onClick={() => setHeading(1)} className={cn(isActive('heading', { level: 1 }) && "bg-primary/10 text-primary")}>
                  <Heading1 size={14} className="mr-2" /> {t('common.rich_text_editor.heading_1')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setHeading(2)} className={cn(isActive('heading', { level: 2 }) && "bg-primary/10 text-primary")}>
                  <Heading2 size={14} className="mr-2" /> {t('common.rich_text_editor.heading_2')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setHeading(3)} className={cn(isActive('heading', { level: 3 }) && "bg-primary/10 text-primary")}>
                  <Heading3 size={14} className="mr-2" /> {t('common.rich_text_editor.heading_3')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setHeading(1 as any)} className={cn(!isActive('heading') && "bg-primary/10 text-primary")}>
                  <Type size={14} className="mr-2" /> Texto Párrafo
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Separator orientation="vertical" className="h-4 mx-0.5 bg-border/40" />

            {/* Basic Formatting */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={toggleBold} className={cn("h-8 w-8 p-0 rounded-lg", isActive('bold') && "bg-primary/10 text-primary animate-in zoom-in-95")}>
                  <Bold size={14} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-[10px] font-bold">{t('common.rich_text_editor.bold')}</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={toggleItalic} className={cn("h-8 w-8 p-0 rounded-lg", isActive('italic') && "bg-primary/10 text-primary animate-in zoom-in-95")}>
                  <Italic size={14} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-[10px] font-bold">{t('common.rich_text_editor.italic')}</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={toggleUnderline} className={cn("h-8 w-8 p-0 rounded-lg", isActive('underline') && "bg-primary/10 text-primary animate-in zoom-in-95")}>
                  <UnderlineIcon size={14} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-[10px] font-bold">{t('common.rich_text_editor.underline')}</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={toggleStrike} className={cn("h-8 w-8 p-0 rounded-lg", isActive('strike') && "bg-primary/10 text-primary animate-in zoom-in-95")}>
                  <Strikethrough size={14} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-[10px] font-bold">{t('common.rich_text_editor.strike')}</TooltipContent>
            </Tooltip>

            <Separator orientation="vertical" className="h-4 mx-0.5 bg-border/40" />

            {/* Colors & Highlights */}
            <DropdownMenu>
              <Tooltip>
                <DropdownMenuTrigger asChild>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 transition-colors">
                      <Palette size={14} className="text-primary" />
                    </Button>
                  </TooltipTrigger>
                </DropdownMenuTrigger>
                <TooltipContent side="top" className="text-[10px] font-bold">{t('common.rich_text_editor.text_color')}</TooltipContent>
              </Tooltip>
              <DropdownMenuContent align="center" className="p-2 grid grid-cols-5 gap-1 min-w-0 w-auto">
                {COLORS.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setTextColor(color.value)}
                    className="h-6 w-6 rounded-md border border-border/40 transition-transform hover:scale-110 active:scale-90"
                    style={{ backgroundColor: color.value === 'inherit' ? 'transparent' : color.value }}
                    title={color.name}
                  >
                    {color.value === 'inherit' && <Eraser size={10} className="mx-auto" />}
                  </button>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <Tooltip>
                <DropdownMenuTrigger asChild>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className={cn("h-8 w-8 p-0 transition-colors", isActive('highlight') && "bg-primary/10 text-primary")}>
                      <Highlighter size={14} className="text-primary" />
                    </Button>
                  </TooltipTrigger>
                </DropdownMenuTrigger>
                <TooltipContent side="top" className="text-[10px] font-bold">{t('common.rich_text_editor.highlight')}</TooltipContent>
              </Tooltip>
              <DropdownMenuContent align="center" className="p-2 flex gap-1 min-w-0 w-auto">
                {HIGHLIGHTS.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => toggleHighlight(color.value)}
                    className="h-6 w-6 rounded-md border border-border/40 transition-transform hover:scale-110 active:scale-90"
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
                <button
                  onClick={() => toggleHighlight()}
                  className="h-6 w-6 rounded-md border border-border/40 bg-background flex items-center justify-center transition-transform hover:scale-110 active:scale-90"
                >
                  <Eraser size={10} />
                </button>
              </DropdownMenuContent>
            </DropdownMenu>

            <Separator orientation="vertical" className="h-4 mx-0.5 bg-border/40" />

            {/* Alignment */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={() => setTextAlign('left')} className={cn("h-8 w-8 p-0 rounded-lg", isActive({ textAlign: 'left' }) && "bg-primary/10 text-primary")}>
                  <AlignLeft size={14} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-[10px] font-bold">{t('common.rich_text_editor.align_left')}</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={() => setTextAlign('center')} className={cn("h-8 w-8 p-0 rounded-lg", isActive({ textAlign: 'center' }) && "bg-primary/10 text-primary")}>
                  <AlignCenter size={14} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-[10px] font-bold">{t('common.rich_text_editor.align_center')}</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={() => setTextAlign('right')} className={cn("h-8 w-8 p-0 rounded-lg", isActive({ textAlign: 'right' }) && "bg-primary/10 text-primary")}>
                  <AlignRight size={14} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-[10px] font-bold">{t('common.rich_text_editor.align_right')}</TooltipContent>
            </Tooltip>

            <Separator orientation="vertical" className="h-4 mx-0.5 bg-border/40" />

            {/* Lists & More */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={toggleBulletList} className={cn("h-8 w-8 p-0 rounded-lg", isActive('bulletList') && "bg-primary/10 text-primary")}>
                  <List size={14} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-[10px] font-bold">{t('common.rich_text_editor.bullet_list')}</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={toggleOrderedList} className={cn("h-8 w-8 p-0 rounded-lg", isActive('orderedList') && "bg-primary/10 text-primary")}>
                  <ListOrdered size={14} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-[10px] font-bold">{t('common.rich_text_editor.ordered_list')}</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={toggleTaskList} className={cn("h-8 w-8 p-0 rounded-lg", isActive('taskList') && "bg-primary/10 text-primary")}>
                  <CheckSquare size={14} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-[10px] font-bold">{t('common.rich_text_editor.task_list')}</TooltipContent>
            </Tooltip>

            <Separator orientation="vertical" className="h-4 mx-0.5 bg-border/40" />

            {/* Image & Formatting 관리 */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={() => fileInputRef.current?.click()} className="h-8 w-8 p-0 rounded-lg hover:text-primary">
                  <ImageIcon size={14} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-[10px] font-bold">{t('common.rich_text_editor.add_image')}</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={clearFormatting} className="h-8 w-8 p-0 rounded-lg hover:text-destructive">
                  <Eraser size={14} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-[10px] font-bold">{t('common.rich_text_editor.clear_formatting')}</TooltipContent>
            </Tooltip>

            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />

            <div className="ml-auto flex items-center gap-0.5">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={undo} disabled={!canUndo} className="h-8 w-8 p-0 rounded-lg text-muted-foreground">
                    <Undo size={14} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-[10px] font-bold">{t('common.rich_text_editor.undo')}</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={redo} disabled={!canRedo} className="h-8 w-8 p-0 rounded-lg text-muted-foreground">
                    <Redo size={14} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-[10px] font-bold">{t('common.rich_text_editor.redo')}</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </TooltipProvider>

        {/* Editor Content Area */}
        <div className="relative group/editor min-h-[150px]">
          <EditorContent editor={editor} />
        </div>

        {/* Footer / Stats Footer / Stats */}
        <div className="flex items-center justify-between px-3 py-1.5 bg-muted/10 border-t border-border/10">
          <div className="flex items-center gap-3 text-[9px] font-bold text-muted-foreground uppercase tracking-widest opacity-70">
            <span>{characterCount} {t('common.rich_text_editor.characters')}</span>
            <div className="h-1 w-1 rounded-full bg-border" />
            <span>{wordCount} {t('common.rich_text_editor.words')}</span>
          </div>
          
          <DropdownMenu open={isEmojiOpen} onOpenChange={setIsEmojiOpen}>
            <TooltipProvider>
              <Tooltip>
                <DropdownMenuTrigger asChild>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className={cn("h-6 w-6 rounded-full text-muted-foreground hover:text-primary transition-all", isEmojiOpen && "text-primary bg-primary/10 rotate-12")}>
                      <Smile size={14} />
                    </Button>
                  </TooltipTrigger>
                </DropdownMenuTrigger>
                <TooltipContent side="top" className="text-[10px] font-bold">{t('common.rich_text_editor.emojis')}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <DropdownMenuContent align="end" className="p-0 border-none bg-transparent shadow-none">
              <EmojiPicker theme={resolvedTheme === 'dark' ? Theme.DARK : Theme.LIGHT} onEmojiClick={(emojiData) => { addEmoji(emojiData.emoji); setIsEmojiOpen(false); }} />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
