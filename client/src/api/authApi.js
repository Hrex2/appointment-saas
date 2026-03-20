const token = localStorage.getItem("token")

axios.get(url, {
    headers: {
        Authorization: token
    }
})