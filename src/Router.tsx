import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Home from "./routes/Home";
import Tv from "./routes/Tv";
import Search from "./routes/Search";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <App />,
      children: [
        {
          path: "",
          element: <Home />,
          children: [
            {
              path: "movies/:movieId",
              element: <></>,
            },
          ],
        },
        {
          path: "tv",
          element: <Tv />,
          children: [
            {
              path: ":tvId",
              element: <></>,
            },
          ],
        },
        {
          path: "search",
          element: <Search />,
          children: [
            {
              path: ":id",
              element: <></>,
            },
          ],
        },
      ],
    },
  ],
  { basename: process.env.PUBLIC_URL }
);

export default router;
