import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";

export default function SpreadsheetViewer({ file }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function loadSpreadsheet() {
      try {
        const response = await fetch(file.url || file);
        const blob = await response.blob();
        const arrayBuffer = await blob.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        setData(jsonData);
      } catch (err) {
        console.error("Error loading spreadsheet:", err);
      }
    }
    loadSpreadsheet();
  }, [file]);

  return (
    <div style={{ overflowX: "auto", maxHeight: "80vh" }}>
      <table
        style={{
          borderCollapse: "collapse",
          width: "100%",
          background: "#fff",
        }}
      >
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  style={{
                    border: "1px solid #ccc",
                    padding: "4px 8px",
                    whiteSpace: "nowrap",
                  }}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
