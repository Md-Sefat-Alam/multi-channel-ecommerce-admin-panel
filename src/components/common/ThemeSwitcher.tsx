"use client";

import { BulbOutlined, MoonOutlined } from "@ant-design/icons";
import { useTheme } from "next-themes";

// Main component
const ThemeSwitcher: React.FC = () => {
  const { resolvedTheme, setTheme, theme } = useTheme();

  return (
    <div>
      {theme === 'light' ? (
        <BulbOutlined
          onClick={() => {
            setTheme('dark');
          }}
          className="cursor-pointer text-xl hover:bg-gray-400/50 p-2 hover:rounded-full"
        />
      ) : (
        <MoonOutlined
          onClick={() => {
            setTheme('light');
          }}
          className="cursor-pointer text-xl hover:bg-gray-400/50 p-2 hover:rounded-full"
        />
      )}
    </div>
  );
};

export default ThemeSwitcher;
