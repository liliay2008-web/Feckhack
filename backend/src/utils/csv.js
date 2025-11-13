import fs from 'fs';
import { parse } from 'csv-parse';
import XLSX from 'xlsx';

export async function parseCsvFile(filePath) {
    return new Promise((resolve, reject) => {
        const allRows = [];

        // First, read the file completely to get all rows
        fs.createReadStream(filePath)
            .pipe(parse({ columns: false, skip_empty_lines: true, bom: true, trim: true }))
            .on('data', (row) => {
                allRows.push(row);
            })
            .on('end', () => {
                if (allRows.length === 0) {
                    resolve([]);
                    return;
                }

                // Get headers from first row
                const headers = allRows[0].map(h => String(h).trim());

                // Process data rows
                const rows = allRows.slice(1).map(row => {
                    const obj = {};
                    headers.forEach((header, index) => {
                        obj[header] = row[index] ? String(row[index]).trim() : '';
                    });
                    return obj;
                });

                resolve(rows);
            })
            .on('error', (err) => {
                reject(err);
            });
    });
}

export async function parseExcelFile(filePath) {
    try {
        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // Assume first row is headers
        if (rows.length < 1) {
            throw new Error('Excel file is empty');
        }
        const headers = rows[0].map(h => String(h).trim());

        const dataRows = rows.slice(1).map(row => {
            const obj = {};
            headers.forEach((header, index) => {
                obj[header] = row[index] ? String(row[index]).trim() : '';
            });
            return obj;
        });
        return dataRows;
    } catch (err) {
        throw err;
    }
}

export async function parseFile(filePath, mimeType) {
    console.log('parseFile called for:', filePath, 'mimeType:', mimeType);
    if (mimeType === 'text/csv' || mimeType === 'application/vnd.ms-excel' || filePath.endsWith('.csv')) {
        return parseCsvFile(filePath);
    } else if (mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || filePath.endsWith('.xlsx')) {
        return parseExcelFile(filePath);
    } else {
        throw new Error('Unsupported file type');
    }
}


