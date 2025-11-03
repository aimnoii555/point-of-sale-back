
const Modal = ({ children, title, id, size }) => {
    let customSize = '';
    if (size) {
        customSize = 'modal-lg'
    }

    return (
        <div>

            {/* เอา div ที่ id ชนออก และใช้ className ให้ถูกต้อง */}
            <button type="button" className="btn btn-primary m-3" data-bs-toggle="modal" data-bs-target={`#${id}`}>

            </button>

            {/* โมดัล */}
            <div className="modal fade" id={`${id}`} data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className={`modal-dialog ${customSize}`}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="staticBackdropLabel">{title}</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            {children}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            {/* <button type="button" className="btn btn-primary">OK</button> */}
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Modal
