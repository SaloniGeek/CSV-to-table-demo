"use client";
import Table from "@/components/Table";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import csv from "csvtojson";

export default function Home() {
    const [file, setFile] = useState();
    const [jsonData, setJsonData] = useState();

    const handleCSVInputChange = (event) => {
        const file = event.target.files[0];

        if (file?.type === "text/csv") {
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

            <Table csvData={jsonData} />
        </main>
    );
}
