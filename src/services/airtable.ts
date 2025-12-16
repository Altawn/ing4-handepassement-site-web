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
    TODO_LIST: 'To Do List',
    ADMINISTRATEUR: 'Administrateur',
    DOCUMENTATION: 'documentation',
    DISPONIBILITES: 'Disponibilites',
};

// Interface for Appointment Data
export interface RdvData {
    date: Date;
    dateFin?: Date; // Optional in interface, calculated automatically
    type: 'Présentiel' | 'Visio';
    status: 'Attente de Validation' | 'Réalisé' | 'Annulé' | 'Reporté';
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
    disabilityTypes: string[];
    needsDescription: string;
    aidantFamilial?: boolean;
    aidantDescription?: string;
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

const DISABILITY_TYPE_MAP: Record<string, string> = {
    'TDAH': 'TDAH',
    'Autisme': 'Autisme',
    'Dyslexie': 'Dyslexie',
    'Dyscaculie': 'Dyscaculie',
    'Dysgraphie': 'Dysgraphie',
    'Phobie social': 'Phobie social',
    'Autre': 'Autre'
};

export const updateStudentStatus = async (studentId: string, status: string) => {
    if (!apiKey || !baseId) throw new Error("Airtable config missing");
    try {
        await base(TABLES.ETUDIANT).update(studentId, {
            "Statut": status
        }, { typecast: true });
    } catch (error) {
        console.error("Error updating student status:", error);
        throw error;
    }
};

export const createStudent = async (data: StudentData) => {
    if (!apiKey || !baseId) {
        throw new Error("Configuration Airtable manquante");
    }

    try {
        // Check availability strictly for registration
        // const eligibility = await checkBookingEligibility(data.email);
        // We bypass this check to allow Account Claiming (updating existing records)
        // irrespective of their current status (Etudiant, En Attente) or RDVs.

        // Actually, let's just comment out the block that prevents registration if account exists
        // as we want to support account claiming.
        // If RDV_EXISTS (meaning En attente + rdv), we probably shouldn't block registration? 
        // Actually Inscription is usually creating the account password. 
        // If "En attente", they have no password yet (created via RDV flow).
        // So we should Update the existing "En attente" record instead of creating new!

        let existingId = null;
        const existingRecords = await base(TABLES.ETUDIANT).select({
            filterByFormula: `{Adresse mail} = '${data.email}'`,
            maxRecords: 1
        }).firstPage();

        if (existingRecords.length === 0) {
            throw new Error("EMAIL_NOT_FOUND");
        }

        const rec = existingRecords[0];
        const currentStatus = rec.get('Statut') as string;

        // Strict Check: Only 'validation' status allowed for registration
        if (currentStatus !== 'validation') {
            if (currentStatus === 'Étudiant') {
                throw new Error("ACCOUNT_EXISTS");
            }
            throw new Error("STATUS_NOT_VALIDATION");
        }

        existingId = rec.id;

        // Prepare values
        const studyLevel = STUDY_LEVEL_MAP[data.studyLevel] || data.studyLevel;
        const disabilities = data.disabilityTypes.map(d => DISABILITY_TYPE_MAP[d] || d);

        const hashedPassword = await hashPassword(data.password);

        const fields = {
            "Nom Complet": `${data.prenom} ${data.nom}`,
            "Adresse mail": data.email,
            "Telephone": data.phone,
            "Statut": "Étudiant", // We promote them to Etudiant now
            "Ecole": data.university,
            "Domaine Etude": data.fieldOfStudy,
            "Annee Etude": studyLevel,
            "Mot de passe": hashedPassword,
            "Handicaps": disabilities,
            "aidant ?": data.aidantFamilial ? "oui" : "non", // Updated column name based on screenshot
            "Aidant familial": data.aidantDescription || "", // Updated column mapping
            // Preserve existing links if updating
        };

        if (existingId) {
            const records = await base(TABLES.ETUDIANT).update([{
                id: existingId,
                fields: fields
            }], { typecast: true });
            return records;
        } else {
            const records = await base(TABLES.ETUDIANT).create([{
                fields: {
                    ...fields,
                    "To Do List": [],
                    "RDV": []
                }
            }], { typecast: true });
            return records;
        }

    } catch (error: any) {
        console.error("Erreur Airtable détaillée:", error);
        throw error;
    }
};

// Helper for hashing
const hashPassword = async (password: string): Promise<string> => {
    const msgBuffer = new TextEncoder().encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
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

        const hashedPassword = await hashPassword(password);

        if (records.length > 0) {
            const student = records[0];
            const storedPassword = student.get('Mot de passe');

            // Support both Hashed (new) and Plain (old) passwords for migration
            if (storedPassword === hashedPassword || storedPassword === password) {
                return {
                    success: true,
                    student: {
                        id: student.id,
                        ...student.fields
                    }
                };
            }
        }

        const adminRecords = await base(TABLES.ADMINISTRATEUR).select({
            filterByFormula: `{Adresse mail} = '${email}'`,
            maxRecords: 1
        }).firstPage();

        if (adminRecords.length > 0) {
            const admin = adminRecords[0];
            const storedAdminPass = admin.get('Mot de passe');
            // Admin passwords might be plain text initially or hashed. Supporting both.
            if (storedAdminPass === hashedPassword || storedAdminPass === password) {
                return {
                    success: true,
                    student: {
                        id: admin.id,
                        ...admin.fields,
                        'Statut': 'Admin', // Force Status for frontend redirection
                        'Nom Complet': admin.get('Nom complet'), // Normalize field name
                    }
                };
            } else {
                return { success: false, message: "Mot de passe incorrect" };
            }
        }

        if (records.length === 0 && adminRecords.length === 0) {
            return { success: false, message: "Email non trouvé" };
        }

        // If we found student records but password didn't match
        if (records.length > 0) {
            return { success: false, message: "Mot de passe incorrect" };
        }

        return { success: false, message: "Erreur inconnue" };

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
            // Removed filter to get all statuses (Etudiant, En attente, etc.)
            sort: [{ field: "Nom Complet", direction: "asc" }]
        }).all();

        // On résout TOUTES les Promises
        const students = await Promise.all(
            records.map(async record => {
                const handicapIds = (record.get('Handicaps') as string[]) || [];

                // Récupération des noms réels des handicaps
                const handicaps = await Promise.all(
                    handicapIds.map(async id => {
                        try {
                            const r = await base('Handicaps').find(id);
                            return r.get('Nom du Handicap') as string;
                        } catch { return ''; }
                    })
                );

                return {
                    id: record.id,
                    nomComplet: record.get('Nom Complet') as string,
                    email: record.get('Adresse mail') as string,
                    phone: record.get('Telephone') as string,
                    handicaps,
                    statut: record.get('Statut') as string || 'Inconnu', // Add status
                    inscription: "",
                    dernierRdv: ""
                };
            })
        );

        return students;
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

        // 3. Format Date
        // Helper to format date for Airtable (Local Mean Time string)
        const formatAirtableDate = (date: Date) => {
            const pad = (n: number) => n.toString().padStart(2, '0');
            return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:00.000`;
        };

        const d = data.date;
        const dateString = formatAirtableDate(d);

        // Calculate End Date (+1 hour)
        // Using timestamp addition to be purely based on time elapsed (3600s)
        const dFin = new Date(d.getTime() + 60 * 60 * 1000);
        const dateFinString = formatAirtableDate(dFin);

        // 4. Get Next ID
        const nextId = await getNextRdvId();

        // 5. Create RDV Record
        const lienVisioVal = data.type === 'Visio' ? (data.lienVisio || "https://meet.google.com/uva-tphn-spf") : ""; // Lien permanent

        console.log("Creating RDV with payload:", {
            "ID RDV": nextId,
            "Date-debut": dateString,
            "Date-fin": dateFinString,
            "Type d'entretien": data.type,
            "Statut du RDV": data.status,
            "Lieu": data.lieu,
            "Lien visio": lienVisioVal,
            "Commentaires": data.commentaires,
            "Etudiant": [studentId],
            "Administrateur": data.admin
        });

        const records = await base(TABLES.RDV).create([
            {
                fields: {
                    "ID RDV": nextId,
                    "Date-debut": dateString,
                    "Date-fin": dateFinString,
                    "Type d'entretien": data.type,
                    "Statut du RDV": data.status,
                    "Lieu": data.lieu,
                    "Lien visio": lienVisioVal,
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
            statusCode: error.statusCode
        });
        throw error;
    }
};

export const updateRdv = async (rdvId: string, data: Partial<RdvData>) => {
    if (!apiKey || !baseId) throw new Error("Airtable config missing");

    try {
        const fields: any = {};
        if (data.date) {
            // Helper to format date for Airtable (Local Mean Time string)
            const formatAirtableDate = (date: Date) => {
                const pad = (n: number) => n.toString().padStart(2, '0');
                return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:00.000`;
            };

            const d = data.date;
            fields["Date-debut"] = formatAirtableDate(d);

            // Calculate End Date (+1 hour)
            const dFin = new Date(d.getTime() + 60 * 60 * 1000);
            fields["Date-fin"] = formatAirtableDate(dFin);
        }
        if (data.type) fields["Type d'entretien"] = data.type;
        if (data.status) fields["Statut du RDV"] = data.status;
        if (data.lieu !== undefined) fields["Lieu"] = data.lieu;

        // Handle Visio Link logic
        if (data.type === 'Visio') {
            fields["Lien visio"] = data.lienVisio || "https://meet.google.com/uva-tphn-spf"; // Lien permanent
        } else if (data.type === 'Présentiel') {
            fields["Lien visio"] = "";
        } else if (data.lienVisio !== undefined) {
            fields["Lien visio"] = data.lienVisio;
        }

        if (data.commentaires !== undefined) fields["Commentaires"] = data.commentaires;
        if (data.admin) fields["Administrateur"] = data.admin;

        await base(TABLES.RDV).update(rdvId, fields, { typecast: true });

        // Fetch updated record and student info for email notification
        const record = await base(TABLES.RDV).find(rdvId);
        const studentIds = (record.get('Etudiant') as string[]) || [];
        let studentEmail = "";
        let studentName = "";

        if (studentIds.length > 0) {
            const student = await base(TABLES.ETUDIANT).find(studentIds[0]);
            studentEmail = student.get('Adresse mail') as string;
            studentName = student.get('Nom Complet') as string;
        }

        return {
            id: record.id,
            fields: record.fields,
            studentEmail,
            studentName
        };

    } catch (error: any) {
        console.error("Error updating RDV:", error);
        throw error;
    }
};

export const cancelRdv = async (rdvId: string) => {
    return updateRdv(rdvId, { status: 'Annulé' });
};

export const getDashboardStats = async () => {
    if (!apiKey || !baseId) throw new Error("Airtable config missing");

    try {
        // 1. Count RDVs this month
        // Formula: AND(MONTH({Date}) = MONTH(TODAY()), YEAR({Date}) = YEAR(TODAY()))
        const monthRecords = await base(TABLES.RDV).select({
            filterByFormula: "AND(MONTH({Date-debut}) = MONTH(TODAY()), YEAR({Date-debut}) = YEAR(TODAY()))",
            fields: ["ID RDV"] // Minimal fields
        }).all();

        // 2. Count Pending Validations
        const pendingRecords = await base(TABLES.RDV).select({
            filterByFormula: "{Statut du RDV} = 'Attente de Validation'",
            fields: ["ID RDV"]
        }).all();

        return {
            appointmentsThisMonth: monthRecords.length,
            pendingValidations: pendingRecords.length
        };
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        return { appointmentsThisMonth: 0, pendingValidations: 0 };
    }
};

export interface IncomingRdv {
    id: string;
    studentName: string;
    type: string;
    date: string;
    status: string;
    admin?: string;
}

export const getUpcomingAppointments = async (limit: number = 3): Promise<IncomingRdv[]> => {
    if (!apiKey || !baseId) throw new Error("Airtable config missing");

    try {
        // Filter: Date >= TODAY
        // Sort: Date ASC
        const records = await base(TABLES.RDV).select({
            filterByFormula: "IS_AFTER({Date-debut}, NOW())",
            sort: [{ field: "Date-debut", direction: "asc" }],
            maxRecords: limit
        }).firstPage();

        const upcomingRdvs = await Promise.all(records.map(async (record) => {
            const studentIds = (record.get('Etudiant') as string[]) || [];
            let studentName = "Inconnu";

            if (studentIds.length > 0) {
                try {
                    const studentRecord = await base(TABLES.ETUDIANT).find(studentIds[0]);
                    studentName = studentRecord.get('Nom Complet') as string || "Sans Nom";
                } catch (err) {
                    console.error("Could not fetch student name for RDV", record.id);
                }
            }

            return {
                id: record.id,
                studentName: studentName,
                type: record.get("Type d'entretien") as string,
                date: record.get("Date-debut") as string,
                status: record.get("Statut du RDV") as string
            };
        }));

        return upcomingRdvs;
    } catch (error) {
        console.error("Error fetching upcoming appointments:", error);
        return [];
    }
};


export const getAppointmentsForStudent = async (studentId: string): Promise<IncomingRdv[]> => {
    if (!apiKey || !baseId) throw new Error("Airtable config missing");

    try {
        // 1. Fetch Student to get linked RDV IDs
        const studentRecord = await base(TABLES.ETUDIANT).find(studentId);
        const rdvIds = (studentRecord.get('RDV') as string[]) || [];

        if (rdvIds.length === 0) return [];

        // 2. Fetch all generic RDVs in parallel (optimization: could confirm if this scales, but for < 50 apps it's fine)
        // Alternatively, use filterByFormula with RECORD_ID() but that can get long.
        // Given typically low N of appointments, Promise.all is acceptable.

        const rdvPromises = rdvIds.map(id => base(TABLES.RDV).find(id));
        const rdvRecords = await Promise.all(rdvPromises);

        // 3. Map to IncomingRdv
        const appointments = rdvRecords.map(record => ({
            id: record.id,
            studentName: "Vous",
            type: record.get("Type d'entretien") as string,
            date: record.get("Date-debut") as string,
            status: record.get("Statut du RDV") as string,
            admin: record.get("Administrateur") as string
        }));

        // Sort by date (descending or ascending? User usually wants upcoming first. Let's sort client side or here)
        // Sorting here by date ascending (closest first)
        return appointments.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    } catch (error) {
        console.error("Error fetching student appointments:", error);
        return [];
    }
};

export const getAllAppointments = async (): Promise<IncomingRdv[]> => {
    if (!apiKey || !baseId) throw new Error("Airtable config missing");

    try {
        const records = await base(TABLES.RDV).select({
            sort: [{ field: "Date-debut", direction: "desc" }]
        }).all();

        const appointments = await Promise.all(records.map(async (record) => {
            const studentIds = (record.get('Etudiant') as string[]) || [];
            let studentName = "Inconnu";

            if (studentIds.length > 0) {
                try {
                    const studentRecord = await base(TABLES.ETUDIANT).find(studentIds[0]);
                    studentName = studentRecord.get('Nom Complet') as string || "Sans Nom";
                } catch (err) {
                    console.error("Could not fetch student name for RDV", record.id);
                }
            }

            return {
                id: record.id,
                studentName: studentName,
                type: record.get("Type d'entretien") as string,
                date: record.get("Date-debut") as string,
                status: record.get("Statut du RDV") as string,
                // Add extended fields if needed but IncomingRdv is enough for list
            };
        }));

        return appointments;
    } catch (error) {
        console.error("Error fetching all appointments:", error);
        return [];
    }
};


export const checkBookingEligibility = async (email: string): Promise<{ allowed: boolean; reason?: 'ACCOUNT_EXISTS' | 'RDV_EXISTS' }> => {
    if (!apiKey || !baseId) throw new Error("Airtable config missing");

    try {
        // 1. Find Student by Email
        const records = await base(TABLES.ETUDIANT).select({
            filterByFormula: `{Adresse mail} = '${email}'`,
            maxRecords: 1
        }).firstPage();

        if (records.length === 0) return { allowed: true };

        const student = records[0];
        const status = student.get('Statut') as string;

        // 2. Check Account Status
        if (status === 'Étudiant') {
            return { allowed: false, reason: 'ACCOUNT_EXISTS' };
        }

        // 3. Check RDV table for this student
        const rdvIds = (student.get('RDV') as string[]) || [];

        if (rdvIds.length === 0) return { allowed: true };

        // 4. Check status of all RDVs
        const rdvPromises = rdvIds.map(id => base(TABLES.RDV).find(id));
        const rdvs = await Promise.all(rdvPromises);

        const hasActive = rdvs.some(rdv => {
            const rdvStatus = rdv.get('Statut du RDV') as string;
            return rdvStatus !== 'Annulé' && rdvStatus !== 'Reporté';
        });

        if (hasActive) {
            return { allowed: false, reason: 'RDV_EXISTS' };
        }

        return { allowed: true };
    } catch (error) {
        console.error("Error checking checkBookingEligibility:", error);
        throw error;
    }
};

export interface Task {
    id: string; // Airtable Record ID
    title: string;
    date: string;
    completed: boolean;
}

export const getTasksForStudent = async (studentId: string): Promise<Task[]> => {
    if (!apiKey || !baseId) throw new Error("Airtable config missing");

    try {
        const records = await base(TABLES.TODO_LIST).select({
            // filterByFormula: `SEARCH('${studentId}', {Etudiant})`, 
            // Filtering by formula with Record ID on Linked Field is unreliable if it resolves to Name.
            // We rely on the JS filter below which checks the IDs returned by the API.
            sort: [{ field: "Échéance", direction: "asc" }]
        }).all();

        // Warning: filtering by Linked Record ID in formula can be tricky. 
        // Often `{Field} = 'RecordID'` doesn't work.
        // `RECORD_ID() = ...` is for the record itself.
        // For linked record, usually we can pass the name if unique, or use `SEARCH`.
        // Let's rely on client side filtering if unsure, but it's inefficient.
        // Actually, if we use `filterByFormula` it expects text.
        // Let's try `studentId` directly if we can't be sure.

        // Wait, line 326 `createRDV` creates a link using `[studentId]`.
        // So in Airtable it stores the Record ID.
        // So we can use `SEARCH` or just fetch records that link to this ID.
        // Let's allow fetching slightly more and filtering in JS to be safe against formula nuances, 
        // OR use `filterByFormula` with the student's name if we had it.

        // Re-reading `createRDV`: ` "Etudiant": [studentId]`.

        // Let's try a robust filter:
        // Or simply `filterByFormula: "FIND('" + studentId + "', {Étudiant}) > 0"`

        return records.filter(record => {
            const students = record.get('Étudiant') as string[] | null;
            return students && students.includes(studentId);
        }).map(record => ({
            id: record.id,
            title: record.get('Description') as string,
            date: record.get('Échéance') as string,
            completed: record.get('Fait') === "Oui" // Check text value "Oui"
        }));
    } catch (error) {
        console.error("Error fetching tasks:", error);
        return [];
    }
};

export const updateTaskStatus = async (taskId: string, completed: boolean) => {
    if (!apiKey || !baseId) throw new Error("Airtable config missing");
    try {
        await base(TABLES.TODO_LIST).update(taskId, {
            "Fait": completed ? "Oui" : "Non"
        });
    } catch (error) {
        console.error("Error updating task:", error);
        throw error;
    }
};

export const createTask = async (title: string, date: string, studentId: string) => {
    if (!apiKey || !baseId) throw new Error("Airtable config missing");
    try {
        // Need to handle Date likely. Assuming DD/MM/YYYY or YYYY-MM-DD input? 
        // Airtable expects YYYY-MM-DD usually.
        // The input form in DetailEtudiant uses text placeholder "JJ/MM/AAAA".
        // We might need to convert it.
        // Let's assume the frontend passes a valid string or we pass it as string if Airtable field is text? 
        // The screenshot shows "12/11/2025", which looks like a Date field formatted.
        // `createRDV` does complex date conversion.

        // Let's try to parse the date if it's DD/MM/YYYY
        let formattedDate = date;
        if (date.includes('/')) {
            const parts = date.split('/');
            if (parts.length === 3) {
                // DD/MM/YYYY -> YYYY-MM-DD
                formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
            }
        }
        // If it comes from input type='date', it's already YYYY-MM-DD, so we leave it as is.


        // Get next ID
        const records = await base(TABLES.TODO_LIST).select({
            sort: [{ field: "ID TODO LIST", direction: "desc" }],
            maxRecords: 1,
            fields: ["ID TODO LIST"]
        }).firstPage();

        let nextId = 1;
        if (records.length > 0) {
            const lastId = records[0].get("ID TODO LIST");
            nextId = Number(lastId) + 1;
        }

        await base(TABLES.TODO_LIST).create([
            {
                fields: {
                    "ID TODO LIST": nextId,
                    "Description": title,
                    "Échéance": formattedDate,
                    "Fait": "Non",
                    "Étudiant": [studentId]
                    // Removed "Fait": false, as default is unchecked and explicit false can cause 422
                }
            }
        ]);
    } catch (error) {
        console.error("Error creating task:", error);
        throw error;
    }
};

export const getStudent = async (id: string): Promise<StudentData & { id: string; statut: string } | null> => {
    if (!apiKey || !baseId) throw new Error("Airtable config missing");
    try {
        const record = await base(TABLES.ETUDIANT).find(id);

        const handicapIds = (record.get('Handicaps') as string[]) || [];
        const handicaps = await Promise.all(
            handicapIds.map(async hId => {
                try {
                    const r = await base('Handicaps').find(hId);
                    return r.get('Nom du Handicap') as string;
                } catch { return ''; }
            })
        );

        return {
            id: record.id,
            prenom: (record.get('Nom Complet') as string).split(' ')[0], // Rough approximation
            nom: (record.get('Nom Complet') as string).split(' ').slice(1).join(' '),
            email: record.get('Adresse mail') as string,
            phone: record.get('Telephone') as string,
            university: record.get('Ecole') as string,
            fieldOfStudy: record.get('Domaine Etude') as string,
            studyLevel: record.get('Annee Etude') as string,
            disabilityTypes: handicaps.filter(h => h),
            needsDescription: "", // Not in verify table
            acceptTerms: true,
            password: "",
            statut: record.get('Statut') as string || 'En attente'
        };
    } catch (error) {
        console.error("Error fetching student:", error);
        return null;
    }
};


export interface StudentRdv {
    id: string;
    date: string; // Formatted date
    rawDate: string; // ISO string for sorting
    type: string;
    status: string;
    lieu: string;
    notes: string;
    isPast: boolean;
}

export const getStudentRdvs = async (studentId: string): Promise<StudentRdv[]> => {
    if (!apiKey || !baseId) throw new Error("Airtable config missing");

    try {
        // Fetch all RDVs linked to this student
        const records = await base(TABLES.RDV).select({
            // filterByFormula: `SEARCH('${studentId}', {Etudiant})`,
            sort: [{ field: "Date-debut", direction: "desc" }]
        }).all();

        // Check against Linked Record manually to be safe
        // Check against Linked Record manually to be safe
        const studentRecords = records.filter(record => {
            const students = record.get('Etudiant') as string[] | null;
            return students && students.includes(studentId);
        });

        const now = new Date();

        return studentRecords.map(record => {
            const dateStr = record.get('Date-debut') as string;
            const rdvDate = new Date(dateStr);
            const isPast = rdvDate < now;

            const options: Intl.DateTimeFormatOptions = {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                timeZone: 'UTC'
            };
            const formattedDate = rdvDate.toLocaleDateString('fr-FR', options);

            return {
                id: record.id,
                date: formattedDate,
                rawDate: dateStr,
                type: record.get("Type d'entretien") as string || "Rendez-vous",
                status: record.get("Statut du RDV") as string,
                lieu: record.get("Lieu") as string || record.get("Lien visio") as string || "À définir",
                notes: record.get("Résumé de l'entretien") as string || "Aucun compte-rendu disponible.",
                isPast
            };
        });

    } catch (error) {
        console.error("Error fetching student RDVs:", error);
        return [];
    }
};

export const updateRdvSummary = async (rdvId: string, summary: string) => {
    if (!apiKey || !baseId) throw new Error("Airtable config missing");
    try {
        await base(TABLES.RDV).update(rdvId, {
            "Résumé de l'entretien": summary
        });
    } catch (error) {
        console.error("Error updating RDV summary:", error);
        throw error;
    }
};

export interface DocumentationData {
    id: string;
    titre: string;
    description: string;
    contenu: string;
    lien: string;
    sharedWithIds: string[];
    adminName: string;
}

export const getDocumentation = async (studentId?: string): Promise<DocumentationData[]> => {
    if (!apiKey || !baseId) throw new Error("Airtable config missing");

    try {
        const records = await base(TABLES.DOCUMENTATION).select({
            sort: [{ field: "Titre", direction: "asc" }]
        }).all();

        if (records.length > 0) {
            console.log("--------------- DEBUG AIRTABLE FIELDS ---------------");
            console.log("Available Fields from first record:", Object.keys(records[0].fields));
            console.log("-----------------------------------------------------");
        }

        const docs = records.map(record => {
            const studentIds = (record.get('Etudiant') as string[]) || [];
            const adminRaw = record.get('Administrateur');
            let adminName = "Admin";
            if (typeof adminRaw === 'string') {
                adminName = adminRaw;
            } else if (Array.isArray(adminRaw) && adminRaw.length > 0) {
                // Linked record case, simplistic handling
                adminName = "Admin";
            }

            return {
                id: record.id,
                titre: record.get('Titre') as string,
                description: record.get('description') as string,
                contenu: record.get('Contenue') as string,
                lien: record.get('lien') as string,
                sharedWithIds: studentIds,
                adminName: adminName // We might want to resolve this if it's an ID
            };
        });

        if (studentId) {
            // Filter for student: Public (no students linked) OR Explicitly shared
            return docs.filter(doc =>
                doc.sharedWithIds.length === 0 || doc.sharedWithIds.includes(studentId)
            );
        }

        return docs; // Admin sees all
    } catch (error) {
        console.error("Error fetching documentation:", error);
        return [];
    }
};

export const createDocumentation = async (data: Omit<DocumentationData, 'id' | 'adminName'> & { adminName: string }) => {
    if (!apiKey || !baseId) throw new Error("Airtable config missing");

    try {
        const fields: any = {
            "Titre": data.titre,
            "description": data.description || "",
            "Contenue": data.contenu || "",
        };

        // Only add link if it's not empty, otherwise it might fail validation if it's a URL field
        if (data.lien && data.lien.trim() !== "") {
            fields["lien"] = data.lien;
        }

        // Only add Etudiant if we have IDs, otherwise leave empty
        if (data.sharedWithIds && data.sharedWithIds.length > 0) {
            fields["Etudiant"] = data.sharedWithIds;
        }

        // fields["Administrateur"] = ... // Still skipping admin to be safe

        console.log("Creating documentation with fields:", fields);

        await base(TABLES.DOCUMENTATION).create([{
            fields: fields
        }], { typecast: true });

    } catch (error: any) {
        console.error("Error creating documentation:", JSON.stringify(error, null, 2));
        throw error;
    }
};

export const deleteDocumentation = async (id: string) => {
    if (!apiKey || !baseId) throw new Error("Airtable config missing");
    try {
        await base(TABLES.DOCUMENTATION).destroy(id);
    } catch (error) {
        console.error("Error deleting documentation:", error);
        throw error;
    }
};

export const checkStudentStatus = async (email: string) => {
    if (!apiKey || !baseId) throw new Error("Airtable config missing");

    const records = await base(TABLES.ETUDIANT).select({
        filterByFormula: `{Adresse mail} = '${email}'`,
        maxRecords: 1
    }).firstPage();

    if (records.length === 0) {
        throw new Error("EMAIL_NOT_FOUND");
    }

    const rec = records[0];
    const currentStatus = rec.get('Statut') as string;

    // Strict Check: Only 'validation' status allowed for registration
    if (currentStatus !== 'validation') {
        if (currentStatus === 'Étudiant') {
            throw new Error("ACCOUNT_EXISTS");
        }
        throw new Error("STATUS_NOT_VALIDATION");
    }

    return true;
};


// ---------------------------------------------------------
// AVAILABILITY & SLOTS MANAGEMENT
// ---------------------------------------------------------

export interface AvailabilityData {
    id?: string;
    date: string; // YYYY-MM-DD
    startTime: string; // HH:MM
    endTime: string; // HH:MM
    adminId?: string;
}

export const createAvailability = async (data: AvailabilityData) => {
    if (!apiKey || !baseId) throw new Error("Airtable config missing");

    try {
        await base(TABLES.DISPONIBILITES).create([{
            fields: {
                "Date": data.date,
                "Heure Debut": data.startTime,
                "Heure Fin": data.endTime,
                // "Administrateur": [data.adminId] // Uncomment when Admin ID is available/managed
            }
        }], { typecast: true });
    } catch (error) {
        console.error("Error creating availability:", error);
        throw error;
    }
};

export const getAvailabilities = async (date: Date): Promise<AvailabilityData[]> => {
    if (!apiKey || !baseId) throw new Error("Airtable config missing");

    try {
        // Format date to string YYYY-MM-DD to match Airtable Date field
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;

        const records = await base(TABLES.DISPONIBILITES).select({
            filterByFormula: `IS_SAME({Date}, '${dateStr}', 'day')`
        }).all();

        return records.map(record => ({
            id: record.id,
            date: record.get('Date') as string,
            startTime: record.get('Heure Debut') as string,
            endTime: record.get('Heure Fin') as string
        }));
    } catch (error) {
        console.error("Error fetching availabilities:", error);
        return [];
    }
};

/**
 * GENERATE AVAILABLE SLOTS
 * Core logic: 
 * 1. Get Admin Windows for Date
 * 2. Get Existing Confirmed RDVs for Date
 * 3. Generate 30min slots inside Windows
 * 4. Remove slots that overlap with Existing RDVs
 */
export const generateAvailableSlots = async (date: Date): Promise<string[]> => {
    try {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;

        // 1. Fetch Availabilities
        const availabilities = await getAvailabilities(date);

        // 2. Fetch Existing RDVs for that day (Active only)
        // Use Date-debut and ensuring we look at the 'day'
        const rdvRecords = await base(TABLES.RDV).select({
            filterByFormula: `AND(
                IS_SAME({Date-debut}, '${dateStr}', 'day'),
                {Statut du RDV} != 'Annulé',
                {Statut du RDV} != 'Reporté'
            )`
        }).all();

        const bookedTimes = new Set<string>();
        rdvRecords.forEach(record => {
            const rdvDateStr = record.get('Date-debut') as string;
            // rdvDateStr is likely "YYYY-MM-DDTHH:mm:00.000" (from our manual save)
            // We want to extract HH:mm exactly as saved, ignoring timezone
            if (rdvDateStr && rdvDateStr.includes('T')) {
                const timePart = rdvDateStr.split('T')[1]; // HH:mm:00.000
                const [h, m] = timePart.split(':');
                bookedTimes.add(`${h}:${m}`);
            }
        });

        // 3. Generate Slots
        const possibleSlots = new Set<string>();

        availabilities.forEach(window => {
            const [startH, startM] = window.startTime.split(':').map(Number);
            const [endH, endM] = window.endTime.split(':').map(Number);

            // Minutes from midnight
            let current = startH * 60 + startM;
            const end = endH * 60 + endM;

            while (current < end) {
                // Convert back to HH:MM
                const h = Math.floor(current / 60);
                const m = current % 60;
                const timeStr = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;

                possibleSlots.add(timeStr);

                current += 30; // 30 min step
            }
        });

        // 4. Filter
        const finalSlots = Array.from(possibleSlots)
            .filter(slot => !bookedTimes.has(slot))
            .sort();

        return finalSlots;

    } catch (error) {
        console.error("Error generating slots:", error);
        return [];
    }
};

