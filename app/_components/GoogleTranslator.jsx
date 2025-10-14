"use client";

import React, { useEffect } from "react";

const GoogleTranslator = () => {
  useEffect(() => {
    // Define the Google Translate initialization function
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
        },
        "google_translate_element"
      );
    };

    // Load the Google Translate script
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src =
      "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);

    const customScript = document.createElement("script");
    customScript.innerHTML = `
      window.addEventListener("load", function () {
        document.body.style.display = "block";
      });

      window.gtranslateSettings = {
        "default_language": "en",
        "detect_browser_language": true,
        "wrapper_selector": ".gtranslate_wrapper"
      };
    `;
    document.body.appendChild(customScript);

    const floatScript = document.createElement("script");
    floatScript.src = "https://cdn.gtranslate.net/widgets/latest/float.js";
    floatScript.defer = true;
    document.body.appendChild(floatScript);
    return () => {
      document.body.removeChild(script);
      document.body.removeChild(customScript);
      document.body.removeChild(floatScript);
    };
  }, []);

  return (
    <div>
      <div className="gtranslate_wrapper"></div>
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <div id="google_translate_element"></div>
      </div>
    </div>
  );
};

export default GoogleTranslator;
