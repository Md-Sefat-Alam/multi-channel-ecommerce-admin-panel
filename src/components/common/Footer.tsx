"use client";
import { Layout } from "antd";
const { Footer: FooterAntd } = Layout;

type Props = {};

export default function Footer({}: Props) {
    return (
        <FooterAntd style={{ textAlign: "center" }}>
            Ant Design ©{new Date().getFullYear()}
        </FooterAntd>
    );
}
