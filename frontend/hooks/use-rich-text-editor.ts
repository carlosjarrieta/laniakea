import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import CharacterCount from '@tiptap/extension-character-count';
import Image from '@tiptap/extension-image';
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Typography from '@tiptap/extension-typography';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import ImageResize from 'tiptap-extension-resize-image';

interface UseRichTextEditorProps {
  content: string;
  placeholder?: string;
  onChange: (content: string) => void;
}

export function useRichTextEditor({ content, placeholder, onChange }: UseRichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: { keepMarks: true, keepAttributes: false },
        orderedList: { keepMarks: true, keepAttributes: false },
        heading: { levels: [1, 2, 3] },
      }),
      Placeholder.configure({
        placeholder: placeholder || 'Escribe tu contenido aquí...',
      }),
      Link.configure({
        openOnClick: false,
      }),
      CharacterCount,
      Image.configure({
        allowBase64: true,
      }),
      ImageResize,
      Underline,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({
        types: ['heading', 'paragraph', 'image'],
      }),
      TextStyle,
      Color,
      Typography,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[180px] p-4 text-sm font-sans',
      },
    },
  });

  const toggleBold = () => editor?.chain().focus().toggleBold().run();
  const toggleItalic = () => editor?.chain().focus().toggleItalic().run();
  const toggleUnderline = () => editor?.chain().focus().toggleUnderline().run();
  const toggleStrike = () => editor?.chain().focus().toggleStrike().run();
  const toggleHighlight = (color?: string) => editor?.chain().focus().toggleHighlight(color ? { color } : undefined).run();
  
  const toggleBulletList = () => editor?.chain().focus().toggleBulletList().run();
  const toggleOrderedList = () => editor?.chain().focus().toggleOrderedList().run();
  const toggleTaskList = () => editor?.chain().focus().toggleTaskList().run();
  const toggleBlockquote = () => editor?.chain().focus().toggleBlockquote().run();
  
  const setTextAlign = (align: 'left' | 'center' | 'right' | 'justify') => editor?.chain().focus().setTextAlign(align).run();
  const setHeading = (level: 1 | 2 | 3) => editor?.chain().focus().toggleHeading({ level }).run();
  const setTextColor = (color: string) => editor?.chain().focus().setColor(color).run();
  const clearFormatting = () => {
    editor?.chain().focus().unsetAllMarks().run();
    editor?.chain().focus().clearNodes().run();
  };

  const addImage = (url: string) => {
    if (url) {
      editor?.chain().focus().setImage({ src: url }).run();
    }
  };

  const addEmoji = (emoji: string) => {
    editor?.chain().focus().insertContent(emoji).run();
  };

  const undo = () => editor?.chain().focus().undo().run();
  const redo = () => editor?.chain().focus().redo().run();

  return {
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
    canUndo: editor?.can().undo(),
    canRedo: editor?.can().redo(),
    isActive: (nameOrAttributes: string | Record<string, any>, attributes?: any) => 
      editor?.isActive(nameOrAttributes as any, attributes),
    characterCount: editor?.storage.characterCount.characters() || 0,
    wordCount: editor?.storage.characterCount.words() || 0,
  };
}
