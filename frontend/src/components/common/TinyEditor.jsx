import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import DOMPurify from 'dompurify';

const TinyEditor = ({ value, onChange, placeholder, height = 300 }) => {
    const editorRef = useRef(null);

    return (
        <div className="border rounded overflow-hidden">
            <Editor
                tinymceScriptSrc="https://cdnjs.cloudflare.com/ajax/libs/tinymce/6.8.2/tinymce.min.js"
                onInit={(evt, editor) => editorRef.current = editor}
                value={value}
                onEditorChange={(newValue, editor) => {
                    // Sanitize content before sending to parent
                    onChange(DOMPurify.sanitize(newValue));
                }}
                init={{
                    height: height,
                    menubar: false,
                    plugins: [
                        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                        'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                    ],
                    toolbar: 'undo redo | blocks | ' +
                        'bold italic forecolor | alignleft aligncenter ' +
                        'alignright alignjustify | bullist numlist outdent indent | ' +
                        'removeformat | help',
                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                    placeholder: placeholder
                }}
            />
        </div>
    );
};

export default TinyEditor;
