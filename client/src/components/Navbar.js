// libraries
import { Component } from 'react';

// UI components
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

// actions
import {
    login,
    logout
} from '../actions/users';

// helpers
import getAuthToken from '../helpers/getAuthToken';

class Navbar extends Component {

    state = {
        currentUserEmail: "",
        currentUserPassword: "",
        loginModalIsOpen: false
    }

    componentDidMount() {
        const authToken = getAuthToken();
        this.setState({ authToken });
    }

    /**
    * Sets an input's value
    * @param {object} e onChange event value
    */
    setValue(e) {
        // update UI
        this.setState({ [e.target.name]: e.target.value });
    }

    /**
    * Authenticates a user
    */
    async login() {
        // authenticate user
        const authSuccess = await login({
            email: this.state.currentUserEmail,
            password: this.state.currentUserPassword
        })

        // if authentication successful {...}
        if (authSuccess) {

            // redirect user to dashboard
            window.location.href = "/dashboard";
        }

    }

    render() {
        const {
            authToken,
            currentUserEmail,
            currentUserPassword,
            loginModalIsOpen
        } = this.state;

        return (
            <div>
                {/* login modal */}
                <Dialog open={loginModalIsOpen} onClose={() => this.setState({ loginModalIsOpen: false })}>
                    <DialogTitle>Sign In</DialogTitle>
                    <DialogContent>
                        <FormControl style={{ width: "100%" }} variant="standard">
                            <InputLabel htmlFor="currentUserEmail">Email Address</InputLabel>
                            <Input
                                fullWidth
                                id="currentUserEmail"
                                type="text"
                                name="currentUserEmail"
                                value={currentUserEmail}
                                onChange={(e) => this.setValue(e)}
                            />
                        </FormControl>
                        <FormControl style={{ width: "100%" }} variant="standard">
                            <InputLabel htmlFor="currentUserPassword">Password</InputLabel>
                            <Input
                                fullWidth
                                id="currentUserPassword"
                                type="password"
                                name="currentUserPassword"
                                value={currentUserPassword}
                                onChange={(e) => this.setValue(e)}
                            />
                        </FormControl>
                        <div style={{ marginTop: "25px" }}>
                            <Button
                                fullWidth
                                disabled={!currentUserEmail || !currentUserPassword}
                                variant="contained"
                                onClick={() => this.login()}>
                                Sign In
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* navbar */}
                <Box sx={{ flexGrow: 1 }}>
                    <AppBar position="sticky" color="inherit">
                        <Toolbar>
                            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                                Isaac's Layout Builder
                            </Typography>
                            {(authToken) && (
                                <Button color="inherit" onClick={() => logout()}>Log Out</Button>
                            )}
                            {(!authToken) && (
                                <Button color="inherit" onClick={() => this.setState({ loginModalIsOpen: true })}>Login</Button>
                            )}
                        </Toolbar>
                    </AppBar>
                </Box>
            </div>

        )
    }
}

export default Navbar;