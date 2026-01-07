import { useEffect, useLayoutEffect, useRef, useId } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

export default function QuillEditor({ value, onChange, placeholder = "", onImageInsert }) {
    const editorRef = useRef(null);
    const quillRef = useRef(null);
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

        // Сохраняем функцию для вставки изображений
        window.__quillInsertImage = (imgTag) => {
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

        // Очистка при размонтировании
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
            if (window.__quillInsertImage) {
                delete window.__quillInsertImage;
            }
            initializedRef.current = false;
            quillRef.current = null;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Запускаем только один раз при монтировании

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

    return (
        <div
            ref={editorRef}
            style={{
                background: "white",
                borderRadius: "8px",
                border: "1px solid #ddd",
                marginTop: "0.5rem",
            }}
        />
    );
}
