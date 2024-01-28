import { createHashRouter } from "react-router-dom";
import App from "./App";
import Home from "./routes/Home";
import Tv from "./routes/Tv";
import Search from "./routes/Search";

const router = createHashRouter(
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
            },
          ],
        },
        {
          path: "tv",
          element: <Tv />,
          children: [
            {
              path: ":tvId",
            },
          ],
        },
        {
          path: "search",
          element: <Search />,
          children: [
            {
              path: ":id",
            },
          ],
        },
      ],
    },
  ],
  { basename: process.env.PUBLIC_URL }
);

export default router;
