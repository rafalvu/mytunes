import React, { useState, useEffect } from "react";
import { audioSettings } from "@/data/api";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

const Settings = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isHighQuality, setIsHighQuality] = useState(true); // mp32 is default (high quality)

  // Check initial theme and audio quality on component mount
  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setIsDarkMode(isDark);

    // Load saved audio quality preference and sync with global settings
    const savedQuality = audioSettings.getFormat();
    setIsHighQuality(savedQuality === "mp32");
    audioSettings.setFormat(savedQuality as "mp32" | "mp31");
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);

    if (newTheme) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const toggleAudioQuality = (checked: boolean) => {
    setIsHighQuality(checked);
    const format = checked ? "mp32" : "mp31";
    // Store preference in localStorage and update global settings
    localStorage.setItem("audioQuality", format);
    audioSettings.setFormat(format);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <Separator className="my-4" />
      <div className="flex items-center justify-between mb-4">
        <span className="text-lg">Theme</span>
        <button
          onClick={toggleTheme}
          className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          {isDarkMode ? "☀️" : "🌙"}
        </button>
      </div>
      <Separator className="my-4" />
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-lg">Audio Quality</span>
          <p className="text-sm text-gray-500">
            {isHighQuality
              ? "High Quality (MP3 320kbps)"
              : "Low Quality (MP3 96kbps)"}
          </p>
        </div>
        <Switch checked={isHighQuality} onCheckedChange={toggleAudioQuality} />
      </div>
    </div>
  );
};

export default Settings;
