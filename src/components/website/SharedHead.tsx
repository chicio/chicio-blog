import {FC} from "react";

export const SharedHead: FC = () =>
    <head>
        <link
            rel="preload"
            href="/fonts/opensans/OpenSans-Regular.woff2"
            as="font"
            crossOrigin="anonymous"
        />
        <link
            rel="author"
            href="/humans.txt"
            type="text/plain"
        />
    </head>
