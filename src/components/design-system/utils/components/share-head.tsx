import {FC} from "react";
import Head from "next/head";

export const SharedHead: FC = () =>
    <Head>
        <link
            rel="author"
            href="/humans.txt"
            type="text/plain"
        />
    </Head>
