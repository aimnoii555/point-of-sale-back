import React, { useEffect, useState } from 'react'
import Template from '../components/Template'
import axios from 'axios'
import ResponseError from '../utils/ResponseError'
import config from '../config'
import Modal from '../components/Modal'
import * as dayjs from 'dayjs'

const ReportSumSalePerYear = () => {
    const [reports, setReports] = useState([])
    const [selectedYear, setSelectedYear] = useState({})

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const res = await axios.get(config.path + '/package/report-year', config.headers())
            if (res.data.status) {
                setReports(res.data.data)
            }
        } catch (error) {
            ResponseError(error.message)
        }
    }

    return (
        <>
            <Template>
                <div className='card'>
                    <div className='card-header'>
                        <div className='card-title'>รายงานยอดขายรายปี</div>
                    </div>
                    <div className='card-body'>
                        <table className='mt-3 table table-bordered table-striped'>
                            <thead>
                                <tr>
                                    <th>ปี</th>
                                    <th>รายได้</th>
                                    <th width="130px"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    reports.length > 0 ? reports.map((item, key) => (
                                        <tr>
                                            <td>{item.years}</td>
                                            <td>{item.sum}</td>
                                            <td>
                                                <button onClick={() => setSelectedYear(item.items)} data-bs-toggle="modal" data-bs-target="#detail" className='btn btn-primary'>รายละเอียด</button>

                                            </td>

                                        </tr>)) : null
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </Template>
            <Modal title="รายละเอียด" id="detail" size>
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
                            selectedYear.length > 0 ? selectedYear.map((item, key) => (
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

export default ReportSumSalePerYear
