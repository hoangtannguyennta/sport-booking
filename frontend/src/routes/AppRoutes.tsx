import { Routes, Route, Navigate } from "react-router-dom";
import routes from "./routes";

const AppRouter = () => {
  return (
    <Routes>
      {routes.map((route, index) => {
        const Component = route.component;

        return (
          <Route
            key={index}
            path={route.path}
            element={<Component />}
          />
        );
      })}

      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
};

export default AppRouter;
