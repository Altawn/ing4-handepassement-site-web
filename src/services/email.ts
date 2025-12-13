import emailjs from '@emailjs/browser';

// Initialize with public key - ideally in main.tsx but fine here as singleton-ish
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;

if (!PUBLIC_KEY || !SERVICE_ID || !TEMPLATE_ID) {
    console.warn("EmailJS configuration missing. Emails will not be sent.");
} else {
    emailjs.init(PUBLIC_KEY);
}

interface EmailParams {
    to_email: string;
    to_name: string;
    date: string;
    time: string;
    type: string; // "Présentiel" | "Visio"
    location: string; // "Bureau Handepassement" | "Lien Meet"
    notes?: string;
}

export const sendRdvConfirmationEmail = async (params: EmailParams) => {
    // Re-check env vars inside function to be sure
    const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
    const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;

    console.log("Attempting to send email...", {
        serviceId: SERVICE_ID ? "Found" : "Missing",
        templateId: TEMPLATE_ID ? "Found" : "Missing",
        key: PUBLIC_KEY ? "Found" : "Missing",
        to: params.to_email
    });

    if (!PUBLIC_KEY || !SERVICE_ID || !TEMPLATE_ID) {
        console.error("Cannot send email: Missing configuration in .env file.");
        console.warn("Please ensure VITE_EMAILJS_PUBLIC_KEY, VITE_EMAILJS_SERVICE_ID, and VITE_EMAILJS_TEMPLATE_ID are set.");
        return;
    }

    try {
        // Pass PUBLIC_KEY explicitly as 4th argument
        const response = await emailjs.send(
            SERVICE_ID,
            TEMPLATE_ID,
            {
                to_email: params.to_email,
                to_name: params.to_name || "Étudiant",
                rdv_date: params.date,
                rdv_time: params.time,
                rdv_type: params.type,
                rdv_location: params.location,
                rdv_notes: params.notes || "Aucun commentaire.",
                reply_to: "associationhandepassement@gmail.com"
            },
            PUBLIC_KEY
        );

        console.log('EMAIL SENT SUCCESS!', response.status, response.text);
        return response;
    } catch (err) {
        console.error('FAILED to send email. Error details:', err);
        throw err;
    }
};
