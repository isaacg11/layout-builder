// libraries
import React, { Component } from 'react';

// UI components
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

// alert config
const AlertComponent = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

class Alert extends Component {
    
    render() {

        const { 
            alertIsOpen,
            onClose,
            alert = {
                status: "success",
                message: "Success!"
            }
        } = this.props;

        return (
            <Snackbar open={alertIsOpen || false} autoHideDuration={5000} onClose={() => onClose()}>
                <AlertComponent onClose={() => onClose()} severity={alert.status} sx={{ width: '100%' }}>
                    {alert.message}
                </AlertComponent>
            </Snackbar>
        )
    }
}

export default Alert;