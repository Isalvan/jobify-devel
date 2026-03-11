import React, { useRef, useEffect } from 'react';
import DOMPurify from 'dompurify';

const SimpleEditor = ({ value, onChange, placeholder }) => {
    const editorRef = useRef(null);

    useEffect(() => {
        if (editorRef.current && value !== editorRef.current.innerHTML) {
            // Only update if content is different to avoid cursor jumping
            // Basic check, ideally would use a more robust comparison or only set on init
            if (!editorRef.current.innerHTML && value) {
                editorRef.current.innerHTML = DOMPurify.sanitize(value);
            } else if (value === '') {
                editorRef.current.innerHTML = '';
            }
        }
    }, [value]);

    const execCommand = (command, value = null) => {
        document.execCommand(command, false, value);
        handleChange();
        editorRef.current.focus();
    };

    const handleChange = () => {
        if (editorRef.current) {
            // Sanitize before sending to parent/state
            onChange(DOMPurify.sanitize(editorRef.current.innerHTML));
        }
    };

    return (
        <div className="border rounded overflow-hidden">
            <div className="bg-light border-bottom p-2 d-flex gap-2">
                <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary d-flex align-items-center justify-content-center"
                    onClick={() => execCommand('bold')}
                    title="Negrita"
                    style={{ width: '32px', height: '32px' }}
                >
                    <span className="material-symbols-outlined fs-6">format_bold</span>
                </button>
                <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary d-flex align-items-center justify-content-center"
                    onClick={() => execCommand('italic')}
                    title="Cursiva"
                    style={{ width: '32px', height: '32px' }}
                >
                    <span className="material-symbols-outlined fs-6">format_italic</span>
                </button>
                <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary d-flex align-items-center justify-content-center"
                    onClick={() => execCommand('insertUnorderedList')}
                    title="Lista con viñetas"
                    style={{ width: '32px', height: '32px' }}
                >
                    <span className="material-symbols-outlined fs-6">format_list_bulleted</span>
                </button>
                <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary d-flex align-items-center justify-content-center"
                    onClick={() => execCommand('insertOrderedList')}
                    title="Lista numerada"
                    style={{ width: '32px', height: '32px' }}
                >
                    <span className="material-symbols-outlined fs-6">format_list_numbered</span>
                </button>
            </div>
            <div
                ref={editorRef}
                className="p-3"
                style={{ minHeight: '150px', outline: 'none' }}
                contentEditable
                onInput={handleChange}
                onBlur={handleChange}
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(value) }}
            />
        </div>
    );
};

export default SimpleEditor;
