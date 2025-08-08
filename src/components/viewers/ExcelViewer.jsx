import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';

export default function ExcelViewer({ file }) {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const reader = new FileReader();
    reader.onload = e => {
      const wb = XLSX.read(e.target.result, { type: 'binary' });
      const sheetName = wb.SheetNames[0];
      const data = XLSX.utils.sheet_to_json(wb.Sheets[sheetName], { header: 1 });
      setRows(data);
    };
    reader.readAsBinaryString(file);
  }, [file]);

  return (
    <table border="1" cellPadding="4" style={{ marginTop: '1rem', width: '100%' }}>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i}>
            {row.map((cell, j) => (
              <td key={j}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
