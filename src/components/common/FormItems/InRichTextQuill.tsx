"use client";
import { Form, FormInstance, Upload, Button as AntButton, message } from "antd";
import { NamePath } from "antd/es/form/interface";
import { useCallback, useMemo, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { UploadOutlined, VideoCameraOutlined } from "@ant-design/icons";
import { InputCommonProps } from "../../../../types/commonTypes";

const { Item } = Form;

interface Props<T> extends InputCommonProps<T> {
  form: FormInstance;
  defaultValue?: string;
  height?: number;
}

function InRichTextQuill<T>({
  name,
  label,
  placeholder = "Enter content here...",
  rules,
  form,
  disabled,
  readOnly,
  defaultValue = "",
  height = 300,
}: Props<T>) {
  const quillRef = useRef<ReactQuill>(null);

  // Custom image upload handler
  const imageHandler = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = () => {
      const file = input.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          const quill = quillRef.current?.getEditor();
          if (quill) {
            const range = quill.getSelection(true);
            quill.insertEmbed(range.index, "image", reader.result);
            quill.setSelection((range.index + 1) as any);
          }
        };
        reader.readAsDataURL(file);
      }
    };
  }, []);

  // Custom video embed handler
  const videoHandler = useCallback(() => {
    const url = prompt("Enter video URL (YouTube, Vimeo, etc.):");
    if (url) {
      const quill = quillRef.current?.getEditor();
      if (quill) {
        const range = quill.getSelection(true);

        // Handle YouTube URLs
        let embedUrl = url;
        if (url.includes("youtube.com/watch")) {
          const videoId = url.split("v=")[1]?.split("&")[0];
          embedUrl = `https://www.youtube.com/embed/${videoId}`;
        } else if (url.includes("youtu.be/")) {
          const videoId = url.split("youtu.be/")[1];
          embedUrl = `https://www.youtube.com/embed/${videoId}`;
        } else if (url.includes("vimeo.com/")) {
          const videoId = url.split("vimeo.com/")[1];
          embedUrl = `https://player.vimeo.com/video/${videoId}`;
        }

        quill.insertEmbed(range.index, "video", embedUrl);
        quill.setSelection((range.index + 1) as any);
      }
    }
  }, []);

  // Custom button handler
  const customButtonHandler = useCallback(() => {
    const buttonText = prompt("Enter button text:");
    if (buttonText) {
      const quill = quillRef.current?.getEditor();
      if (quill) {
        const range = quill.getSelection(true);
        const buttonHtml = `<button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-1" onclick="alert('Button clicked!')">${buttonText}</button>`;
        quill.clipboard.dangerouslyPasteHTML(range.index, buttonHtml);
        quill.setSelection(range.index + buttonText.length as any);
      }
    }
  }, []);

  // Quill modules configuration
  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ color: [] }, { background: [] }],
          [{ align: [] }],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ indent: "-1" }, { indent: "+1" }],
          ["blockquote", "code-block"],
          ["link", "image", "video"],
          ["clean"],
          // Custom buttons
          // ["custom-button"],
        ],
        handlers: {
          image: imageHandler,
          video: videoHandler,
          "custom-button": customButtonHandler,
        },
      },
      clipboard: {
        matchVisual: false,
      },
    }),
    [imageHandler, videoHandler, customButtonHandler],
  );

  // Quill formats
  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "align",
    "list",
    "bullet",
    "indent",
    "blockquote",
    "code-block",
    "link",
    "image",
    "video",
  ];

  const handleChange = (content: string) => {
    form.setFieldValue(name, content);
  };

  return (
    <Item<any> name={name as NamePath} label={label} rules={rules}>
      <div className='relative'>
        <ReactQuill
          ref={quillRef}
          theme='snow'
          value={defaultValue}
          onChange={handleChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
          readOnly={disabled || readOnly}
          style={{
            height: `${height}px`,
            marginBottom: "42px", // Space for toolbar
          }}
        />

        {/* Custom Toolbar Extension */}
        <div className='flex gap-2 mt-2 p-2 border-t'>
          {/* <AntButton
            size='small'
            icon={<UploadOutlined />}
            onClick={() => {
              // Table insertion
              const quill = quillRef.current?.getEditor();
              if (quill) {
                const range = quill.getSelection(true);
                const tableHtml = `
                                    <table class="border-collapse border border-gray-300 w-full my-4">
                                        <thead>
                                            <tr>
                                                <th class="border border-gray-300 px-4 py-2 bg-gray-100">Header 1</th>
                                                <th class="border border-gray-300 px-4 py-2 bg-gray-100">Header 2</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td class="border border-gray-300 px-4 py-2">Cell 1</td>
                                                <td class="border border-gray-300 px-4 py-2">Cell 2</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                `;
                quill.clipboard.dangerouslyPasteHTML(range.index, tableHtml);
              }
            }}
          >
            Insert Table
          </AntButton> */}

          <AntButton
            size='small'
            icon={<VideoCameraOutlined />}
            onClick={() => {
              // Embed handler
              const embedCode = prompt("Paste embed code (iframe, etc.):");
              if (embedCode) {
                const quill = quillRef.current?.getEditor();
                if (quill) {
                  const range = quill.getSelection(true);
                  quill.clipboard.dangerouslyPasteHTML(range.index, embedCode);
                }
              }
            }}
          >
            Embed Code
          </AntButton>
        </div>
      </div>

      <style jsx global>{`
        .ql-toolbar .ql-custom-button {
          width: auto;
        }
        .ql-toolbar .ql-custom-button:after {
          content: "Button";
          font-size: 12px;
        }

        /* Custom table styles */
        .ql-editor table {
          border-collapse: collapse;
          width: 100%;
          margin: 16px 0;
        }

        .ql-editor table td,
        .ql-editor table th {
          border: 1px solid #ddd;
          padding: 8px 12px;
          text-align: left;
        }

        .ql-editor table th {
          background-color: #f5f5f5;
          font-weight: bold;
        }

        /* Custom button styles in editor */
        .ql-editor button {
          margin: 4px 2px;
          cursor: pointer;
        }
      `}</style>
    </Item>
  );
}

export default InRichTextQuill;
