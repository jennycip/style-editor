import React, { useEffect, useState, useRef } from "react";
import { Pane } from "tweakpane";
import "./variables.css";
import "./App.css"; // Aggiungi il tuo file CSS personalizzato
import variables from "./theme.json";

interface ThemeState {
  [key: string]: string | any;
}

function App() {
  const [theme, setTheme] = useState<ThemeState>(() => {
    const themeConfig = require("./theme.json"); // carica il JSON iniziale
    return themeConfig;
  });

  const paneRef = useRef<HTMLDivElement>(null); // Ref per il contenitore del pannello
  const themeRef = useRef(theme); // Ref per il tema

  const saveTheme = (updatedTheme: ThemeState) => {
    console.log("Simulazione salvataggio tema nel JSON:", updatedTheme);
  };

  useEffect(() => {
    if (!paneRef.current) return;

    const pane = new Pane({ container: paneRef.current }); // Specifica il contenitore personalizzato

    Object.keys(theme).forEach((variable) => {
      const binding = pane.addBinding({ value: theme[variable] }, "value", {
        label: variable,
      });

      binding.on("change", (ev: any) => {
        setTheme((prev) => {
          const newTheme = { ...prev, [variable]: ev.value };
          themeRef.current = newTheme; // Aggiorna anche il ref
          return newTheme;
        });

        document.documentElement.style.setProperty(`--${variable}`, ev.value);
      });
    });

    pane.addButton({ title: "Apply Changes" }).on("click", () => {
      Object.keys(themeRef.current).forEach((variable) => {
        document.documentElement.style.setProperty(
          `--${variable}`,
          themeRef.current[variable]
        );
        console.log(`Updated --${variable}:`, themeRef.current[variable]);
      });
      saveTheme(themeRef.current);
      // Logga le variabili CSS aggiornate
      console.log("CSS Variables Updated:", themeRef.current);
    });

    return () => pane.dispose();
  }, []);

  console.log("Tema:", variables);

  return (
    <>
      <style>
        {`:root {
            ${Object.keys(variables).map((variable: any) => {
              return `--${variable}: ${theme[variable as any] as any};`;
            })}
          }`}
      </style>
      <div className="App">
        <div className="container">
          <h1 style={{ fontSize: theme["font-size"] }}>Titolo</h1>
          <p style={{ color: theme["secondary-color"] }}>Colore del testo</p>
        </div>
        <div ref={paneRef} className="tweakpane-container"></div>
      </div>
    </>
  );
}

export default App;
