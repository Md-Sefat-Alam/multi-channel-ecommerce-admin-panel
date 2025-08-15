"use client";
import {
    Button,
    Toolbar,
} from "@/app/(root)/product-management/products/create-product/components";
import { IsJsonString } from "@/lib/utils/Json";
import { CodeOutlined, ItalicOutlined } from "@ant-design/icons"; // antd icons
import { Col, Form, FormInstance, theme } from "antd";
import { NamePath } from "antd/es/form/interface";
import classNames from "classnames";
import isHotkey from "is-hotkey";
import { useCallback, useEffect, useMemo } from "react";
import {
    FaAlignCenter,
    FaAlignJustify,
    FaAlignLeft,
    FaAlignRight,
    FaListOl,
    FaListUl,
    FaQuoteRight,
} from "react-icons/fa6";
import { LuHeading1, LuHeading2 } from "react-icons/lu";
import { MdFormatBold, MdFormatUnderlined } from "react-icons/md"; // react-icons
import {
    BaseElement,
    BaseText,
    createEditor,
    Editor,
    Element as SlateElement,
    Transforms,
} from "slate";
import { withHistory } from "slate-history";
import { Editable, Slate, useSlate, withReact } from "slate-react";
import { InputCommonProps } from "../../../../types/commonTypes";
const { Item } = Form;

interface CustomText extends BaseText {
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    code?: boolean;
}

interface CustomElement extends BaseElement {
    type: string;
    align?: string;
    [key: string]: any; // Allow indexing by string
}
interface Props<T> extends InputCommonProps<T> {
    form: FormInstance;
    defaultValue?: any;
}

const { useToken } = theme;

const HOTKEYS = {
    "mod+b": "bold",
    "mod+i": "italic",
    "mod+u": "underline",
    "mod+`": "code",
};

const LIST_TYPES = ["numbered-list", "bulleted-list"];
const TEXT_ALIGN_TYPES = ["left", "center", "right", "justify"];

function InRichText<T>({
    name,
    bPoint,
    label,
    placeholder,
    rules,
    size,
    form,
    disabled,
    readOnly,
    defaultValue,
}: Props<T>) {
    const renderElement = useCallback(
        (props: any) => <Element {...props} />,
        []
    );
    const renderLeaf = useCallback((props: any) => <Leaf {...props} />, []);
    const editor = useMemo(() => withHistory(withReact(createEditor())), []);

    const handleChange = useCallback(() => {
        const content = JSON.stringify(editor.children);
        form.setFieldValue(name, content);
        Transforms;
    }, [editor, form]);

    useEffect(() => {
        if (defaultValue) {
            const value = IsJsonString(defaultValue)
                ? JSON.parse(defaultValue)
                : initialValue;

            editor.children = value;
            editor.onChange();
        }
    }, [defaultValue, editor]);

    return (
        <Col xs={24}>
            <Item<any> name={name as NamePath} label={label} rules={rules}>
                <Slate
                    onChange={handleChange}
                    editor={editor}
                    initialValue={initialValue}
                >
                    <Toolbar>
                        <MarkButton
                            format='bold'
                            IconComponent={MdFormatBold}
                        />
                        <MarkButton
                            format='italic'
                            IconComponent={ItalicOutlined}
                        />
                        <MarkButton
                            format='underline'
                            IconComponent={MdFormatUnderlined}
                        />
                        <MarkButton
                            format='code'
                            IconComponent={CodeOutlined}
                        />
                        <BlockButton
                            format='heading-one'
                            IconComponent={LuHeading1}
                        />
                        <BlockButton
                            format='heading-two'
                            IconComponent={LuHeading2}
                        />
                        <BlockButton
                            format='block-quote'
                            IconComponent={FaQuoteRight}
                        />
                        <BlockButton
                            format='numbered-list'
                            IconComponent={FaListOl}
                        />
                        <BlockButton
                            format='bulleted-list'
                            IconComponent={FaListUl}
                        />
                        <BlockButton
                            format='left'
                            IconComponent={FaAlignLeft}
                        />
                        <BlockButton
                            format='center'
                            IconComponent={FaAlignCenter}
                        />
                        <BlockButton
                            format='right'
                            IconComponent={FaAlignRight}
                        />
                        <BlockButton
                            format='justify'
                            IconComponent={FaAlignJustify}
                        />
                    </Toolbar>
                    <Editable
                        renderElement={renderElement}
                        renderLeaf={renderLeaf}
                        placeholder='Enter description here'
                        style={{
                            padding: "10px",
                            minHeight: "200px",
                            borderRadius: "10px",
                        }}
                        className={classNames(`focus:outline-gray-500 border`)}
                        spellCheck
                        autoFocus
                        onKeyDown={(event) => {
                            for (const hotkey in HOTKEYS) {
                                if (isHotkey(hotkey, event as any)) {
                                    event.preventDefault();
                                    const mark =
                                        HOTKEYS[hotkey as keyof typeof HOTKEYS];
                                    toggleMark(editor, mark);
                                }
                            }
                        }}
                        readOnly={disabled || readOnly}
                    />
                </Slate>
            </Item>
        </Col>
    );
}

const toggleBlock = (editor: any, format: string) => {
    const isActive = isBlockActive(
        editor,
        format,
        TEXT_ALIGN_TYPES.includes(format) ? "align" : "type"
    );
    const isList = LIST_TYPES.includes(format);

    Transforms.unwrapNodes(editor, {
        match: (n) =>
            !Editor.isEditor(n) &&
            SlateElement.isElement(n) &&
            LIST_TYPES.includes((n as any).type) &&
            !TEXT_ALIGN_TYPES.includes(format),
        split: true,
    });

    // here should be SlateElement type but now i'm giving any because align doesn't exist.
    let newProperties: Partial<any>;
    if (TEXT_ALIGN_TYPES.includes(format)) {
        newProperties = {
            align: isActive ? undefined : format,
        };
    } else {
        newProperties = {
            type: isActive ? "paragraph" : isList ? "list-item" : format,
        };
    }

    Transforms.setNodes<SlateElement>(editor, newProperties);

    if (!isActive && isList) {
        const block = { type: format, children: [] };
        Transforms.wrapNodes(editor, block);
    }
};

const toggleMark = (editor: any, format: string) => {
    const isActive = isMarkActive(editor, format);

    if (isActive) {
        Editor.removeMark(editor, format);
    } else {
        Editor.addMark(editor, format, true);
    }
};

const isBlockActive = (editor: any, format: string, blockType = "type") => {
    const { selection } = editor;
    if (!selection) return false;

    const [match] = Array.from(
        Editor.nodes(editor, {
            at: Editor.unhangRange(editor, selection),
            match: (n) =>
                !Editor.isEditor(n) &&
                SlateElement.isElement(n) &&
                (n as any)[blockType] === format, // Using 'as any' to bypass the error
        })
    );

    return !!match;
};

const isMarkActive = (editor: any, format: string) => {
    const marks: any = Editor?.marks(editor);
    return marks ? marks[format] === true : false;
};

const Element = ({ attributes, children, element }: any) => {
    const style = { textAlign: element.align };
    switch (element.type) {
        case "block-quote":
            return (
                <blockquote
                    style={style}
                    className='border-l-4 my-2 border-gray-300 pl-4 italic text-gray-600'
                    {...attributes}
                >
                    {children}
                </blockquote>
            );
        case "bulleted-list":
            return (
                <ul
                    style={style}
                    className='list-disc list-inside pl-5'
                    {...attributes}
                >
                    {children}
                </ul>
            );
        case "heading-one":
            return (
                <h1
                    style={style}
                    className='text-4xl font-bold mb-4'
                    {...attributes}
                >
                    {children}
                </h1>
            );
        case "heading-two":
            return (
                <h2
                    style={style}
                    className='text-3xl font-semibold mb-3'
                    {...attributes}
                >
                    {children}
                </h2>
            );
        case "list-item":
            return (
                <li style={style} className='mb-2' {...attributes}>
                    {children}
                </li>
            );
        case "numbered-list":
            return (
                <ol
                    style={style}
                    className='list-decimal list-inside pl-5'
                    {...attributes}
                >
                    {children}
                </ol>
            );
        default:
            return (
                <p style={style} {...attributes}>
                    {children}
                </p>
            );
    }
};

const Leaf = ({ attributes, children, leaf }: any) => {
    if (leaf.bold) {
        children = <strong>{children}</strong>;
    }

    if (leaf.code) {
        children = <code>{children}</code>;
    }

    if (leaf.italic) {
        children = <em>{children}</em>;
    }

    if (leaf.underline) {
        children = <u>{children}</u>;
    }

    return <span {...attributes}>{children}</span>;
};

const BlockButton = ({ format, IconComponent }: any) => {
    const editor = useSlate();
    return (
        <Button
            active={isBlockActive(
                editor,
                format,
                TEXT_ALIGN_TYPES.includes(format) ? "align" : "type"
            )}
            onMouseDown={(event: any) => {
                event.preventDefault();
                toggleBlock(editor, format);
            }}
        >
            <IconComponent />
        </Button>
    );
};

const MarkButton = ({ format, IconComponent }: any) => {
    const editor = useSlate();
    return (
        <Button
            active={isMarkActive(editor, format)}
            onMouseDown={(event: any) => {
                event.preventDefault();
                toggleMark(editor, format);
            }}
        >
            <IconComponent />
        </Button>
    );
};

// Descendant this type will be here but now applying any because type : 'paragraph' is not exist
const initialValue: any[] = [
    {
        type: "paragraph",
        children: [{ text: "" }],
    },
];

export default InRichText;
