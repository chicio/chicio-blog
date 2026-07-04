export interface Author {
    id: string;
    name: string;
    linkedinUrl: string;
    siteUrl?: string;
    xUrl?: string;
    githubUrl?: string;
    image: string;
    imageLarge?: string;
    role?: string;
    bio?: string;
}

export type AuthorDefinition = Omit<Author, "id">;

export interface AuthorSummary {
    author: Author;
    postCount: number;
}

const authorImagesFolder = '/media/authors/'

export const authors: { [authorId: string]: AuthorDefinition } = {
    fabrizio_duroni: {
        name: "Fabrizio Duroni",
        linkedinUrl: "https://www.linkedin.com/in/fabrizio-duroni/",
        image: `${authorImagesFolder}fabrizio-duroni-small.jpg`,
    },
    francesco_bonfadelli: {
        name: "Francesco Bonfadelli",
        linkedinUrl: "https://www.linkedin.com/in/fbonfadelli/",
        image: `${authorImagesFolder}francesco-bonfadelli.jpg`,
    },
    alessandro_romano: {
        name: "Alessandro Romano",
        linkedinUrl: "https://www.linkedin.com/in/alessandroromano92/",
        image: `${authorImagesFolder}alessandro-romano.jpg`,
    },
    emanuele_ianni: {
        name: "Emanuele Ianni",
        linkedinUrl: "https://www.linkedin.com/in/emanueleianni/",
        image: `${authorImagesFolder}emanuele-ianni.jpg`,
    },
    tommaso_resti: {
        name: "Tommaso Resti",
        linkedinUrl: "https://www.linkedin.com/in/tommaso-resti-0ab5285a/",
        image: `${authorImagesFolder}tommaso-resti.jpg`,
    },
    mariano_patafio: {
        name: "Mariano Patafio",
        linkedinUrl: "https://www.linkedin.com/in/mariano-patafio-4a8b7426/",
        image: `${authorImagesFolder}mariano-patafio.jpg`,
    },
    angelo_sciarra: {
        name: "Angelo Sciarra",
        linkedinUrl: "https://www.linkedin.com/in/angelosciarra/",
        image: `${authorImagesFolder}angelo-sciarra.jpg`,
    },
    giordano_tamburrelli: {
        name: "Giordano Tamburrelli",
        linkedinUrl: "https://www.linkedin.com/in/giordano-tamburrelli-b532334/",
        image: `${authorImagesFolder}giordano-tamburrelli.jpg`,
    },
    felice_giovinazzo: {
        name: "Felice Giovinazzo",
        linkedinUrl: "https://www.linkedin.com/in/felice-giovinazzo-17277b55/",
        image: `${authorImagesFolder}felice-giovinazzo.jpg`,
    },
    marco_de_lucchi: {
        name: "Marco De Lucchi",
        linkedinUrl: "https://www.linkedin.com/in/marcodelucchi/",
        image: `${authorImagesFolder}marco-de-lucchi.jpg`,
    },
    stefano_varesi: {
        name: "Stefano Varesi",
        linkedinUrl: "https://www.linkedin.com/in/stefanovaresi/",
        image: `${authorImagesFolder}stefano-varesi.jpg`,
    },
    alex_stabile: {
        name: "Alex Stabile",
        linkedinUrl: "https://www.linkedin.com/in/alex-stabile-a9316b94/",
        image: `${authorImagesFolder}alex-stabile.jpg`,
    },
    sam_campisi: {
        name: "Sam Campisi",
        linkedinUrl: "https://www.linkedin.com/in/samantha-campisi-9a70b5a1/",
        image: `${authorImagesFolder}sam-campisi.jpg`,
    },
    antonino_gitto: {
        name: "Antonino Gitto",
        linkedinUrl: "https://www.linkedin.com/in/antonino-gitto/",
        image: `${authorImagesFolder}antonino-gitto.jpg`,
    }
};
