const crypto = require('crypto');

/**
 * Generate a deterministic avatar URL for an email address.
 * Uses UI Avatars for deterministic, initial-based avatars.
 * @param {string} email - User's email address
 * @returns {string} Avatar URL
 */
function generateAvatar(email) {
    if (!email) return null;

    const normalizedEmail = email.trim().toLowerCase();

    // Use UI Avatars: https://ui-avatars.com/
    // Format: Name from email part, background color from email hash

    const namePart = normalizedEmail.split('@')[0];
    // Simple hash for color to make it deterministic but varied
    const hash = crypto.createHash('md5').update(normalizedEmail).digest('hex');
    const color = hash.substring(0, 6);

    // Construct URL
    // background=random would be non-deterministic, so we use hash-based color
    // color=fff (white text)
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(namePart)}&background=${color}&color=fff&size=128`;
}

module.exports = { generateAvatar };
