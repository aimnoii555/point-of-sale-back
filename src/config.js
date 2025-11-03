const config = {
    path: 'pos-service.deekrub.com',
    token_name: 'admin_token',
    headers: () => {
        return {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('admin_token')
            }
        }
    }
}


export default config
