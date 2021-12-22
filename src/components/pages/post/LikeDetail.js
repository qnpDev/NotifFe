import React from 'react';
import { CloseButton, Modal } from 'react-bootstrap';
import DataTable from 'react-data-table-component';

function LikeDetail({ close, data }) {

    return (
        <>
            <Modal 
                show={true}
                size='lg' 
                centered
                onHide={close}
            >
                <Modal.Header className='d-flex justify-content-center bg'>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Liked List
                    </Modal.Title>
                    <CloseButton onClick={close} variant={localStorage.getItem('darkTheme') === 'true' ? 'white' : null}/>
                </Modal.Header>
                <Modal.Body className='bg'>
                    <DataTable
                        columns={[
                            {
                                name: 'Avatar',
                                selector: row => (
                                    <div className='d-flex justify-content-center'>
                                        <div className='header_img'> 
                                            <img src={row.avatar || 'https://ephoto360.com/share_image/2021/11/61869a163d0ee.jpg'} alt='avatar'/> 
                                        </div>
                                    </div>
                                ),
                            },
                            {
                                name: 'Name',
                                selector: row => row.name,
                                sortable: true,
                            },
                            
                        ]}
                        data={data}
                        pagination={data.length > 10}
                        fixedHeader
                        theme={localStorage.getItem('darkTheme') === 'true' ? 'dark' : 'default'}
                        // onRowClicked={row => (navigate('/notification/' + row._id))}
                        highlightOnHover
                        pointerOnHover
                    />
                    
                </Modal.Body>
                <Modal.Footer className='bg'>
                    <button
                        className='btn btn-secondary w-100'
                        onClick={close}
                    >Close</button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default LikeDetail;