import { createContext, useContext, useState, useEffect } from "react";
import { fetchSettings } from "../../api/queries";

const SettingsContext = createContext(null);

const defaultSettings = {
  phone: "+880 1700 000000",
  email: "hello@siratclothing.com",
  address: "Dhaka, Bangladesh",
  facebook: "https://www.facebook.com/sirat2026",
  instagram: "https://instagram.com",
  whatsapp: "https://wa.me/8801700000000",
  tagline: "Purity in Every Step",
  description: "আপনার পোশাকে আসুক শুদ্ধতার ছোঁয়া। আমরা বিশ্বাস করি কোয়ালিটি এবং সততায়। imported premium fabric এবং 100% combed cotton এ তৈরি কাস্টম প্রিন্টেড টি-শার্টের নির্ভরযোগ্য ঠিকানা।"
};

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await fetchSettings();
        if (data) {
          setSettings(data);
        }
      } catch (err) {
        console.warn("Failed to load settings from backend API, using defaults:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, isLoading }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
