export interface Author {
    id: string;
    name: string;
    linkedinUrl: string;
    siteUrl?: string;
    xUrl?: string;
    githubUrl?: string;
    image: string;
    imageLarge: string;
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
        siteUrl: "https://www.fabrizioduroni.it",
        linkedinUrl: "https://www.linkedin.com/in/fabrizio-duroni/",
        image: `${authorImagesFolder}fabrizio-duroni-small.jpg`,
        imageLarge: `${authorImagesFolder}fabrizio-duroni.jpg`,
        role: "Principal Software Engineer",
    },
    francesco_bonfadelli: {
        name: "Francesco Bonfadelli",
        linkedinUrl: "https://www.linkedin.com/in/fbonfadelli/",
        githubUrl: "https://github.com/bonfa",
        xUrl: "https://x.com/FBonfadelli",
        image: `${authorImagesFolder}francesco-bonfadelli-small.jpeg`,
        imageLarge: `${authorImagesFolder}francesco-bonfadelli.jpeg`,
        role: "Principal Software Engineer",
    },
    alessandro_romano: {
        name: "Alessandro Romano",
        linkedinUrl: "https://www.linkedin.com/in/alessandroromano92/",
        githubUrl: "https://github.com/aleromano92",
        xUrl: "https://x.com/_aleromano",
        siteUrl: "https://aleromano.com",
        image: `${authorImagesFolder}alessandro-romano-small.jpeg`,
        imageLarge: `${authorImagesFolder}alessandro-romano.jpeg`,
        role: "Senior Engineering Manager",
        bio: "I love to help people collaborate better. I'm addicted to details and obsessed with how things work: from Cloud services to human relationships. Since my first Hello World in RPG Maker, I have come to believe that empathy and emotional intelligence are far more important in the IT field. I strongly believe people come before processes and tools and I think great Team Work wins over individual contribution.",
    },
    emanuele_ianni: {
        name: "Emanuele Ianni",
        linkedinUrl: "https://www.linkedin.com/in/emanueleianni/",
        image: `${authorImagesFolder}emanuele-ianni-small.jpeg`,
        imageLarge: `${authorImagesFolder}emanuele-ianni.jpeg`,
        role: "Engineer | Product Manager | Lecturer"
    },
    tommaso_resti: {
        name: "Tommaso Resti",
        linkedinUrl: "https://www.linkedin.com/in/tommaso-resti-0ab5285a/",
        image: `${authorImagesFolder}tommaso-resti-small.jpeg`,
        imageLarge: `${authorImagesFolder}tommaso-resti.jpeg`,
        role: "Senior Software Engineer",
    },
    mariano_patafio: {
        name: "Mariano Patafio",
        linkedinUrl: "https://www.linkedin.com/in/mariano-patafio-4a8b7426/",
        image: `${authorImagesFolder}mariano-patafio-small.jpeg`,
        imageLarge: `${authorImagesFolder}mariano-patafio.jpeg`,
        role: "Lead Mobile Architect",
    },
    angelo_sciarra: {
        name: "Angelo Sciarra",
        linkedinUrl: "https://www.linkedin.com/in/angelosciarra/",
        image: `${authorImagesFolder}angelo-sciarra.jpeg`,
        imageLarge: `${authorImagesFolder}angelo-sciarra.jpeg`,
        role: "Senior Software engineer",
    },
    giordano_tamburrelli: {
        name: "Giordano Tamburrelli",
        linkedinUrl: "https://www.linkedin.com/in/giordano-tamburrelli-b532334/",
        image: `${authorImagesFolder}giordano-tamburrelli-small.jpeg`,
        imageLarge: `${authorImagesFolder}giordano-tamburrelli.jpeg`,
        role: "Director of Engineering",
        bio: "Director of Engineering with a strong Product mindset. He is continuously optimizing the equation: Product = Customer x Business x Technology"
    },
    felice_giovinazzo: {
        name: "Felice Giovinazzo",
        linkedinUrl: "https://www.linkedin.com/in/felice-giovinazzo-17277b55/",
        image: `${authorImagesFolder}felice-giovinazzo-small.jpeg`,
        imageLarge: `${authorImagesFolder}felice-giovinazzo.jpeg`,
        role: "Senior Software engineer",
    },
    marco_de_lucchi: {
        name: "Marco De Lucchi",
        linkedinUrl: "https://www.linkedin.com/in/marcodelucchi/",
        image: `${authorImagesFolder}marco-de-lucchi-small.jpeg`,
        imageLarge: `${authorImagesFolder}marco-de-lucchi.jpeg`,
        role: "Mobile Software Engineer "
    },
    stefano_varesi: {
        name: "Stefano Varesi",
        linkedinUrl: "https://www.linkedin.com/in/stefanovaresi/",
        image: `${authorImagesFolder}stefano-varesi.jpg`,
        imageLarge: `${authorImagesFolder}stefano-varesi.jpg`,
        role: "Senior Software engineer",
    },
    alex_stabile: {
        name: "Alex Stabile",
        linkedinUrl: "https://www.linkedin.com/in/alex-stabile-a9316b94/",
        image: `${authorImagesFolder}alex-stabile-small.jpeg`,
        imageLarge: `${authorImagesFolder}alex-stabile.jpeg`,
        role: "Senior Software engineer",
    },
    sam_campisi: {
        name: "Sam Campisi",
        linkedinUrl: "https://www.linkedin.com/in/samantha-campisi-9a70b5a1/",
        image: `${authorImagesFolder}sam-campisi.jpg`,
        imageLarge: `${authorImagesFolder}sam-campisi.jpg`,
        role: "Senior Software engineer",
    },
    antonino_gitto: {
        name: "Antonino Gitto",
        linkedinUrl: "https://www.linkedin.com/in/antonino-gitto/",
        image: `${authorImagesFolder}antonino-gitto.jpg`,
        imageLarge: `${authorImagesFolder}antonino-gitto.jpg`,
        role: "Senior Mobile Software Engineer",
    }
};
