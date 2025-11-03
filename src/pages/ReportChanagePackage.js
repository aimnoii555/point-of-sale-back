import React, { useEffect, useState } from 'react'
import Template from '../components/Template'
import ResponseError from '../utils/ResponseError'
import axios from 'axios'
import config from '../config'
import * as dayjs from 'dayjs'
import Modal from '../components/Modal'
import Swal from 'sweetalert2'

const ReportChanagePackage = () => {
  const [items, setItems] = useState(0)
  const [memberPackage, setMemberPackage] = useState([])
  const [remark, setRemark] = useState('')
  const [payHours, setPayHours] = useState(() => {
    const d = new Date();
    return d.getHours()
  });
  const [payMinutes, setPayMinutes] = useState(() => {
    const d = new Date();
    return d.getMinutes()
  })

  const [payDate, setPayDate] = useState(() => {
    const currentDate = new Date()
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();
    const year = currentDate.getFullYear();

    const formattedMonth = month < 10 ? `0${month}` : month;
    const formattedDay = day < 10 ? `0${day}` : day;

    const date = (year + '-' + (formattedMonth) + '-' + formattedDay)
    return date;
  })

  const [arrHours] = useState(() => {
    let arr = []

    for (let i = 0; i <= 23; i++) {
      arr.push(i)
    }
    return arr;
  })

  const [minutes] = useState(() => {
    let arr = []

    for (let i = 0; i <= 59; i++) {
      arr.push(i)
    }

    return arr;
  })

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    try {
      const res = await axios.get(config.path + '/change-package/list', config.headers())
      if (res.data.status) {
        setMemberPackage(res.data.data)
      }
    } catch (error) {
      ResponseError(error.message)
    }
  }

  const handleSave = async () => {
    try {
      const payload = {
        id: items.id,
        package_id: items.package_id,
        user_id: items.user_id,
        pay_date: payDate,
        pay_hours: payHours,
        pay_minutes: payMinutes,
        remark
      }


      const res = await axios.post(config.path + '/chanage-package/change', payload, config.headers())
      if (res.data.status) {
        Swal.fire({
          title: 'Saved',
          text: 'Saved Successfully',
          icon: 'success',
          timer: 2000
        })


        document.querySelector('[data-bs-dismiss="modal"]').click()

      }
    } catch (error) {
      ResponseError(error.message)
    }
  }



  return (
    <>
      <Template>
        <div className='card'>
          <div className='card-header'>จัดการแพ็กเก็จสมาชิก</div>
          <div className='card-body'>
            <table className='table table-bordered table-striped'>
              <thead>
                <tr>
                  <th>ชื่อ</th>
                  <th>เบอร์โทร</th>
                  <th>ค่าบริการ</th>
                  <th>วันที่ขอเปลี่ยน</th>
                  <th>แพ็กเก็จที่ต้องการ</th>
                  <th width="49">Action</th>
                </tr>
              </thead>
              <tbody>
                {
                  memberPackage.length > 0 ? memberPackage.map((item, key) => (

                    <tr key={key}>
                      <td>{item.member?.name}</td>
                      <td>{item.member?.phone}</td>
                      <td>{item.package.price.toLocaleString('TH-th')}</td>
                      <td>{dayjs(item.createdAt).format('DD/MM/YYYY HH:mm')}</td>
                      <td>{item.package.name}</td>
                      <td>
                        <button onClick={() => setItems(item)} data-bs-toggle="modal"
                          data-bs-target="#staticBackdrop" className='btn btn-primary'>ละเอียด</button>
                      </td>
                    </tr>

                  )) : null
                }
              </tbody>

            </table>
          </div>
        </div>
      </Template>


      <Modal id="staticBackdrop" title="รายละเอียด">
        <div>
          <labe>วันที่ชำระ</labe>
          <input value={payDate} onChange={(e) => setPayDate(e.target.value)} type='date' className='form-control' />
        </div>
        <div>
          <label>เวลา</label>
          <div className='row'>
            <div className='col-6'>
              <div className='input-group'>
                <div className='input-group-text'>ชั่วโมง</div>
                <select value={payHours} onChange={(e) => setPayHours(e.target.value)} className='form-control'>
                  {
                    arrHours.map((item) => (
                      <>
                        <option value={item}>{item}</option>
                      </>
                    ))
                  }
                </select>
              </div>
            </div>
            <div className='col-6'>
              <div className='input-group'>
                <div className='input-group-text'>นาที</div>
                <select value={payMinutes} onChange={(e) => setPayMinutes(e.target.value)} className='form-control'>
                  {
                    minutes.map((item) => (
                      <>
                        <option value={item}>{item}</option>
                      </>
                    ))
                  }
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className='mt-3'>
          <label>หมายเหตุ</label>
          <input onChange={(e) => setRemark(e.target.value)} type='text' className='form-control' />
        </div>
        <div className='mt-3'>
          <button onClick={() => handleSave()} className='btn btn-success'>ยอมรับ</button>
        </div>
      </Modal>

    </>
  )
}

export default ReportChanagePackage
