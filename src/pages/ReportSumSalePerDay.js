import { useEffect, useState } from "react"
import Template from "../components/Template"
import ResponseError from "../utils/ResponseError"
import axios from 'axios'
import config from "../config"
import Modal from "../components/Modal"
import * as dayjs from 'dayjs'


const ReportSumSalePerDay = () => {
    const [results, setResults] = useState([])
    const [selectedDay, setSelectedDay] = useState({})
    const [years, setYears] = useState(() => {
        let arr = []
        let d = new Date()
        let currentYear = d.getFullYear()
        let lastYear = currentYear - 5;

        for (let i = lastYear; i <= currentYear; i++) {
            arr.push(i)
        }
        return arr;
    })

    const [selectedYear, setSelectedYear] = useState(() => {
        return new Date().getFullYear()
    })

    const [months, setMonths] = useState(() => {
        const months_th = [
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
        ];

        return months_th;
    })

    const [selectedMonth, setSelectedMonth] = useState(() => {
        return new Date().getMonth() + 1;
    })

    useEffect(() => {
        handleShowReport()
    }, [])

    const handleShowReport = async () => {
        try {
            const payload = {
                months: selectedMonth,
                years: selectedYear
            }
            const res = await axios.post(config.path + '/package/report', payload, config.headers())
            if (res.data.status) {
                setResults(res.data.data)
            }
        } catch (error) {
            ResponseError(error.message)
        }
    }

    return (
        <div>
            <Template>
                <div className="card">
                    <div className="card-header">
                        <div className="card-title">รายงานยอดขายรายวัน</div>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-sm-2">
                                <div className="input-group">
                                    <span className="input-group-text">ปี</span>
                                    <select onChange={(e) => setSelectedYear(e.target.value)} value={selectedYear} className="form-control">
                                        {
                                            years.map((item) => (
                                                <option value={item}>{item}</option>
                                            ))
                                        }
                                    </select>
                                </div>
                            </div>
                            <div className="col-sm-2">
                                <div className="input-group">
                                    <span className="input-group-text">เดือน</span>
                                    <select onChange={(e) => setSelectedMonth(e.target.value)} value={selectedMonth} className="form-control">
                                        {
                                            months.map((item, index) => (
                                                <option value={index + 1}>{item}</option>
                                            ))
                                        }
                                    </select>
                                </div>
                            </div>
                            <div className="col-sm-8">
                                <button onClick={() => handleShowReport()} className="btn btn-primary">แสดงผล</button>
                            </div>
                        </div>

                    </div>
                    <table className="table table-bordered table-striped mt-3">
                        <thead>
                            <tr>
                                <th>วันที่</th>
                                <th>ยอดรวม</th>
                                <th width="120px">Action</th>

                            </tr>
                        </thead>
                        <tbody>
                            {
                                results.length > 0 ? results.map((item, key) => (
                                    <tr>
                                        <td>{item.day}</td>
                                        <td>{item.sum.toLocaleString('TH-th')}</td>
                                        <td>
                                            <button onClick={() => setSelectedDay(item.items)} data-bs-toggle="modal" data-bs-target="#detail" className="btn btn-primary">รายละเอียด</button>
                                        </td>
                                    </tr>


                                )) : null
                            }

                        </tbody>
                    </table>

                </div>
            </Template>
            <Modal id="detail" title="รายละเอียด" size>
                <table className="table table-bordered table-striped">
                    <thead>
                        <tr>
                            <th>วันที่สมัคร</th>
                            <th>วันที่ชำระเงิน</th>
                            <th>ผู้สมัคร</th>
                            <th>Package</th>
                            <th>ค่าบริการรายเดือน</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            selectedDay.length > 0 ? selectedDay.map((item, key) => (
                                <tr>
                                    <td>{dayjs(item.createdAt).format('DD/MM/YYYY HH:mm')}</td>
                                    <td>{dayjs(item.pay_date).format('DD/MM/YYYY')} {item.pay_hours}:{item.pay_minutes}</td>
                                    <td>{item.member.name}</td>
                                    <td>{item.package.name}</td>
                                    <td className="text-end">{item.package.price.toLocaleString('TH-th')}</td>
                                </tr>
                            )) : null
                        }
                    </tbody>
                </table>
            </Modal>
        </div>
    )
}

export default ReportSumSalePerDay
