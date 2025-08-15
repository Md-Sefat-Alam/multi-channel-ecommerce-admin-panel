import React, { ReactNode, Ref, PropsWithChildren } from "react";
import ReactDOM from "react-dom";
import { cx, css } from "@emotion/css";

interface BaseProps {
    className?: string;
    [key: string]: unknown;
}

// Updated types for ref
export const Button = React.forwardRef<
    HTMLSpanElement,
    PropsWithChildren<
        {
            active: boolean;
            reversed: boolean;
        } & BaseProps
    >
>(({ className, active, reversed, ...props }, ref: Ref<HTMLSpanElement>) => (
    <span
        {...props}
        ref={ref}
        className={cx(
            className as any,
            css`
                cursor: pointer;
                color: ${reversed
                    ? active
                        ? "white"
                        : "#aaa"
                    : active
                    ? "black"
                    : "#ccc"};
            `
        )}
    />
));

export const EditorValue = React.forwardRef<
    HTMLDivElement,
    PropsWithChildren<
        {
            value: any;
        } & BaseProps
    >
>(({ className, value, ...props }, ref: Ref<HTMLDivElement>) => {
    const textLines = (value as any).document.nodes
        .map((node: { text: string }) => node.text)
        .toArray()
        .join("\n");
    return (
        <div
            ref={ref}
            {...props}
            className={cx(
                className as any,
                css`
                    margin: 30px -20px 0;
                `
            )}
        >
            <div
                className={css`
                    font-size: 14px;
                    padding: 5px 20px;
                    color: #404040;
                    border-top: 2px solid #eeeeee;
                    background: #f8f8f8;
                `}
            >
                Slate's value as text
            </div>
            <div
                className={css`
                    color: #404040;
                    font: 12px monospace;
                    white-space: pre-wrap;
                    padding: 10px 20px;
                    div {
                        margin: 0 0 0.5em;
                    }
                `}
            >
                {textLines}
            </div>
        </div>
    );
});

export const Icon = React.forwardRef<
    HTMLSpanElement,
    PropsWithChildren<BaseProps>
>(({ className, ...props }, ref: Ref<HTMLSpanElement>) => (
    <span
        {...props}
        ref={ref}
        className={cx(
            "material-icons",
            className as any,
            css`
                font-size: 18px;
                vertical-align: text-bottom;
            `
        )}
    />
));

export const Instruction = React.forwardRef<
    HTMLDivElement,
    PropsWithChildren<BaseProps>
>(({ className, ...props }, ref: Ref<HTMLDivElement>) => (
    <div
        {...props}
        ref={ref}
        className={cx(
            className as any,
            css`
                white-space: pre-wrap;
                margin: 0 -20px 10px;
                padding: 10px 20px;
                font-size: 14px;
                background: #f8f8e8;
            `
        )}
    />
));

export const Menu = React.forwardRef<
    HTMLDivElement,
    PropsWithChildren<BaseProps>
>(({ className, ...props }, ref: Ref<HTMLDivElement>) => (
    <div
        {...props}
        data-test-id='menu'
        ref={ref}
        className={cx(
            className as any,
            css`
                & > * {
                    display: inline-block;
                }

                & > * + * {
                    margin-left: 15px;
                }
            `
        )}
    />
));

export const Portal = ({ children }: { children?: ReactNode }) => {
    return typeof document === "object"
        ? ReactDOM.createPortal(children, document.body)
        : null;
};

export const Toolbar = React.forwardRef<
    HTMLDivElement,
    PropsWithChildren<BaseProps>
>(({ className, ...props }, ref: Ref<HTMLDivElement>) => (
    <Menu
        {...props}
        ref={ref}
        className={cx(
            className as any,
            css`
                position: relative;
                padding: 1px 18px 17px;
                margin: 0 -20px;
                border-bottom: 2px solid #eee;
                margin-bottom: 20px;
            `
        )}
    />
));
