const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const logger = require('../utils/logger');

// Base storage directory
const STORAGE_BASE_DIR = path.resolve(process.cwd(), 'storage', 'resumes');

// Ensure base storage exists
if (!fs.existsSync(STORAGE_BASE_DIR)) {
    fs.mkdirSync(STORAGE_BASE_DIR, { recursive: true });
}

/**
 * Generates a SHA-256 hash of the buffer content
 * @param {Buffer} buffer 
 * @returns {string} Hex string of hash
 */
function generateFileHash(buffer) {
    return crypto.createHash('sha256').update(buffer).digest('hex');
}

/**
 * Stores a PDF file locally with a readable, timestamped filename.
 * Format: storage/resumes/{sanitized_email}_{epoch}.pdf
 * @param {string} email - User email
 * @param {string} originalFilePath - Path to temporary uploaded file
 * @returns {string} Relative path to stored file
 */
async function archiveResume(email, originalFilePath) {
    // Sanitize email for filename safety (replace special chars with underscore)
    const safeEmail = email.replace(/[^a-zA-Z0-9.@-]/g, '_');
    const timestamp = Date.now();
    const fileName = `${safeEmail}_${timestamp}.pdf`;

    // We store directly in base dir or maybe still want sharding? 
    // User asked for "resumes/emailid_epochTime.pdf", implies flat structure in 'resumes' folder.
    const destPath = path.join(STORAGE_BASE_DIR, fileName);

    // Move file from temp location to final storage
    await fs.promises.copyFile(originalFilePath, destPath);

    // Return relative path for DB storage (portable)
    return path.join('storage', 'resumes', fileName);
}

module.exports = {
    generateFileHash,
    archiveResume,
    STORAGE_BASE_DIR
};
