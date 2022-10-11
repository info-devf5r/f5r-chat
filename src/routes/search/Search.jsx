import { Alert, Snackbar, TextField } from "@mui/material";
import { useState } from "preact/hooks";
import NavBar from "../../components/navbar/NavBar";
import { api } from "../../Utils/Common";
import SearchUser from "./components/SearchUser";
import "./_search.scss"

function Search(props) {

    const [search, setSearch] = useState("");
    const [searchUser, setSearchUser] = useState(null)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)

    const handleChange = (e) => {
        api.get('/users/search?searchUser=' + e.target.value, {
            headers: {
                "authorization": 'Bearer ' + sessionStorage.getItem('token')
            }
        }).then(res => {
            setSearch(res.data)
        })
    }

    return (
        <>
            <NavBar />
            <div className="searchPage">
                <input 
                    className="searchInput"
                    type="search"
                    placeholder="Search"
                    onChange={handleChange}
                />

                {search.length ? search.map((value, key) => {
                    return <SearchUser user={value} props={props} />
                }) : null}


                {error && (
                    <Snackbar variant="filled" open={error} autoHideDuration={6000} onClose={() => setError(null)}>
                        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
                            {error}
                        </Alert>
                    </Snackbar>
                )}
                {success && (
                    <Snackbar variant="filled" open={success} autoHideDuration={6000} onClose={() => setSuccess(null)}>
                        <Alert onClose={() => setSuccess(null)} severity="success" sx={{ width: '100%' }}>
                            {success}
                        </Alert>
                    </Snackbar>
                )}
            </div>
        </>
    );
    
}

export default Search;
