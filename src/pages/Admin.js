import React, { useEffect, useState } from 'react'
import Template from '../components/Template'
import axios from 'axios'
import config from '../config'
import ResponseError from '../utils/ResponseError'
import Modal from '../components/Modal'
import Swal from 'sweetalert2'
import CloseModal from '../utils/CloseModal'

const Admin = () => {

    const [role, setRole] = useState(() => {
        return ['Admin', "Manager", "Staff"]
    })
    const [selectedRole, setSelectedRole] = useState('Admin')
    const [name, setName] = useState('')
    const [user, setUser] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [email, setEmail] = useState('')
    const [admins, setAdmins] = useState([])
    const [adminId, setAdminId] = useState(0)


    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const res = await axios.get(config.path + '/admin/list', config.headers())
            if (res.data.status) {
                setAdmins(res.data.data)
            }
        } catch (error) {
            ResponseError(error.message)
        }
    }

    const handleSelectedAdmin = (item) => {
        setName(item.name);
        setUser(item.username)
        setEmail(item.email)
        setSelectedRole(item.role)
        setAdminId(item.id)

        console.log(adminId)
    }

    const handleDelete = (item) => {
        Swal.fire({
            title: 'Delete',
            text: 'Are you sure to delete?',
            icon: 'question',
            confirmButtonColor: 'red',
            showCancelButton: true,
            showConfirmButton: true,
        }).then(async (e) => {
            try {
                if (e.isConfirmed) {
                    const res = await axios.delete(config.path + '/admin/delete/' + item.id, config.headers())
                    if (res.data.status) {
                        Swal.fire({
                            title: 'Deleted',
                            text: 'Deleted Success',
                            icon: 'success',
                            timer: 2000
                        })

                        fetchData()
                    }
                }
            } catch (error) {
                ResponseError(error.message)
            }
        })
    }

    const handleSave = async (e) => {

        e.preventDefault()

        if (adminId === 0) { // create: require matching passwords
            if (password.trim() !== confirmPassword.trim()) {
                ResponseError('รหัสผ่านไม่ตรงกัน')
                return;
            }
        } else {
            // update: only validate if a new password is provided
            if (password.trim() !== '' && (password.trim() !== confirmPassword.trim())) {
                ResponseError('รหัสผ่านไม่ตรงกัน')
                return;
            }
        }



        try {
            const payload = {
                name,
                username: user,
                password,
                role: selectedRole,
                email,
            }
            let url = '/admin/create';

            if (adminId > 0) {
                url = '/admin/update/' + adminId;
            }

            const res = await axios.post(config.path + url, payload, config.headers())
            if (res.data.status) {
                Swal.fire({
                    title: 'Success',
                    text: 'Success',
                    icon: 'success',
                    timer: 2000
                })

                CloseModal()
                fetchData()

                setName('')
                setUser('')
                setPassword('')
                setConfirmPassword('')
                setEmail('')
                setSelectedRole('Admin')
                setAdminId(0)
            }
        } catch (error) {
            ResponseError(error.message)
        }
    }
    // สิ้นสุดโค้ดส่วน state และ function

    return (
        <>
            <Template>
                <div
                    className='card'
                    style={{
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        border: 'none' // ลบ border เดิมของ card
                    }}
                >
                    <div
                        className='card-header'
                        style={{
                            backgroundColor: '#007bff', // สีฟ้าสมัยใหม่
                            color: 'white',
                            padding: '1.25rem 1.5rem',
                            borderBottom: 'none' // ลบเส้นแบ่ง
                        }}
                    >
                        <div className='card-title' style={{ fontSize: '1.5rem', fontWeight: '600' }}>
                            🧑‍💻 การจัดการผู้ใช้งาน (Admin Management)
                        </div>
                    </div>
                    <div className='card-body' style={{ padding: '1.5rem' }}>
                        <button
                            data-bs-target="#adduser"
                            data-bs-toggle="modal"
                            className='btn btn-primary'
                            style={{
                                backgroundColor: '#28a745', // สีเขียวสำหรับปุ่ม Add
                                borderColor: '#28a745',
                                fontWeight: '600',
                                borderRadius: '8px',
                                padding: '0.5rem 1.5rem',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            ➕ เพิ่มผู้ใช้ใหม่
                        </button>

                        <div style={{ overflowX: 'auto', marginTop: '1.5rem' }}>
                            <table
                                className='table table-striped'
                                style={{
                                    minWidth: '700px', // ให้ตารางไม่หดเล็กเกินไป
                                    borderCollapse: 'separate',
                                    borderSpacing: '0 8px', // เพิ่มช่องว่างระหว่างแถว
                                }}
                            >
                                <thead style={{ backgroundColor: '#f8f9fa' }}>
                                    <tr>
                                        <th style={{ padding: '12px 15px', borderBottom: '2px solid #dee2e6' }}>ชื่อ</th>
                                        <th style={{ padding: '12px 15px', borderBottom: '2px solid #dee2e6' }}>Username</th>
                                        <th style={{ padding: '12px 15px', borderBottom: '2px solid #dee2e6' }}>Role</th>
                                        <th style={{ padding: '12px 15px', borderBottom: '2px solid #dee2e6' }}>Email</th>
                                        <th style={{ padding: '12px 15px', borderBottom: '2px solid #dee2e6', width: '150px' }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        admins.length > 0 ? admins.map((item, key) => (
                                            <tr key={key} style={{ transition: 'background-color 0.3s' }}>
                                                <td style={{ padding: '12px 15px', verticalAlign: 'middle' }}>{item.name}</td>
                                                <td style={{ padding: '12px 15px', verticalAlign: 'middle' }}>{item.username}</td>
                                                <td style={{ padding: '12px 15px', verticalAlign: 'middle' }}>
                                                    <span
                                                        style={{
                                                            display: 'inline-block',
                                                            padding: '4px 8px',
                                                            borderRadius: '50px',
                                                            fontSize: '0.85rem',
                                                            fontWeight: '600',
                                                            backgroundColor: item.role === 'Admin' ? '#ffc107' : item.role === 'Manager' ? '#17a2b8' : '#6c757d',
                                                            color: item.role === 'Admin' ? '#343a40' : 'white',
                                                        }}
                                                    >
                                                        {item.role}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '12px 15px', verticalAlign: 'middle' }}>{item.email}</td>
                                                <td style={{ padding: '12px 15px', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                                                    <button
                                                        onClick={() => handleSelectedAdmin(item)}
                                                        data-bs-target="#adduser"
                                                        data-bs-toggle="modal"
                                                        className='btn btn-warning'
                                                        style={{
                                                            padding: '6px 12px',
                                                            borderRadius: '6px',
                                                            fontWeight: '500',
                                                            fontSize: '0.85rem',
                                                            backgroundColor: '#ffc107',
                                                            borderColor: '#ffc107',
                                                            color: '#212529',
                                                        }}
                                                    >
                                                        ✏️ Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(item)}
                                                        className='btn btn-danger mx-2'
                                                        style={{
                                                            padding: '6px 12px',
                                                            borderRadius: '6px',
                                                            fontWeight: '500',
                                                            fontSize: '0.85rem',
                                                            backgroundColor: '#dc3545',
                                                            borderColor: '#dc3545',
                                                        }}
                                                    >
                                                        🗑️ Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: '#6c757d' }}>
                                                    ไม่พบข้อมูลผู้ใช้งาน
                                                </td>
                                            </tr>
                                        )
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </Template>


            <Modal title="ผู้ใช้งาน" szie id="adduser">
                <form onSubmit={handleSave} style={{ padding: '10px 0' }}>
                    <div className='row'>
                        <div className='col-md-6'>
                            <div className='mt-3'>
                                <label style={{ fontWeight: '500', marginBottom: '0.5rem', display: 'block' }}>ชื่อ</label>
                                <input
                                    onChange={(e) => setName(e.target.value)}
                                    type='text'
                                    className='form-control'
                                    required
                                    style={{ borderRadius: '8px', padding: '10px' }}
                                    value={name}
                                />
                            </div>
                        </div>
                        <div className='col-md-6'>
                            <div className='mt-3'>
                                <label style={{ fontWeight: '500', marginBottom: '0.5rem', display: 'block' }}>Username</label>
                                <input
                                    onChange={(e) => setUser(e.target.value)}
                                    type='text'
                                    className='form-control'
                                    required
                                    style={{ borderRadius: '8px', padding: '10px' }}
                                    value={user}
                                />
                            </div>
                        </div>
                    </div>

                    <div className='row'>
                        <div className='col-md-6'>
                            <div className='mt-3'>
                                <label style={{ fontWeight: '500', marginBottom: '0.5rem', display: 'block' }}>Password</label>
                                <input

                                    onChange={(e) => setPassword(e.target.value)}
                                    type='password'
                                    className='form-control'
                                    required={adminId > 0 ? false : true}
                                    style={{ borderRadius: '8px', padding: '10px' }}
                                    value={password}
                                />
                            </div>
                        </div>
                        <div className='col-md-6'>
                            <div className='mt-3'>
                                <label style={{ fontWeight: '500', marginBottom: '0.5rem', display: 'block' }}>Confirm Password</label>
                                <input
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    type='password'
                                    className='form-control'
                                    required={adminId > 0 ? false : true}
                                    style={{ borderRadius: '8px', padding: '10px' }}
                                    value={confirmPassword}
                                />
                            </div>
                        </div>
                    </div>

                    <div className='mt-3'>
                        <label style={{ fontWeight: '500', marginBottom: '0.5rem', display: 'block' }}>Email</label>
                        <input
                            onChange={(e) => setEmail(e.target.value)}
                            type='email'
                            className='form-control'
                            required
                            style={{ borderRadius: '8px', padding: '10px' }}
                            value={email}
                        />
                    </div>

                    <div className='mt-3'>
                        <label style={{ fontWeight: '500', marginBottom: '0.5rem', display: 'block' }}>Role</label>
                        <select
                            className='form-control'
                            onChange={(e) => setSelectedRole(e.target.value)}
                            value={selectedRole}
                            style={{ borderRadius: '8px', padding: '10px' }}
                        >

                            {
                                role.map((item, index) => (
                                    <option key={index} value={item}>{item}</option>
                                ))
                            }
                        </select>
                    </div>

                    <div className='mt-4' style={{ textAlign: 'right' }}>
                        <button
                            type='submit'
                            className='btn btn-success'
                            style={{
                                backgroundColor: '#007bff',
                                borderColor: '#007bff',
                                fontWeight: '600',
                                borderRadius: '8px',
                                padding: '0.6rem 2rem',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            💾 บันทึก
                        </button>
                    </div>
                </form>

            </Modal>
        </>
    )
}

export default Admin
