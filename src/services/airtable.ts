import Airtable from 'airtable';

// Initialize Airtable
const apiKey = import.meta.env.VITE_AIRTABLE_API_KEY;
const baseId = import.meta.env.VITE_AIRTABLE_BASE_ID;

if (!apiKey || !baseId) {
    console.warn("Airtable API Key or Base ID is missing. Please check your .env file.");
}

const base = new Airtable({ apiKey }).base(baseId || '');

// Table names
export const TABLES = {
    ETUDIANT: 'Etudiant',
    RDV: 'RDV',
};

// Interface for Appointment Data
export interface RdvData {
    date: Date;
    type: 'Présentiel' | 'Visio';
    status: 'Attente de Validation' | 'Réalisé';
    lieu: string;
    lienVisio: string; // "Lien Meet" or empty
    commentaires: string;
    studentEmail: string; // Used to find the student
    admin: string; // "Myriam"
}

export interface StudentData {
    prenom: string;
    nom: string;
    email: string;
    phone: string;
    university: string;
    fieldOfStudy: string;
    studyLevel: string;
    disabilityTypes: string[]; // Changed to array
    needsDescription: string;
    acceptTerms: boolean;
    password: string;
}


const STUDY_LEVEL_MAP: Record<string, string> = {
    'Licence 1': '1ère année',
    'Licence 2': '2ème année',
    'Licence 3': '3ème année',
    'Master 1': '4ème année',
    'Master 2': '5ème année',
    'Autre': 'Autre'
};

// No longer needed for mapping if we send the values directly, 
// but kept if we need to map specific UI labels to Airtable names.
// Since the UI options match the Airtable names (based on user request), we can use them directly.
const DISABILITY_TYPE_MAP: Record<string, string> = {
    'TDAH': 'TDAH',
    'Autisme': 'Autisme',
    'Dyslexie': 'Dyslexie',
    'Dyscaculie': 'Dyscaculie',
    'Dysgraphie': 'Dysgraphie',
    'Phobie social': 'Phobie social',
    'Autre': 'Autre'
};

export const createStudent = async (data: StudentData) => {
    if (!apiKey || !baseId) {
        throw new Error("Configuration Airtable manquante");
    }

    try {
        // Prepare values
        const studyLevel = STUDY_LEVEL_MAP[data.studyLevel] || data.studyLevel;

        // Map selected disabilities if needed, or use directly
        const disabilities = data.disabilityTypes.map(d => DISABILITY_TYPE_MAP[d] || d);

        // Mapping form data to Airtable columns
        const records = await base(TABLES.ETUDIANT).create([
            {
                fields: {
                    "Nom Complet": `${data.prenom} ${data.nom}`,
                    "Adresse mail": data.email,
                    "Telephone": data.phone,
                    "Statut": "Étudiant",
                    "Ecole": data.university,
                    "Domaine Etude": data.fieldOfStudy,

                    "Annee Etude": studyLevel,

                    "Mot de passe": data.password,

                    // Send array of strings. 
                    // CRITICAL: typecast: true allows Airtable to link to records by name
                    "Handicaps": disabilities,

                    "To Do List": [],
                    "RDV": []
                }
            }
        ], { typecast: true }); // Enable typecast for Linked Records

        return records;
    } catch (error: any) {
        // Improved error logging
        console.error("Erreur Airtable détaillée:", {
            message: error.message,
            error: error.error,
            statusCode: error.statusCode
        });
        throw error;
    }
};

export const verifyStudent = async (email: string, password: string) => {
    if (!apiKey || !baseId) {
        throw new Error("Configuration Airtable manquante");
    }

    try {
        // Search for user with matching email
        const records = await base(TABLES.ETUDIANT).select({
            filterByFormula: `{Adresse mail} = '${email}'`,
            maxRecords: 1
        }).firstPage();

        if (records.length === 0) {
            return { success: false, message: "Email non trouvé" };
        }

        const student = records[0];
        const storedPassword = student.get('Mot de passe');

        if (storedPassword === password) {
            return {
                success: true,
                student: {
                    id: student.id,
                    ...student.fields
                }
            };
        } else {
            return { success: false, message: "Mot de passe incorrect" };
        }

    } catch (error: any) {
        console.error("Erreur lors de la connexion:", error);
        throw new Error("Erreur de connexion au serveur");
    }
};

export const getStudentCount = async () => {
    if (!apiKey || !baseId) {
        throw new Error("Configuration Airtable manquante");
    }

    try {
        const records = await base(TABLES.ETUDIANT).select({
            filterByFormula: "{Statut} = 'Étudiant'",
        }).all();

        return records.length;
    } catch (error: any) {
        console.error("Erreur lors de la récupération du nombre d'étudiants:", error);
        return 0; // Return 0 on error to avoid breaking UI
    }
};

export const getAllStudents = async () => {
    if (!apiKey || !baseId) {
        throw new Error("Configuration Airtable manquante");
    }

    try {
        const records = await base(TABLES.ETUDIANT).select({
            filterByFormula: "{Statut} = 'Étudiant'",
            sort: [{ field: "Nom Complet", direction: "asc" }]
        }).all();

        // On résout TOUTES les Promises
        const students = await Promise.all(
            records.map(async record => {
                const handicapIds = (record.get('Handicaps') as string[]) || [];

                // Récupération des noms réels des handicaps
                const handicaps = await Promise.all(
                    handicapIds.map(async id => {
                        const r = await base('Handicaps').find(id);
                        return r.get('Nom du Handicap') as string;
                    })
                );

                return {
                    id: record.id,
                    nomComplet: record.get('Nom Complet') as string,
                    email: record.get('Adresse mail') as string,
                    phone: record.get('Telephone') as string,
                    handicaps,
                    inscription: "",
                    dernierRdv: ""
                };
            })
        );

        return students; // <-- ici c’est bien Student[]
    } catch (error) {
        console.error("Erreur lors de la récupération des étudiants:", error);
        return [];
    }
};

export const findStudentIdByEmail = async (email: string): Promise<string | null> => {
    if (!apiKey || !baseId) throw new Error("Airtable config missing");

    try {
        const records = await base(TABLES.ETUDIANT).select({
            filterByFormula: `{Adresse mail} = '${email}'`,
            maxRecords: 1
        }).firstPage();

        if (records.length > 0) {
            return records[0].id;
        }
        return null;
    } catch (error) {
        console.error("Error finding student by email:", error);
        return null;
    }
};


export const createProspectStudent = async (email: string) => {
    if (!apiKey || !baseId) throw new Error("Airtable config missing");

    try {
        const records = await base(TABLES.ETUDIANT).create([
            {
                fields: {
                    "Adresse mail": email,
                    "Statut": "En attente",
                    "Nom Complet": email.split('@')[0], // Fallback name
                    "Handicaps": [],
                    "RDV": [],
                    "To Do List": []
                }
            }
        ], { typecast: true });

        return records[0].id;
    } catch (error) {
        console.error("Error creating prospect student:", error);
        throw error;
    }
};

export const getNextRdvId = async (): Promise<number> => {
    if (!apiKey || !baseId) throw new Error("Airtable config missing");

    try {
        const records = await base(TABLES.RDV).select({
            sort: [{ field: "ID RDV", direction: "desc" }],
            maxRecords: 1,
            fields: ["ID RDV"]
        }).firstPage();

        if (records.length === 0) return 1;

        const lastId = records[0].get("ID RDV");
        // Handle cases where ID might be string or number
        return Number(lastId) + 1;
    } catch (error) {
        console.error("Error calculating next RDV ID:", error);
        return 1; // Fallback to 1 if error (though this might duplicate)
    }
};

export const createRdv = async (data: RdvData) => {
    if (!apiKey || !baseId) throw new Error("Airtable config missing");

    try {
        // 1. Find Student ID
        let studentId = await findStudentIdByEmail(data.studentEmail);

        // 2. If not found, create new "En attente" student
        if (!studentId) {
            console.log(`Student not found for ${data.studentEmail}, creating new prospect...`);
            studentId = await createProspectStudent(data.studentEmail);
        }

        // 3. Format Date (Compensation GMT+1)
        // On décale l'heure pour compenser la conversion UTC faite par toISOString()
        // Si l'utilisateur choisit 16h (GMT+1), toISOString envoie 15h (UTC).
        // On ajoute donc le décalage horaire pour que toISOString envoie 16h.
        const offset = data.date.getTimezoneOffset() * 60000; // en ms
        const localDate = new Date(data.date.getTime() - offset);
        const dateString = localDate.toISOString().replace('Z', ''); // On retire le Z pour dire "c'est l'heure locale"

        // 4. Get Next ID
        const nextId = await getNextRdvId();

        // 5. Create RDV Record
        console.log("Creating RDV with payload:", {
            "ID RDV": nextId,
            "Date": dateString,
            "Type d'entretien": data.type,
            "Statut du RDV": data.status,
            "Lieu": data.lieu,
            "Lien visio": data.lienVisio,
            "Commentaires": data.commentaires,
            "Etudiant": [studentId],
            "Administrateur": data.admin
        });

        const records = await base(TABLES.RDV).create([
            {
                fields: {
                    "ID RDV": nextId,
                    "Date": dateString,
                    "Type d'entretien": data.type,
                    "Statut du RDV": data.status,
                    "Lieu": data.lieu,
                    "Lien visio": data.lienVisio,
                    "Commentaires": data.commentaires,
                    "Etudiant": [studentId],
                    "Administrateur": data.admin
                }
            }
        ], { typecast: true });

        return records[0];

    } catch (error: any) {
        console.error("Error creating RDV detailed:", {
            message: error.message,
            error: error.error,
            statusCode: error.statusCode,
            body: error.body
        });
        throw error;
    }
};
