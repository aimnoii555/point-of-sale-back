import React, { useEffect, useState } from 'react'
import Template from '../components/Template'
import ResponseError from '../utils/ResponseError';
import axios from 'axios'
import config from '../config';
import * as dayjs from 'dayjs'
import Modal from '../components/Modal';

const ReportSumSalePerMonth = () => {
    const [years, setYears] = useState(() => {
        let arr = [];
        let d = new Date();
        let currentYear = d.getFullYear()
        let lastYear = (currentYear - 5);

        for (let index = lastYear; index <= currentYear; index++) arr.push(index)
        return arr;
    })

    const [currentYear, setCurrentYear] = useState(() => {
        return new Date().getFullYear()
    })

    const [report, setReport] = useState([])

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

    const [selectedMonth, setSelectedMonth] = useState({})

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const payload = {
                year: currentYear
            }
            const res = await axios.post(config.path + '/package/report-month', payload, config.headers());
            if (res.data.status) {
                setReport(res.data.data)
            }
        } catch (error) {
            ResponseError(error.message)
        }
    }


    return (
        <>
            <Template>
                <div className='card'>
                    <div className="card-header">
                        <div className='card-title'>รายงานสรุปยอดขายรายเดือน</div>
                    </div>
                    <div className='card-body'>
                        <div className='input-group'>
                            <span className='input-group-text'>ปี</span>
                            <select onChange={(e) => setCurrentYear(e.target.value)} value={currentYear} className='form-control'>
                                {
                                    years.map((item) => (
                                        <option value={item}>{item}</option>
                                    ))
                                }
                            </select>
                            <button onClick={fetchData} className='btn btn-primary'>แสดงผล</button>
                        </div>

                        <table className='table table-bordered table-striped mt-3'>
                            <thead>
                                <tr>
                                    <th>เดือน</th>
                                    <th>ยอดขาย</th>
                                    <th width="120px"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    report.length > 0 ? report.map((item) => (
                                        <tr>
                                            <td>{months[item.month - 1]}</td>
                                            <td>{item.sum.toLocaleString('TH-th')}</td>
                                            <td>
                                                <button onClick={() => setSelectedMonth(item.items)} data-bs-toggle="modal" data-bs-target="#detail" className='btn btn-primary'>รายละเอียด</button>
                                            </td>

                                        </tr>
                                    )) : null
                                }
                            </tbody>
                        </table>
                    </div>
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
                            selectedMonth.length > 0 ? selectedMonth.map((item, key) => (
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
        </>
    )
}

export default ReportSumSalePerMonth
