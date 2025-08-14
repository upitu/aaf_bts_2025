import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const LangCtx = createContext({ lang: "en", setLang: () => { }, isAr: false, pick: () => "", asset: () => "" });

export function LanguageProvider({ children }) {
    const [lang, setLang] = useState(() => localStorage.getItem("lang") || "en");

    useEffect(() => {
        localStorage.setItem("lang", lang);
        // set the html dir so native elements mirror
        document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
        document.documentElement.lang = lang;
    }, [lang]);

    // pick(en, ar): returns language-specific string
    const pick = (en, ar) => (lang === "ar" ? (ar ?? en) : en);

    // asset("/assets/file.svg") -> "/assets/file_ar.svg" if lang=ar
    const asset = (path) => (lang === "ar"
        ? path.replace(/(\.\w+)$/, "_ar$1")
        : path
    );

    const value = useMemo(() => ({ lang, setLang, isAr: lang === "ar", pick, asset }), [lang]);
    return <LangCtx.Provider value={value}>{children}</LangCtx.Provider>;
}

export const useLang = () => useContext(LangCtx);