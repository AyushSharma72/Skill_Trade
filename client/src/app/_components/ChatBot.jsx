"use client";
import { useState, useEffect } from "react";
const ChatBot = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    // Initialize the Botpress webchat toggle button
    const script = document.createElement("script");
    script.src = "https://cdn.botpress.cloud/webchat/v2.2/inject.js";
    script.defer = true;
    script.onload = () => {
      window.botpress.init({
        botId: process.env.NEXT_PUBLIC_BOT_ID,
        clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
        configuration: {
          composerPlaceholder: "Ask Skill Bot! 😎",
          botName: "Skill Bot",
          botAvatar:
            "https://files.bpcontent.cloud/2025/01/19/11/20250119110053-GI67AVRT.png",
          botDescription: "Hi, I am Skill Bot how can I help you?",
          color: "#020202",
          variant: "soft",
          themeMode: "dark",
          fontFamily: "inter",
          radius: 1,
        },
      });

      window.botpress.on("webchat:toggle", (isOpen) => {
        const container = document.getElementById("chatbot-container");
        if (isOpen) {
          container.style.display = "block";
          setIsChatOpen(true);
        } else {
          container.style.display = "none";
          setIsChatOpen(false);
        }
      });
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <>
      <div id="botpress-webchat" className="!fixed !left-[2%] !bottom-[2%]"></div>
      <div
        id="chatbot-container"
        className={`webchat fixed h-[600px] w-[400px] !left-[2%] !bottom-[2%] ${
          isChatOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
        style={{ display: "none" }}
      >
        <iframe
          className={`h-full w-full ${
            isChatOpen ? "pointer-events-auto" : "pointer-events-none"
          }`}
          srcDoc={`<!doctype html>
          <html lang="en">
            <head></head>
            <body>
              <script src="https://cdn.botpress.cloud/webchat/v2.2/inject.js"></script>
              <script defer>
                window.botpress.init({
                  "botId": "9d20dd1d-a9cd-447e-aaf3-a78f4fde92e5",
                  "clientId": "ae827dc7-ac9b-42a3-9db0-727c0024ffc9",
                  "configuration": {
                    "composerPlaceholder": "Ask Skill Bot! 😎",
                    "botName": "Skill Bot",
                    "botAvatar": "https://files.bpcontent.cloud/2025/01/19/11/20250119110053-GI67AVRT.png",
                    "botDescription": "Skill Bot is an intelligent chatbot designed to support users on the Skill Trade platform.",
                    "color": "#020202",
                    "variant": "soft",
                    "themeMode": "dark",
                    "fontFamily": "inter",
                    "radius": 1
                  }
                });
              </script>
            </body>
          </html>`}
        ></iframe>
      </div>
    </>
  );
};

export default ChatBot;
