import { Navigate, Route, Routes } from "react-router-dom";
import LegacyPage from "./components/LegacyPage";
import { pageRoutes } from "./pageRoutes";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LegacyPage src="/legacy/index.html" title="Openline" />} />
      {pageRoutes.map(({ routePath, Component }) => (
        <Route key={routePath} path={routePath} element={<Component />} />
      ))}
      {pageRoutes.map(({ legacyRoutePath, Component }) => (
        <Route key={legacyRoutePath} path={legacyRoutePath} element={<Component />} />
      ))}
      <Route path="/home" element={<Navigate to="/" replace />} />
      <Route path="*" element={<LegacyPage src="/legacy/index.html" title="Openline" />} />
    </Routes>
  );
}
