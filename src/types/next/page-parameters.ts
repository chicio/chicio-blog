export type NextParameters<Params> = { params: Promise<Params> }

export type TagParameters = { tag: string }
export type NextTagParameters = NextParameters<TagParameters>

export type PostPaginationParameters = { page: string }
export type NextPostPaginationParameters = NextParameters<PostPaginationParameters>

export type PostParameters = { year: string, month: string, day: string, slug: string };
export type NextPostParameters = NextParameters<PostParameters>

export type DataStructuresAndAlgorithmsParameters = { topic: string };
export type NextDataStructuresAndAlgorithmsParameters = NextParameters<DataStructuresAndAlgorithmsParameters>

export type VideogamesConsoleParameters = { console: string };
export type NextVideogamesConsoleParameters = NextParameters<VideogamesConsoleParameters>

export type VideogamesGameParameters = { console: string, game: string };
export type NextVideogamesGameParameters = NextParameters<VideogamesGameParameters>