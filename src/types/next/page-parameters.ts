export type NextParameters<Params> = { params: Promise<Params> }

export type TagParameters = { tag: string }
export type NextTagParameters = NextParameters<TagParameters>

export type PostPaginationParameters = { page: string }
export type NextPostPaginationParameters = NextParameters<PostPaginationParameters>

export type PostParameters = { year: string, month: string, day: string, slug: string };
export type NextPostParameters = NextParameters<PostParameters>
