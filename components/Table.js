import React, { useEffect, useRef, useState } from "react";
import styles from "@/app/page.module.css";

const Table = ({ csvData, updateFile }) => {
    const [headings, setHeadings] = useState([]);
    const [currentRow, setCurrentRow] = useState();
    const [currentCol, setCurrentCol] = useState();
    const [currentKey, setCurrentKey] = useState();
    const [currentHeaderIndex, setCurrentHeaderIndex] = useState();
    const [data, setData] = useState();
    const [menuHeight, setMenuHeight] = useState(0);
    const [menuWidth, setMenuWidth] = useState(0);
    const [menuVisibility, setMenuVisibility] = useState("hidden");

    useEffect(() => {
        setData(csvData);
    }, [csvData]);

    useEffect(() => {
        if (data?.length > 0) {
            setHeadings(Object.keys(data[0]));
        }
    }, [data]);

    const convertEntriesToObject = (entries) => {
        let obj = {};
        entries?.forEach((item) => {
            obj = { ...obj, [item[0]]: item[1] };
        });
        return obj;
    };

    const resetCell = () => {
        setCurrentCol(null);
        setCurrentRow(null);
        setCurrentKey(null);
        setMenuHeight(null);
        setMenuWidth(null);
        setMenuVisibility("hidden");
    };

    const handleRightClick = (event, row_id, col_id, key) => {
        event.preventDefault();
        setMenuHeight(event.clientY);
        setMenuWidth(event.clientX);
        setMenuVisibility("visible");
        setCurrentRow(row_id);
        setCurrentCol(col_id);
        setCurrentKey(key);
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
        resetCell();
    };

    const handleDeleteRow = (row_index) => {
        let arr = data;
        arr?.splice(row_index, 1);
        setData(arr);
        resetCell();
    };

    const handleAddColumn = (col_key) => {
        const arr = data;
        const newArr = arr?.map((item) => {
            const entries = Object.entries(item);
            const indexItem = entries?.find(([key, value], index) => key === col_key);
            const index = entries?.findIndex((item) => item[0] === indexItem[0]);
            const untitledColumnCount = Object.keys(item)?.filter((i) =>
                i?.includes("Untitled column")
            )?.length;
            const column = [`Untitled column ${untitledColumnCount + 1}`, ""];
            entries.splice(index + 1, 0, column);

            return convertEntriesToObject(entries);
        });

        const heads = headings;
        const index = heads?.indexOf(col_key);
        heads.splice(index + 1, 0, "");
        setHeadings(heads);

        setData(newArr);
        resetCell();
    };

    const handleDeleteColumn = (col_key) => {
        const arr = data;
        const newArr = arr?.map((item) => {
            const entries = Object.entries(item);
            const newEntries = entries?.filter(([key, value]) => key !== col_key);

            return convertEntriesToObject(newEntries);
        });

        const heads = headings?.filter((i) => i !== col_key);
        setHeadings(heads);

        setData(newArr);
        resetCell();
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
            const untitledColumnCount = Object.keys(item)?.filter((i) =>
                i?.includes("Untitled column")
            )?.length;
            const column = [`Untitled column ${untitledColumnCount + 1}`, ""];
            entries.splice(i + 1, 0, column);

            return convertEntriesToObject(entries);
        });

        setData(newArr);
        setCurrentHeaderIndex("");
        resetCell();
    };

    const handleHeaderDeleteColumn = (headerItem) => {
        const heads = headings?.filter((i) => i !== headerItem);
        setHeadings(heads);

        const arr = data;
        const newArr = arr?.map((item) => {
            const entries = Object.entries(item);
            const newEntries = entries?.filter(([key, value]) => key !== headerItem);

            return convertEntriesToObject(newEntries);
        });

        setData(newArr);
        resetCell();
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
        tableData[index][field] = event.currentTarget.innerText;
        setData(tableData);
    };

    const handleHeadingChange = (event, index) => {
        const heads = [...headings];
        heads[index] = event.currentTarget.innerText;
        setHeadings(heads);

        const arr = data;
        const newArr = arr?.map((item) => {
            const entries = Object.entries(item);
            let obj = {};
            entries?.forEach(([key, value], entryIndex) => {
                if (index === entryIndex) {
                    obj = { ...obj, [event.currentTarget.innerText]: value };
                } else {
                    obj = { ...obj, [key]: value };
                }
            });

            return obj;
        });

        setData(newArr);
    };

    const handleDataSave = () => {
        const arr = data?.map((item, index) => {
            const tdObj = {};
            let tdIndex = 0;
            for (let tdData in item) {
                tdObj[headings[tdIndex]] = item[tdData];
                tdIndex++;
            }
            return tdObj;
        });
        setData(arr);
        updateFile(arr);
        alert("Data saved successfully");
    };

    return (
        <>
            {data?.length > 0 && (
                <>
                    <div className={styles?.tableWp}>
                        <table className={styles.table} onClick={resetCell}>
                            <tr className={styles.tableRow}>
                                {headings?.length > 0 &&
                                    headings?.map((i, index) => {
                                        return (
                                            <th
                                                className={styles?.tableData}
                                                key={Math.random() + index}
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
                                                        key={Math.random() + col_index}
                                                        onContextMenu={(event) => {
                                                            handleRightClick(
                                                                event,
                                                                row_index,
                                                                col_index,
                                                                key
                                                            );
                                                        }}
                                                        contentEditable
                                                        suppressContentEditableWarning
                                                        onBlur={(event) =>
                                                            handleTableDataChange(event, row_index, key)
                                                        }>
                                                        {value}
                                                    </td>
                                                </>
                                            );
                                        })}
                                    </tr>
                                );
                            })}
                        </table>
                        <div
                            className={styles.rightClickMenu}
                            style={{ visibility: menuVisibility, top: menuHeight, left: menuWidth }}>
                            <ul>
                                <li onClick={() => handleAddColumn(currentKey)}>Insert a new column</li>
                                <li onClick={() => handleRowAdd(currentRow)}>Insert a new row</li>
                                <li onClick={() => handleDeleteRow(currentRow)}>Delete selected row</li>
                                <li onClick={() => handleDeleteColumn(currentKey)}>Delete selected column</li>
                            </ul>
                        </div>
                    </div>
                    <button onClick={handleDataSave}>Save</button>
                </>
            )}
        </>
    );
};

export default Table;
