const config = {
    path: 'https://pos-service.deekrub.com',
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
