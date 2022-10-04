// libraries
import { Component } from 'react';

// UI components
import Alert from '../components/Alert';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';

// actions
import {
    createUser
} from '../actions/users';

// images
import bgImage from '../images/graphic-design.jpeg';

class HeroImage extends Component {

    state = {
        currentUserEmail: "",
        currentUserPassword: "",
        confirmPassword: "",
        loginModalIsOpen: false
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
    * Creates a new user
    */
    async signup() {
        // if password field does not match confirm field {...}
        if (this.state.newUserPassword !== this.state.confirmPassword) {

            // render warning
            return this.openAlert("warning", "Password field must match confirm password field")
        } else {

            // create new user
            await createUser({
                user: {
                    email: this.state.newUserEmail,
                },
                password: this.state.newUserPassword
            })

            // redirect user to dashboard
            window.location.href = "/dashboard";
        }
    }

    /**
    * Opens up a new alert
    * @param {string} status status of the alert ["success", "error", "warning"]
    * @param {string} message alert message
    */
    openAlert(status = "success", message = "success") {

        // render alert
        this.setState({
            alertIsOpen: true,
            alert: {
                status,
                message
            }
        })
    }

    render() {
        const {
            alert,
            alertIsOpen,
            confirmPassword,
            newUserEmail,
            newUserPassword
        } = this.state;

        return (
            <div>

                {/* alert (dynamically visible) */}
                <Alert 
                    alertIsOpen={alertIsOpen}
                    alert={alert}
                    onClose={() => this.setState({
                        alertIsOpen: false
                    })}
                />
                
                {/* hero image */}
                <div style={{
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    height: "100vh",
                    backgroundImage: `url(${bgImage})`
                }}>
                    <Grid container spacing={2} style={{ paddingTop: "100px" }}>
                        <Grid item xs={2}></Grid>
                        <Grid item xs={4}>
                            <Typography
                                style={{ color: "#ffffff", fontWeight: "bold" }}
                                variant="h1"
                                component="div"
                                sx={{ flexGrow: 1 }}>
                                Build<br /> Better<br /> Layouts.
                            </Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <div>
                                <Card style={{ padding: "15px" }}>
                                    <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>New Account</Typography>
                                    <FormControl style={{ width: "100%" }} variant="standard">
                                        <InputLabel htmlFor="newUserEmail">Email Address</InputLabel>
                                        <Input
                                            fullWidth
                                            id="newUserEmail"
                                            type="text"
                                            name="newUserEmail"
                                            value={newUserEmail}
                                            onChange={(e) => this.setValue(e)}
                                        />
                                    </FormControl>
                                    <FormControl style={{ width: "100%" }} variant="standard">
                                        <InputLabel htmlFor="newUserPassword">Password</InputLabel>
                                        <Input
                                            fullWidth
                                            id="newUserPassword"
                                            type="password"
                                            name="newUserPassword"
                                            value={newUserPassword}
                                            onChange={(e) => this.setValue(e)}
                                        />
                                    </FormControl>
                                    <FormControl style={{ width: "100%" }} variant="standard">
                                        <InputLabel htmlFor="confirmPassword">Confirm Password</InputLabel>
                                        <Input
                                            fullWidth
                                            id="confirmPassword"
                                            type="password"
                                            name="confirmPassword"
                                            value={confirmPassword}
                                            onChange={(e) => this.setValue(e)}
                                        />
                                    </FormControl>
                                    <div style={{ marginTop: "25px" }}>
                                        <Button
                                            fullWidth
                                            disabled={!newUserEmail || !newUserPassword || !confirmPassword}
                                            variant="contained"
                                            onClick={() => this.signup()}>
                                            Sign Up
                                        </Button>
                                    </div>
                                </Card>
                            </div>
                        </Grid>
                        <Grid item xs={2}></Grid>
                    </Grid>
                </div>
            </div >
        )
    }
}

export default HeroImage;