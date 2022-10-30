import { AppBar, Box, IconButton, Menu, MenuItem, Toolbar, Tooltip, Typography } from "@mui/material";
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { STATUS_CODE_FORBIDDEN, STATUS_CODE_OK, STATUS_CODE_UNAUTHORIZED } from "../constants";
import { URL_USER_SVC } from "../configs";
import DeleteAccountAlert from "./DeleteAccountAlert";
import Button from '@mui/material/Button';
import Cookies from 'js-cookie';

function NavBar() {
    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)
    const [username, setUsername] = useState(Cookies.get('username'));

    const handleOpenUserSettings = (e) => {
        setAnchorEl(e.currentTarget)
    }

    const handleCloseUserSettings = (e) => {
        setAnchorEl(null)
    }

    let navigate = useNavigate();

    const handleLogout = async () => {
        const res = await axios.post(URL_USER_SVC + '/logout',
            { username },
            { withCredentials: true, credentials: 'include' })
            .catch((err) => {
                console.log(err)
                // Either cookie or token expired
                if (err.response.status === STATUS_CODE_UNAUTHORIZED ||
                    err.response.status === STATUS_CODE_FORBIDDEN) {
                    navigate("/login");
                }
            })

        if (res && res.status === STATUS_CODE_OK) {
            console.log(`${username} logout success`)
            navigate("/logout", { state: { success: true } }) // placeholder until merge with matching
        }
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="sticky">
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}>
                        PeerPrep
                    </Typography>
                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title="Open User Settings">
                            <IconButton onClick={handleOpenUserSettings}>
                                <SettingsIcon />
                            </IconButton>
                        </Tooltip>

                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={open}
                            onClose={handleCloseUserSettings}
                        >
                            <MenuItem onClick={handleCloseUserSettings}>
                                <Button variant="text" style={{ textAlign: "center" }} color="primary">
                                    <Link to="/changePassword" style={{ textDecoration: "none" }}>Change Password</Link>
                                </Button>
                            </MenuItem>
                            <MenuItem onClick={handleCloseUserSettings}>
                                {/* <Typography variant="text" textAlign="center" color="primary">
                                    Delete Account
                                </Typography> */}
                                <DeleteAccountAlert />
                            </MenuItem>

                        </Menu>
                        <Tooltip title="Logout">
                            <IconButton onClick={handleLogout}>
                                <LogoutIcon />
                            </IconButton>
                        </Tooltip>

                    </Box>
                </Toolbar>
            </AppBar>
        </Box>

    )
}

export default NavBar;