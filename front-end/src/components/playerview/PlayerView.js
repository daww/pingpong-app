import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';

import Typography from 'material-ui/Typography';

const styles = theme => ({
    rating: {
        marginBottom: theme.spacing.unit * 2
    }
});

class PlayerView extends Component {
    render() {
        const { classes } = this.props;
        const props = {...this.props}
        return (
            <div>
                <Typography className={classes.rating} variant="caption" gutterBottom>
                    Rating:  {props.player.rating}
                </Typography>
                <Typography variant="display2" gutterBottom>
                    {props.player.name}
                </Typography>

                <Typography variant="body2" gutterBottom>
                    Peak rating: {props.player.peakRating}
                </Typography>
                Sets won: {props.player.wins} <br />
                Sets lost: {props.player.losses}


        </div>
    );
}
}

export default withStyles(styles)(PlayerView);
