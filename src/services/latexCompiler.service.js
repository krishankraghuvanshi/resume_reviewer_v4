const { exec } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

class LatexCompilerService {
  constructor() {
    this.latexServiceUrl = process.env.LATEX_SERVICE_URL || 'latex_compiler';
    this.workdir = '/workdir';
  }

  /**
   * Compile LaTeX content to PDF using Docker container
   * @param {string} latexContent - LaTeX source code
   * @param {string} filename - Optional filename (without extension)
   * @returns {Promise<Buffer>} PDF buffer
   */
  async compileLatexToPdf(latexContent, filename = null) {
    try {
      // Generate unique filename if not provided
      const baseFilename = filename || `resume_${uuidv4()}`;
      const texFilename = `${baseFilename}.tex`;
      const pdfFilename = `${baseFilename}.pdf`;
      
      // Write LaTeX file to storage (app container path)
      const texPath = path.join(process.cwd(), 'storage', texFilename);
      await fs.writeFile(texPath, latexContent, 'utf8');
      
      // Copy file to LaTeX container workdir
      const copyCommand = `docker cp ${texPath} latex_compiler:/workdir/${texFilename}`;
      await new Promise((resolve, reject) => {
        const { exec } = require('child_process');
        exec(copyCommand, (error, stdout, stderr) => {
          if (error) {
            return reject(new Error(`Failed to copy file to container: ${stderr || error.message}`));
          }
          resolve();
        });
      });
      
      // Compile using Docker container
      const pdfBuffer = await this.compileWithDocker(texFilename, pdfFilename);
      
      // Clean up temporary files
      await this.cleanupFiles(texFilename, pdfFilename);
      
      return pdfBuffer;
    } catch (error) {
      throw new Error(`LaTeX compilation failed: ${error.message}`);
    }
  }

  /**
   * Compile LaTeX using Docker container
   * @param {string} texFilename - .tex filename
   * @param {string} pdfFilename - expected .pdf filename
   * @returns {Promise<Buffer>} PDF buffer
   */
  async compileWithDocker(texFilename, pdfFilename) {
    return new Promise((resolve, reject) => {
      const dockerCommand = `docker exec ${this.latexServiceUrl} pdflatex -interaction=nonstopmode -output-directory=${this.workdir} ${this.workdir}/${texFilename}`;
      
      exec(dockerCommand, (error, stdout, stderr) => {
        if (error) {
          console.error('Docker exec error:', error);
          console.error('stderr:', stderr);
          return reject(new Error(`Docker execution failed: ${stderr || error.message}`));
        }

        // Read the generated PDF file from LaTeX container
        const readCommand = `docker exec ${this.latexServiceUrl} cat ${this.workdir}/${pdfFilename}`;
        exec(readCommand, { encoding: null, maxBuffer: 10 * 1024 * 1024 }, (readError, stdout) => {
          if (readError) {
            return reject(new Error(`Failed to read PDF from container: ${readError.message}`));
          }
          
          resolve(Buffer.from(stdout));
        });
      });
    });
  }

  /**
   * Clean up temporary files
   * @param {string} texFilename - .tex filename
   * @param {string} pdfFilename - .pdf filename
   */
  async cleanupFiles(texFilename, pdfFilename) {
    const extensions = ['.tex', '.pdf', '.log', '.aux', '.out'];
    
    for (const ext of extensions) {
      try {
        const filename = texFilename.replace('.tex', ext);
        const filePath = path.join(process.cwd(), 'storage', filename);
        await fs.unlink(filePath);
      } catch (error) {
        // Ignore file not found errors
        if (error.code !== 'ENOENT') {
          console.warn(`Warning: Could not delete ${filename}: ${error.message}`);
        }
      }
    }
  }

  /**
   * Validate LaTeX content before compilation
   * @param {string} latexContent - LaTeX source code
   * @returns {boolean} true if valid
   */
  validateLatex(latexContent) {
    if (!latexContent || typeof latexContent !== 'string') {
      return false;
    }

    // Basic LaTeX structure validation
    const requiredPatterns = [
      /\\documentclass/,
      /\\begin{document}/,
      /\\end{document}/
    ];

    return requiredPatterns.every(pattern => pattern.test(latexContent));
  }

  /**
   * Get compilation status and logs
   * @param {string} latexContent - LaTeX source code
   * @returns {Promise<Object>} compilation result with logs
   */
  async getCompilationStatus(latexContent) {
    try {
      if (!this.validateLatex(latexContent)) {
        return {
          success: false,
          error: 'Invalid LaTeX structure - missing required document elements'
        };
      }

      const pdfBuffer = await this.compileLatexToPdf(latexContent);
      return {
        success: true,
        pdfSize: pdfBuffer.length,
        message: 'PDF generated successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = new LatexCompilerService();
