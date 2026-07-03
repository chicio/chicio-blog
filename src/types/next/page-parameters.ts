type NextParameters<Params> = { params: Promise<Params> }

type TagParameters = { tag: string }
export type NextTagParameters = NextParameters<TagParameters>

type PostPaginationParameters = { page: string }
export type NextPostPaginationParameters = NextParameters<PostPaginationParameters>

type PostParameters = { year: string, month: string, day: string, slug: string };
export type NextPostParameters = NextParameters<PostParameters>

type DataStructuresAndAlgorithmsParameters = { topic: string };
export type NextDataStructuresAndAlgorithmsParameters = NextParameters<DataStructuresAndAlgorithmsParameters>

type DataStructuresAndAlgorithmsExerciseParameters = { topic: string; exercise: string };
export type NextDataStructuresAndAlgorithmsExerciseParameters = NextParameters<DataStructuresAndAlgorithmsExerciseParameters>

type VideogamesConsoleParameters = { console: string };
export type NextVideogamesConsoleParameters = NextParameters<VideogamesConsoleParameters>

type VideogamesGameParameters = { console: string, game: string };
export type NextVideogamesGameParameters = NextParameters<VideogamesGameParameters>

type AuthorParameters = { authorId: string };
export type NextAuthorParameters = NextParameters<AuthorParameters>