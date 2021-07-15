import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function AlertDialog(props : {open : boolean, handleClose : Function,title : string, body : string, posActionButtonName : string, negActionButtonName? : string, onPosClicked : Function, onNegClicked? : Function}) {
    

    return (
        <>
        <Dialog
            open={props.open}
            onClose={()=>props.handleClose()}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{props.title}</DialogTitle>
            <DialogContent>
            <DialogContentText id="alert-dialog-description">
                {props.body}
            </DialogContentText>
            </DialogContent>
            <DialogActions>
                {props.negActionButtonName ?  (
                <Button onClick={()=>props.onNegClicked()} color="primary">
                {props.negActionButtonName}
            </Button>) : null
            }
            
            <Button onClick={()=>props.onPosClicked()} color="primary" autoFocus>
                {props.posActionButtonName}
            </Button>
            </DialogActions>
        </Dialog>
        </>
    );
    }
