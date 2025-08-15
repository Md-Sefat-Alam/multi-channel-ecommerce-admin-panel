"use client";

import { ConfigProvider, theme as antdTheme } from "antd";
import { ThemeProvider, useTheme } from "next-themes";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import { useEffect, useMemo, useState } from "react";

export default function ThemeInitializer({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { resolvedTheme } = useTheme();
  const [isClient, setIsClient] = useState(false);
  const [theme, setTheme] = useState(resolvedTheme);

  // Detect when we're on the client side
  useEffect(() => {
    setIsClient(true);

    // Safely access localStorage when the component is mounted
    const storedTheme = localStorage.getItem("theme") || "light";
    setTheme(storedTheme);
  }, [resolvedTheme]);

  // Memoize the theme algorithm based on the current theme state
  const themeAlgorithm = useMemo(() => {
    return theme === "light"
      ? antdTheme.defaultAlgorithm
      : antdTheme.darkAlgorithm;
  }, [theme]);

  // Only render when client-side
  if (!isClient) return null;

  const lightTheme = {
    algorithm: themeAlgorithm,
    // token: {
    //   // Primary color (Atomic Tangerine)
    //   colorPrimary: "#ff914c",

    //   // Success color (Light Orange)
    //   colorSuccess: "#f6dcbe",

    //   // Warning color (Hunyadi Yellow)
    //   colorWarning: "#febd59",

    //   // Error color (Atomic Tangerine)
    //   colorError: "#febd59ff",

    //   // Background base (Floral White)
    //   // colorBgBase: "#f8f4eb",
    //   // colorBgBase: "#f8f4eb",

    //   // Background container (Light Orange)
    //   // colorBgContainer: "#f8f4eb",
    //   // colorBgContainer: "#f6dcbe",

    //   // Text color (Atomic Tangerine)
    //   // colorText: "#ff914c",

    //   // Border color (Light Orange)
    //   colorBorder: "#f6dcbe",

    //   // Shadow color (Hunyadi Yellow)
    //   colorShadow: "#febd59",
    // },
  };

  // Dark Theme Configuration
  const darkTheme = {
    algorithm: themeAlgorithm,
    // token: {
    //   // Primary color (Atomic Tangerine)
    //   colorPrimary: "#ff914c",

    //   // Success color (Light Orange)
    //   colorSuccess: "#f6dcbe",

    //   // Warning color (Hunyadi Yellow)
    //   colorWarning: "#febd59",

    //   // Error color (Atomic Tangerine)
    //   colorError: "#febd59ff",

    //   // Dark mode background base (Dark Gray)
    //   colorBgBase: "#1a1a1a",

    //   // Dark mode background container (Darker Gray)
    //   colorBgContainer: "#333333",

    //   // Text color for dark mode (Floral White)
    //   colorText: "#f8f4eb",

    //   // Border color (Light Orange)
    //   colorBorder: "rgba(246, 220, 190, 0.2)",

    //   // Shadow color (Hunyadi Yellow)
    //   // colorShadow: "#febd59",
    // },
  };

  return (
    <ConfigProvider theme={theme === "light" ? lightTheme : darkTheme}>
      <ProgressBar
        height="4px"
        // color={'gray'}
        options={{ showSpinner: false }}
        shallowRouting
      />
      {children}
    </ConfigProvider>
  );
}

export const ThemeProviderComp: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { resolvedTheme, theme } = useTheme();

  // Ensure that the defaultTheme is correctly set based on the resolvedTheme or initial theme
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme={resolvedTheme || theme || "light"}
      enableSystem={false} // Disable system theme detection if not needed
    >
      <ThemeInitializer>{children}</ThemeInitializer>
    </ThemeProvider>
  );
};
