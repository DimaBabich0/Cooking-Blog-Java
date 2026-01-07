import { useEffect, useLayoutEffect, useRef, useId } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import styles from "./QuillEditor.module.scss";

interface QuillEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onImageInsert?: (imgTag: string) => void;
}

export default function QuillEditor({
  value,
  onChange,
  placeholder = "",
  onImageInsert,
}: QuillEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);
  const initializedRef = useRef(false);
  const onChangeRef = useRef(onChange);
  const editorId = useId(); // Уникальный ID для каждого экземпляра

  // Обновляем ref при изменении onChange
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useLayoutEffect(() => {
    if (!editorRef.current) return;
    
    // Проверяем, не создан ли уже Quill редактор (проверяем наличие тулбара и контейнера)
    if (editorRef.current.querySelector('.ql-toolbar') || editorRef.current.querySelector('.ql-container')) {
      return; // Редактор уже создан
    }
    
    if (initializedRef.current || quillRef.current) return;
    
    // Устанавливаем уникальный data-атрибут для идентификации
    editorRef.current.setAttribute('data-quill-id', editorId);
    
    // Очищаем контейнер перед созданием редактора
    editorRef.current.innerHTML = "";
    initializedRef.current = true;

    // Создаем Quill редактор
    const quill = new Quill(editorRef.current, {
      theme: "snow",
      placeholder: placeholder,
      modules: {
        toolbar: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ color: [] }, { background: [] }],
          ["link", "image"],
          ["blockquote", "code-block"],
          ["clean"],
        ],
      },
    });

    quillRef.current = quill;

    // Устанавливаем начальное значение
    if (value) {
      quill.root.innerHTML = value;
    }

    // Обработчик изменений
    quill.on("text-change", () => {
      const html = quill.root.innerHTML;
      onChangeRef.current(html);
    });

    // Очистка при размонтировании
    return () => {
      quill.off("text-change");
    };
  }, []);

  // Обновляем значение при изменении извне
  useEffect(() => {
    if (quillRef.current && value !== quillRef.current.root.innerHTML) {
      const selection = quillRef.current.getSelection();
      quillRef.current.root.innerHTML = value;
      if (selection) {
        quillRef.current.setSelection(selection);
      }
    }
  }, [value]);

  // Экспортируем метод для вставки изображений через ref
  const insertImageRef = useRef<((imgTag: string) => void) | null>(null);

  useEffect(() => {
    if (quillRef.current) {
      insertImageRef.current = (imgTag: string) => {
        if (quillRef.current) {
          const range = quillRef.current.getSelection(true);
          if (range) {
            quillRef.current.clipboard.dangerouslyPasteHTML(range.index, imgTag);
            setTimeout(() => {
              const newLength = quillRef.current?.getLength() || 0;
              quillRef.current?.setSelection(newLength - 1);
            }, 0);
          } else {
            const length = quillRef.current.getLength();
            quillRef.current.clipboard.dangerouslyPasteHTML(length - 1, imgTag);
            setTimeout(() => {
              const newLength = quillRef.current?.getLength() || 0;
              quillRef.current?.setSelection(newLength - 1);
            }, 0);
          }
        }
      };

      // Сохраняем функцию для вставки изображений в window для доступа из ImageUploader
      (window as any).__quillInsertImage = insertImageRef.current;
    }

    return () => {
      if (quillRef.current) {
        try {
          quillRef.current.off("text-change");
        } catch (e) {
          // Игнорируем ошибки при очистке
        }
        // Полностью удаляем Quill из DOM
        if (editorRef.current) {
          const toolbar = editorRef.current.querySelector('.ql-toolbar');
          const container = editorRef.current.querySelector('.ql-container');
          if (toolbar) toolbar.remove();
          if (container) container.remove();
          editorRef.current.innerHTML = "";
        }
      }
      if ((window as any).__quillInsertImage) {
        delete (window as any).__quillInsertImage;
      }
      insertImageRef.current = null;
      initializedRef.current = false;
      quillRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Запускаем только один раз при монтировании

  return <div ref={editorRef} className={styles.editor} />;
}
