import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ResponseError from '../utils/ResponseError'
import axios from 'axios'
import config from '../config'
import Modal from './Modal'
import Swal from 'sweetalert2'
import CloseModal from '../utils/CloseModal'

const Template = (props) => {
    const [admin, setAdmin] = useState({})
    const navigate = useNavigate()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')


    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const res = await axios.get(config.path + '/admin/info', config.headers())
            if (res.data.status) {
                setAdmin(res.data.data)
            }
        } catch (error) {
            ResponseError(error.message)
        }
    }

    const handleSignOut = () => {
        localStorage.removeItem(config.token_name)
        navigate('/')
    }


    const handleChanageProfile = async (e) => {
        e.preventDefault();

        try {
            const payload = {
                username,
                password,
                id: admin.id,
            }
            const res = await axios.post(config.path + '/admin/chnage-profile', payload, config.headers())
            if (res.data.status) {
                Swal.fire({
                    title: 'Updated',
                    text: 'Updated Successfully',
                    icon: 'success',
                    timer: 2000
                })
                fetchData()
                CloseModal()

            }
        } catch (error) {

        }
    }

    return (
        <>
            {/* Navbar ด้านบน */}
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
                <a className="navbar-brand fw-bold text-uppercase" href="/">
                    Administrator
                </a>
            </nav>


            {/* Layout หลัก */}
            <div className="container-fluid border-top">
                <div className="row flex-nowrap">
                    {/* Sidebar */}
                    <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark text-white min-vh-100" style={{ height: '100dvh', width: '300px', position: 'fixed', top: 0, left: 0 }}>
                        <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-4 text-white">
                            <h5 className="pb-3 border-bottom w-100 text-center flex">
                                <div className='mb-4'>Admin: {admin.name}</div>
                                <button onClick={() => handleSignOut()} className='btn btn-outline-warning mx-2'>SignOut</button>
                                <button onClick={() => { setUsername(admin.username) }} data-bs-target="#myinfo"
                                    data-bs-toggle="modal" className='btn btn-outline-info'>Edit Info</button>

                            </h5>
                            <ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start w-100">
                                <li className="nav-item w-100">
                                    <Link
                                        to="/home"
                                        className="nav-link text-white px-3 py-2 rounded hover-bg"
                                    >
                                        <i className="bi bi-people-fill me-2"></i> Dashboard
                                    </Link>
                                </li>
                                <li className="nav-item w-100">
                                    <Link
                                        to="/report-member"
                                        className="nav-link text-white px-3 py-2 rounded hover-bg"
                                    >
                                        <i className="bi bi-people-fill me-2"></i>สมาชิก
                                    </Link>
                                </li>
                                <li className="nav-item w-100">
                                    <Link
                                        to="/report-chanage-package"
                                        className="nav-link text-white px-3 py-2 rounded hover-bg"
                                    >
                                        <i className="bi bi-people-fill me-2"></i>จัดการแพ็กเก็จ
                                    </Link>
                                </li>
                                <li className="nav-item w-100 mb-2">
                                    <Link
                                        to="/user-admin"
                                        className="nav-link text-white px-3 py-2 rounded hover-bg"
                                    >
                                        <i className="bi bi-person-fill me-2"></i> ผู้ใช้งาน
                                    </Link>
                                </li>

                                <li className="nav-item w-100">
                                    <Link
                                        to="/report-sum-sale-per-day"
                                        className="nav-link text-white px-3 py-2 rounded hover-bg"
                                    >
                                        <i className="bi bi-people-fill me-2"></i> รายงาน
                                    </Link>
                                </li>
                                <li className="nav-item w-100">
                                    <Link
                                        to="/report-sum-sale-per-month"
                                        className="nav-link text-white px-3 py-2 rounded hover-bg"
                                    >
                                        <i className="bi bi-people-fill me-2"></i> รายงานรายเดือน
                                    </Link>
                                </li>
                                <li className="nav-item w-100">
                                    <Link
                                        to="/report-sum-sale-per-year"
                                        className="nav-link text-white px-3 py-2 rounded hover-bg"
                                    >
                                        <i className="bi bi-people-fill me-2"></i> รายงานรายปี
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* ส่วนเนื้อหาหลัก */}
                    <div className="col py-4 bg-light min-vh-100" style={{ widows: '100%', overflowY: 'auto', marginLeft: '300px' }}>
                        {props.children}
                    </div>
                </div>
            </div>
            <Modal id="myinfo" title="แก้ไขข้อมูล" size>
                <form onSubmit={handleChanageProfile}>
                    <div>
                        <label>Username</label>
                        <input onChange={(e) => setUsername(e.target.value)} value={username} className='form-control' type='text' required></input>
                    </div>
                    <div className='mt-3'>
                        <label>Password</label>
                        <input onChange={(e) => setPassword(e.target.value)} className='form-control' type='password'></input>
                    </div>
                    <button className='btn btn-primary mt-3'>บันทึก</button>
                </form>
            </Modal>
        </>
    )
}

export default Template
