import { ImageGlow } from "chicio-blog";
import artwork from "../../src/content/art/media/2023-04-01.jpg";
import authorPhoto from "../../public/media/authors/fabrizio-duroni.jpg";
import coAuthorPhoto from "../../public/media/authors/antonino-gitto-small.jpg";

export const Default = () => (
    <div className="flex">
        <ImageGlow
            className="h-[150px] w-[150px] rounded-full"
            src={authorPhoto}
            alt="Fabrizio Duroni"
            width={150}
            height={150}
        />
    </div>
);

export const NoGlow = () => (
    <div className="flex">
        <ImageGlow src={authorPhoto} alt="Fabrizio Duroni" width={150} height={150} />
    </div>
);

export const AuthorByline = () => (
    <div className="flex items-center gap-2">
        <ImageGlow
            className="rounded-full"
            src={coAuthorPhoto}
            alt="Antonino Gitto"
            width={30}
            height={30}
            noPlaceholder={true}
        />
        <p className="text-primary-text">Antonino Gitto</p>
    </div>
);

export const FillCover = () => (
    <div className="relative h-64 w-full overflow-hidden">
        <ImageGlow
            fill={true}
            className="relative! h-full! w-full! object-cover"
            src={artwork}
            alt="Digital painting from the art gallery"
        />
    </div>
);
