import React, { useEffect, useState } from 'react'
import Template from '../components/Template'
import ResponseError from '../utils/ResponseError'
import axios from 'axios'
import config from '../config'
import * as dayjs from 'dayjs'

const ReportMember = () => {
    const [member, setMember] = useState([])

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const res = await axios.get(config.path + '/member/list', config.headers())
            if (res.data.status) {
                setMember(res.data.data)
            }
        } catch (error) {
            ResponseError(error.message)
        }
    }

    return (
        <>
            <Template>
                <div className='card'>
                    <div className='card-header'>รายชื่อผู้ที่ใช้บริการสมาชิก</div>
                    <div className='card-body'>
                        <table className='table table-bordered table-striped'>
                            <thead>
                                <tr>
                                    <th>ชื่อ</th>
                                    <th>เบอร์โทร</th>
                                    <th>วันที่</th>
                                    <th>แพ็กเก็จ</th>

                                </tr>
                            </thead>
                            <tbody>

                                {
                                    member.length > 0 ? member?.map((item, key) => (
                                        <tr key={key}>
                                            <td >{item.name}</td>
                                            <td>{item.phone}</td>
                                            <td>{dayjs(item.createdAt).format('DD/MM/YYYY HH:mm')}</td>
                                            <td>{item.package.name}</td>

                                        </tr>

                                    )) : null
                                }


                            </tbody>

                        </table>
                    </div>
                </div>
            </Template >
        </>
    )
}

export default ReportMember
