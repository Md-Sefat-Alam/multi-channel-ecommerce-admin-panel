import { ThemeProviderComp } from "@/contexts/ThemeContext";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import React from "react";
import "./globals.css";
import Head from "next/head";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Suddha || Admin",
    description: "",
    icons: {
        icon: "/logo.svg",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang='en'>
            <Head>
                <link rel='icon' href='/assets/logo/BEEMABOX3.png' />
            </Head>
            <body className={inter.className}>
                <AuthProvider>
                    <AntdRegistry>
                        <ThemeProviderComp>{children}</ThemeProviderComp>
                    </AntdRegistry>
                </AuthProvider>
            </body>
        </html>
    );
}
