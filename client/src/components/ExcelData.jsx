import React, { useState, useEffect } from 'react';
import { OutTable, ExcelRenderer } from 'react-excel-renderer';

function ExcelData() {

    const [data, setData] = useState([])

    const fileHandler = (event) => {
        let fileObj = event.target.files[0];

        //just pass the fileObj as parameter
        ExcelRenderer(fileObj, async (err, resp) => {
            if (err) {
                console.log(err);
            }
            else {
                console.log({
                    cols: resp.cols,
                    rows: resp.rows
                })
                setData(resp.rows)
            }
        });

    }

    const sendToBack = async () => {
        const reqSaveUsers = await fetch(
            'http://localhost:5000/users_to_database',
            {
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'POST',
                body: JSON.stringify({ users: data })
            });
        const resultSaveUsers = await reqSaveUsers.json();
        console.log(resultSaveUsers)
    }

    return (
        <>
            <h1>Приложение для загрузки Excel</h1>
            <input type="file" onChange={(e) => fileHandler(e)} style={{ "padding": "10px" }} />
            <br />
            <button onClick={() => sendToBack()}>Отправить</button>
        </>
    )
}

export default ExcelData