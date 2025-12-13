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
    if (!PUBLIC_KEY || !SERVICE_ID || !TEMPLATE_ID) {
        console.warn("Cannot send email: Missing configuration.");
        return; // Fail silently or throw error depending on needs
    }

    try {
        const response = await emailjs.send(
            SERVICE_ID,
            TEMPLATE_ID,
            {
                to_email: params.to_email,
                to_name: params.to_name || "Étudiant", // Fallback
                rdv_date: params.date,
                rdv_time: params.time,
                rdv_type: params.type,
                rdv_location: params.location,
                rdv_notes: params.notes || "Aucun commentaire.",
                reply_to: "associationhandepassement@gmail.com"
            }
        );

        console.log('SUCCESS!', response.status, response.text);
        return response;
    } catch (err) {
        console.error('FAILED to send email:', err);
        throw err;
    }
};
