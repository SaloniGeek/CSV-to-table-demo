import React, { useEffect, useState } from "react";
import styles from "@/app/page.module.css";

const Table = ({ csvData }) => {
    const [headings, setHeadings] = useState([]);
    const [currentRow, setCurrentRow] = useState();
    const [currentCol, setCurrentCol] = useState();
    const [currentHeaderIndex, setCurrentHeaderIndex] = useState();
    const [data, setData] = useState();

    useEffect(() => {
        setData(csvData);
    }, [csvData]);

    useEffect(() => {
        if (data?.length > 0) {
            setHeadings(Object.keys(data[0]));
        }
    }, [data]);

    const handleRightClick = (event, row_id, col_id) => {
        event.preventDefault();
        setCurrentRow(row_id);
        setCurrentCol(col_id);
        event.stopPropagation();
    };

    const handleRowAdd = (row_index) => {
        let obj = {};
        Object.keys(data[0])?.map((i) => {
            obj = { ...obj, [i]: "" };
        });
        let arr = data;
        arr?.splice(row_index + 1, 0, obj);
        setData(arr);
        setCurrentCol("");
        setCurrentRow("");
    };

    const handleDeleteRow = (row_index) => {
        let arr = data;
        arr?.splice(row_index, 1);
        setData(arr);
        setCurrentCol("");
        setCurrentRow("");
    };

    const handleAddColumn = (col_key) => {
        const arr = data;
        const newArr = arr?.map((item) => {
            const entries = Object.entries(item);
            const indexItem = entries?.find(([key, value], index) => key === col_key);
            const index = entries?.findIndex((item) => item[0] === indexItem[0]);
            const column = ["Untitled column", ""];
            entries.splice(index + 1, 0, column);

            const object = entries.reduce(function (obj, current) {
                const key = current[0];
                const value = current[1];
                obj[key] = value;
                return obj;
            }, {});

            return object;
        });

        const heads = headings;
        const index = heads?.indexOf(col_key);
        heads.splice(index + 1, 0, "");
        setHeadings(heads);

        setData(newArr);
        setCurrentCol("");
        setCurrentRow("");
    };

    const handleDeleteColumn = (col_key) => {
        const arr = data;
        const newArr = arr?.map((item) => {
            const entries = Object.entries(item);
            const newEntries = entries?.filter(([key, value]) => key !== col_key);

            const object = newEntries.reduce(function (obj, current) {
                const key = current[0];
                const value = current[1];
                obj[key] = value;
                return obj;
            }, {});

            return object;
        });

        const heads = headings?.filter((i) => i !== col_key);
        setHeadings(heads);

        setData(newArr);
        setCurrentCol("");
        setCurrentRow("");
    };

    const handleHeaderRightClick = (event, index) => {
        event.preventDefault();
        setCurrentHeaderIndex(index);
    };

    const handleHeaderAddColumn = (index, headerItem) => {
        const heads = headings;
        heads?.splice(index + 1, 0, "Untitled column");
        setHeadings(heads);

        const arr = data;
        const newArr = arr?.map((item) => {
            const entries = Object.entries(item);
            const indexItem = entries?.find(([key, value]) => key === headerItem);
            const i = entries?.findIndex((item) => item[0] === indexItem[0]);
            const column = ["Untitled column", ""];
            entries.splice(i + 1, 0, column);

            const object = entries.reduce(function (obj, current) {
                const key = current[0];
                const value = current[1];
                obj[key] = value;
                return obj;
            }, {});

            return object;
        });

        setData(newArr);

        setCurrentHeaderIndex("");
    };

    const handleHeaderDeleteColumn = (headerItem) => {
        const heads = headings?.filter((i) => i !== headerItem);
        setHeadings(heads);

        const arr = data;
        const newArr = arr?.map((item) => {
            const entries = Object.entries(item);
            const newEntries = entries?.filter(([key, value]) => key !== headerItem);

            const object = newEntries.reduce(function (obj, current) {
                const key = current[0];
                const value = current[1];
                obj[key] = value;
                return obj;
            }, {});

            return object;
        });

        setData(newArr);
        setCurrentHeaderIndex("");
    };

    const handleHeaderRowAdd = () => {
        let obj = {};
        Object.keys(data[0])?.map((i) => {
            obj = { ...obj, [i]: "Untitled column" };
        });
        let arr = [obj, ...data];
        setData(arr);
        setCurrentHeaderIndex("");
    };

    const handleTableDataChange = (event, index, field) => {
        event.preventDefault();
        const tableData = [...data];
        console.log(true, event.currentTarget.innerText);
        tableData[index][field] = event.currentTarget.innerText;
        setData(tableData);
    };

    const handleHeadingChange = (event, index) => {
        const heads = [...headings];
        heads[index] = event.currentTarget.innerText;
        setHeadings(heads);
    };

    const handleDataSave = () => {
        console.log(data);
        console.log(headings);

        const arr = data?.map((item, index) => {
            const tdObj = {};
            let tdIndex = 0;
            for (let tdData in item) {
                tdObj[headings[tdIndex]] = item[tdData];
                tdIndex++;
            }
            return tdObj;
        });

        console.log("FINAL", arr);
    };

    return (
        <>
            {data?.length > 0 && (
                <>
                    <div className={styles?.tableWp}>
                        <table
                            className={styles.table}
                            onClick={() => {
                                setCurrentCol(null);
                                setCurrentRow(null);
                            }}>
                            <tr className={styles.tableRow}>
                                {headings?.length > 0 &&
                                    headings?.map((i, index) => {
                                        return (
                                            <th
                                                className={styles?.tableData}
                                                key={i + index}
                                                onContextMenu={(event) =>
                                                    handleHeaderRightClick(event, index)
                                                }
                                                contentEditable
                                                suppressContentEditableWarning
                                                onBlur={(event) => handleHeadingChange(event, index)}>
                                                {i}
                                                {currentHeaderIndex === index && (
                                                    <div className={styles.rightClickMenu}>
                                                        <ul>
                                                            <li
                                                                onClick={() =>
                                                                    handleHeaderAddColumn(index, i)
                                                                }>
                                                                Insert a new column
                                                            </li>
                                                            <li onClick={() => handleHeaderRowAdd()}>
                                                                Insert a new row
                                                            </li>
                                                            <li onClick={() => handleHeaderDeleteColumn(i)}>
                                                                Delete selected column
                                                            </li>
                                                        </ul>
                                                    </div>
                                                )}
                                            </th>
                                        );
                                    })}
                            </tr>
                            {data?.map((i, row_index) => {
                                return (
                                    <tr className={styles?.tableRow} key={row_index}>
                                        {Object?.entries(i)?.map(([key, value], col_index) => {
                                            return (
                                                <>
                                                    <td
                                                        className={styles?.tableData}
                                                        key={key + col_index}
                                                        onContextMenu={(event) =>
                                                            handleRightClick(event, row_index, col_index)
                                                        }
                                                        contentEditable
                                                        suppressContentEditableWarning
                                                        onBlur={(event) =>
                                                            handleTableDataChange(event, row_index, key)
                                                        }>
                                                        {value}
                                                        {/* <p>{value}</p> */}
                                                        {currentRow === row_index &&
                                                            currentCol === col_index && (
                                                                <div className={styles.rightClickMenu}>
                                                                    <ul>
                                                                        <li
                                                                            onClick={() =>
                                                                                handleAddColumn(key)
                                                                            }>
                                                                            Insert a new column
                                                                        </li>
                                                                        <li
                                                                            onClick={() =>
                                                                                handleRowAdd(row_index)
                                                                            }>
                                                                            Insert a new row
                                                                        </li>
                                                                        <li
                                                                            onClick={() =>
                                                                                handleDeleteRow(row_index)
                                                                            }>
                                                                            Delete selected row
                                                                        </li>
                                                                        <li
                                                                            onClick={() =>
                                                                                handleDeleteColumn(key)
                                                                            }>
                                                                            Delete selected column
                                                                        </li>
                                                                    </ul>
                                                                </div>
                                                            )}
                                                    </td>
                                                </>
                                            );
                                        })}
                                    </tr>
                                );
                            })}
                        </table>
                    </div>
                    <button onClick={handleDataSave}>Save</button>
                </>
            )}
        </>
    );
};

export default Table;
