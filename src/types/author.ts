export interface Author {
    name: string;
    url: string;
    image: string;
}

const authorImagesFolder = '/images/authors/'

export const authors: { [authorName: string]: Author } = {
    fabrizio_duroni: {
        name: "Fabrizio Duroni",
        url: "https://www.linkedin.com/in/fabrizio-duroni/",
        image: `${authorImagesFolder}fabrizio-duroni-small.jpg`,
    },
    francesco_bonfadelli: {
        name: "Francesco Bonfadelli",
        url: "https://www.linkedin.com/in/fbonfadelli/",
        image: `${authorImagesFolder}francesco-bonfadelli.jpg`,
    },
    alessandro_romano: {
        name: "Alessandro Romano",
        url: "https://www.linkedin.com/in/alessandroromano92/",
        image: `${authorImagesFolder}alessandro-romano.jpg`,
    },
    emanuele_ianni: {
        name: "Emanuele Ianni",
        url: "https://www.linkedin.com/in/emanueleianni/",
        image: `${authorImagesFolder}emanuele-ianni.jpg`,
    },
    tommaso_resti: {
        name: "Tommaso Resti",
        url: "https://www.linkedin.com/in/tommaso-resti-0ab5285a/",
        image: `${authorImagesFolder}tommaso-resti.jpg`,
    },
    mariano_patafio: {
        name: "Mariano Patafio",
        url: "https://www.linkedin.com/in/mariano-patafio-4a8b7426/",
        image: `${authorImagesFolder}mariano-patafio.jpg`,
    },
    angelo_sciarra: {
        name: "Angelo Sciarra",
        url: "https://www.linkedin.com/in/angelosciarra/",
        image: `${authorImagesFolder}angelo-sciarra.jpg`,
    },
    giordano_tamburrelli: {
        name: "Giordano Tamburrelli",
        url: "https://www.linkedin.com/in/giordano-tamburrelli-b532334/",
        image: `${authorImagesFolder}giordano-tamburrelli.jpg`,
    },
    felice_giovinazzo: {
        name: "Felice Giovinazzo",
        url: "https://www.linkedin.com/in/felice-giovinazzo-17277b55/",
        image: `${authorImagesFolder}felice-giovinazzo.jpg`,
    },
    marco_de_lucchi: {
        name: "Marco De Lucchi",
        url: "https://www.linkedin.com/in/marcodelucchi/",
        image: `${authorImagesFolder}marco-de-lucchi.jpg`,
    },
    stefano_varesi: {
        name: "Stefano Varesi",
        url: "https://www.linkedin.com/in/stefanovaresi/",
        image: `${authorImagesFolder}stefano-varesi.jpg`,
    },
    alex_stabile: {
        name: "Alex Stabile",
        url: "https://www.linkedin.com/in/alex-stabile-a9316b94/",
        image: `${authorImagesFolder}alex-stabile.jpg`,
    },
    sam_campisi: {
        name: "Sam Campisi",
        url: "https://www.linkedin.com/in/samantha-campisi-9a70b5a1/",
        image: `${authorImagesFolder}sam-campisi.jpg`,
    },
    antonino_gitto: {
        name: "Antonino Gitto",
        url: "https://www.linkedin.com/in/antonino-gitto/",
        image: `${authorImagesFolder}antonino-gitto.jpg`,
    }
};
