import Template from "../components/Template"

import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { Bar } from 'react-chartjs-2'
import axios from "axios"
import { useEffect, useState } from "react"
import ResponseError from "../utils/ResponseError"
import config from "../config"

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
)

const Home = () => {
    const myDate = new Date();
    const [year, setYear] = useState(myDate.getFullYear())
    const [arrYear, seyArrYear] = useState(() => {
        let arr = []
        const currentYear = myDate.getFullYear();
        const startYear = (currentYear - 5)

        for (let i = startYear; i <= currentYear; i++) {
            arr.push(i);
        }

        return arr;
    })

    const [myData, setMyData] = useState([])
    const [option] = useState(() => {
        return { responsive: true, plugin: { legend: { position: 'top' } } }
    })

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const payload = {
                year: year
            }
            const res = await axios.post(config.path + '/package/report-month', payload, config.headers())

            if (res.data.status) {
                const data = res.data.data;
                let arr = []

                for (let i = 0; i < data.length; i++) {
                    const item = data[i];
                    arr.push(item.sum)
                }

                const months = [
                    "มกราคม",
                    "กุมภาพันธ์",
                    "มีนาคม",
                    "เมษายน",
                    "พฤษภาคม",
                    "มิถุนายน",
                    "กรกฎาคม",
                    "สิงหาคม",
                    "กันยายน",
                    "ตุลาคม",
                    "พฤศจิกายน",
                    "ธันวาคม"
                ]

                setMyData({
                    labels: months,
                    datasets: [
                        {
                            label: "ยอดขาย",
                            data: arr,
                            backgroundColor: "rgba(255,99,132,0.2)",
                        }
                    ]
                })
            }


        } catch (error) {
            ResponseError(error.message)
        }
    }

    return (
        <>
            <Template>
                <div className="container">
                    <div className="h5">Dashboard</div>
                    <div className="row mt-2">
                        <div className="col-sm-4">
                            <div className="input-group">
                                <span className="input-group-text">ปี</span>
                                <select className="form-control" value={year} onChange={(e) => setYear(e.target.value)}>
                                    {
                                        arrYear.map((item) => <option value={item}>{item}</option>)
                                    }
                                </select>
                            </div>

                        </div>
                        <div className="col-sm-4">
                            <button onClick={() => fetchData()} className="btn btn-primary">แสดงรายการ</button>
                        </div>
                    </div>
                    <div className="text-center mt-3">
                        <div className="h5">รายงานสรุปยอดขายรายเดือน</div>
                    </div>
                    <div className="mt-3">
                        {
                            myData.datasets != null ?
                                <>
                                    <Bar options={option} data={myData} />
                                </> : null
                        }
                    </div>
                </div>
            </Template>
        </>
    )
}

export default Home
