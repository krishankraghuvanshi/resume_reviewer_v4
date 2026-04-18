const db = require("../db");

/**
 * Mask email for privacy protection
 * Format: firstChar + *** + lastCharBefore@ + @domain
 */
function maskEmail(email) {
    if (!email) return 'Unknown';
    
    const atIndex = email.indexOf('@');
    if (atIndex === -1) return email;
    
    const firstChar = email[0];
    const lastChar = email[atIndex - 1];
    const domain = email.substring(atIndex);
    
    return `${firstChar}***${lastChar}${domain}`;
}

/**
 * GET /api/resumes
 * Retrieve stored resumes with sorting, pagination, and filtering.
 */
async function getResumes(req, res, next) {
    try {
        const { email, sort = "ats_score", order = "desc", limit = 10, offset = 0 } = req.query;

        let queryText = `
      SELECT id as resume_id, email, avatar_url, ats_score, created_at, parsed_data
      FROM resumes
    `;
        const queryParams = [];
        const whereClauses = [];

        // Filtering
        if (email) {
            queryParams.push(email);
            whereClauses.push(`email = $${queryParams.length}`);
        }

        if (whereClauses.length > 0) {
            queryText += " WHERE " + whereClauses.join(" AND ");
        }

        // Sorting
        // whitelist columns to prevent injection
        const validSorts = ["ats_score", "created_at"];
        const sortCol = validSorts.includes(sort) ? sort : "ats_score";
        const sortOrder = order.toLowerCase() === "asc" ? "ASC" : "DESC";

        queryText += ` ORDER BY ${sortCol} ${sortOrder}`;

        // Pagination
        queryParams.push(parseInt(limit) || 10);
        queryText += ` LIMIT $${queryParams.length}`;

        queryParams.push(parseInt(offset) || 0);
        queryText += ` OFFSET $${queryParams.length}`;

        const { rows } = await db.query(queryText, queryParams);

        // Transform response
        const results = rows.map(row => {
            const pd = row.parsed_data || {};
            return {
                resume_id: row.resume_id,
                email: maskEmail(row.email),
                name: pd.personal_info?.name || "Unknown",
                avatar_url: row.avatar_url,
                ats_score: row.ats_score,
                created_at: row.created_at,
                summary: {
                    skills_count: Array.isArray(pd.skills) ? pd.skills.length : 0,
                    experience_count: Array.isArray(pd.experience) ? pd.experience.length : 0
                }
            };
        });

        res.json(results);
    } catch (err) {
        next(err);
    }
}

module.exports = { getResumes };
