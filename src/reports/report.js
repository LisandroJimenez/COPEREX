import ExcelJS from 'exceljs';
import Enterprise from '../enterprises/enterprise.model.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateReport = async (req, res) => {
    try {
        const enterprises = await Enterprise.find();
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Empresas');
        worksheet.columns = [
            { header: 'Nombre', key: 'name', width: 25 },
            { header: 'Nivel de Impacto', key: 'impactLevel', width: 20 },
            { header: 'Años de Experiencia', key: 'yearsExperience', width: 20 },
            { header: 'Categoría', key: 'category', width: 25 },
        ];

        enterprises.forEach((enterprise) => {
            worksheet.addRow({
                name: enterprise.name,
                impactLevel: enterprise.impactLevel,
                yearsExperience: enterprise.yearsExperience,
                category: enterprise.category,
            });
        });

        const reportsDir = path.join(__dirname, '../reports');
        if (!fs.existsSync(reportsDir)) {
            fs.mkdirSync(reportsDir, { recursive: true }); 
        }

        const filePath = path.join(reportsDir, 'enterprise_report.xlsx');

        await workbook.xlsx.writeFile(filePath);

        res.status(200).json({
            success: true,
            msg: 'Report created successfully',
            downloadUrl: `/reports/enterprise_report.xlsx`, 
        });
    } catch (error) {
        console.error('Error al generar el reporte:', error);
        res.status(500).json({ success: false, msg: 'Error generating report' });
    }
};
