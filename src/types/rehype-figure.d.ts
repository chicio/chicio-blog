// rehype-figure.d.ts

declare module '@microflash/rehype-figure' {
    import { Plugin } from 'unified';

    interface RehypeFigureOptions {
        className?: string;
    }

    const rehypeFigure: Plugin<[RehypeFigureOptions?]>;
    export = rehypeFigure;
}
