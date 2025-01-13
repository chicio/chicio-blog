import {FC} from "react";
import Head from "next/head";

export const SharedHead: FC = () =>
    <Head>
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
    </Head>
