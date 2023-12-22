"use client";
import Table from "@/components/Table";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import csv from "csvtojson";
import { mkConfig, generateCsv, download } from "export-to-csv";
import Link from "next/link";

export default function Home() {
    const [file, setFile] = useState();
    const [jsonData, setJsonData] = useState();
    const [savedFile, setSavedFile] = useState("");
    const [filename, setFilename] = useState("");

    const csvConfig = mkConfig({ useKeysAsHeaders: true });

    const handleCSVInputChange = (event) => {
        const file = event.target.files[0];

        if (file?.type === "text/csv") {
            setFilename(file?.name);
            setFile(file);
            const reader = new FileReader();

            reader.onload = (e) => {
                const csvData = e.target.result;
                csv()
                    .fromString(csvData)
                    .then((result) => {
                        setJsonData(result);
                    });
            };

            reader.readAsText(file);
        } else {
            alert("Only CSV files are supported");
        }
    };

    const updateFile = (csvData) => {
        const csv = generateCsv(csvConfig)(csvData);
        var blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        var url = URL.createObjectURL(blob);
        setSavedFile(url);
    };

    return (
        <main className={styles.main}>
            <div className={styles?.inputCsvWp}>
                <input
                    id="csv_file"
                    className={styles.csvFile}
                    type="file"
                    accept=".csv"
                    onChange={handleCSVInputChange}
                />
                <span className={styles?.filename}>{file ? file?.name : "Upload your CSV file here"}</span>
            </div>

            <Table csvData={jsonData} updateFile={updateFile} />

            <Link href={savedFile} download>
                Export CSV{" "}
            </Link>
        </main>
    );
}
