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
};

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
