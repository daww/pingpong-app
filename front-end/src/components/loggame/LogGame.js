import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';


import Dialog, {
    DialogActions,
    DialogContent,
    DialogTitle,
} from 'material-ui/Dialog';
import Select from 'material-ui/Select';
import { MenuItem } from 'material-ui/Menu';
import { FormControl } from 'material-ui/Form';
import { InputLabel } from 'material-ui/Input';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';

const styles = theme => ({
    formControl: {
        margin: theme.spacing.unit,
        minWidth: 120,
    }
});

class LogGame extends Component {
    handleClose = () => {
        this.props.onClose();
    }

    handleChange = (event, index, value) => {
        this.props.onChange(event, index, value);
    }

    handleSubmit = () => {
        this.props.onSubmit();
    }

    render() {
        const props = {...this.props}
        const {classes} = this.props
        return (
            <Dialog
                open={props.open}
                onClose={this.handleClose}
                >
                <DialogTitle id="form-dialog-title">Log new game</DialogTitle>
                <DialogContent>
                    <div>
                        <FormControl className={classes.formControl}>
                            <InputLabel htmlFor="playerOne">Player 1</InputLabel>
                            <Select
                                name="playerOne"
                                value={props.playerOne}
                                onChange={this.handleChange}
                                >
                                <MenuItem value=""> </MenuItem>
                                {props.playersByName ?
                                    props.playersByName.map((player) => {
                                        if (!props.playerTwo || player.name !== props.playersByName.find(function(item){
                                            return item.key === props.playerTwo
                                        }).name) {
                                            return <MenuItem key={player.key} value={player.key}>{player.name}</MenuItem>
                                        } else {
                                            return null;
                                        }
                                    }
                                ) : null
                            }
                        </Select>
                    </FormControl>
                    <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="playerTwo">Player 2</InputLabel>
                        <Select
                            name="playerTwo"
                            value={props.playerTwo}
                            onChange={this.handleChange}
                            >
                            <MenuItem value=""> </MenuItem>
                            {props.playersByName ?
                                props.playersByName.map((player) => {
                                    if (!props.playerOne || player.name !== props.playersByName.find(function(item){
                                        return item.key === props.playerOne
                                    }).name) {
                                        return <MenuItem key={player.key} value={player.key}>{player.name}</MenuItem>
                                    } else {
                                        return null;
                                    }
                                }
                            ) : null
                        }
                    </Select>
                </FormControl>
            </div>
            <div>
                <FormControl className={classes.formControl}>
                    <TextField
                        id="number1"
                        label="Player 1 sets"
                        name="playerOneSets"
                        value={props.age}
                        onChange={this.handleChange}
                        type="number"
                        className={props.textField}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        required={true}
                        margin="normal"
                        />
                </FormControl>
                <FormControl className={classes.formControl}>
                    <TextField
                        id="number2"
                        name="playerTwoSets"
                        label="Player 2 sets"
                        value={props.age}
                        onChange={this.handleChange}
                        type="number"
                        className={props.textField}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        required={true}
                        margin="normal"
                        />
                </FormControl>
            </div>

        </DialogContent>
        <DialogActions>
            <Button onClick={this.handleClose} color="primary">
                Cancel
            </Button>
            <Button onClick={this.handleSubmit} color="primary">
                Submit
            </Button>
        </DialogActions>
    </Dialog>
);
}
}

export default withStyles(styles)(LogGame);
