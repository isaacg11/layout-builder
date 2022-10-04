import React from "react";
import { createRoot } from "react-dom/client";
import Home from "./screens/Home";
import Dashboard from "./screens/Dashboard";

renderApp();

function renderApp() {

    // client-side routing
    const Index = ({ pathname }) => {
        switch (pathname) {
            case "/":
                return <Home />;
            case "/dashboard":
                return <Dashboard />
            default:
                return <Home />;
        }
    };

    let pathname = window.location.pathname;
    const root = createRoot(document.getElementById('root'));

    // render app
    root.render(
        <Index pathname={pathname} />
    );

    // if url changes, updates pathname and UI
    window.addEventListener("popstate", () => {
        pathname = window.location.pathname;
    });
}
