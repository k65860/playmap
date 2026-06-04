import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { RecoilRoot } from "recoil";
import config from "./assets/config.ts";
import App from "./App.tsx";
import { CookiesProvider } from "react-cookie";
import "react-loading-skeleton/dist/skeleton.css";
import "./main.scss";

const rootElement = document.getElementById("root")!;
const root = createRoot(rootElement);
const client = new QueryClient();

root.render(
  <>
    <title>{config.DEFAULT.NAME}</title>
    <CookiesProvider>
      <QueryClientProvider client={client}>
        <RecoilRoot>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </RecoilRoot>
      </QueryClientProvider>
    </CookiesProvider>
  </>
);
