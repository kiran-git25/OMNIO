import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";

export default function SpreadsheetViewer({ fileUrl }) {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    fetch(fileUrl)
      .then(res => res.arrayBuffer())
      .then(buffer => {
        const workbook = XLSX.read(buffer, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[firstSheetName];
        const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        setRows(json);
      });
  }, [fileUrl]);

  return (
    <div style={{ overflowX: "auto" }}>
      <table border="1">
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
    </div>
  );
}
