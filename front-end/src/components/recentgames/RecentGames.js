import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';

import List, {ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Chip from 'material-ui/Chip';
import Icon from 'material-ui/Icon';
import Avatar from 'material-ui/Avatar';


const styles = theme => ({
    root: {
        // marginTop: '.5em'
    },
    listItem: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    span: {
        display: 'flex',
        alignItems: 'center',
        minWidth: "33%"
    },
    date: {
        [theme.breakpoints.down('xs')]: {
            display: 'none',
        }
    },
    chip: {
        marginLeft: theme.spacing.unit
    }
});

class RecentGames extends Component {
    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <List>
                    <ListItem>Recent games</ListItem>
                    <Divider />
                    {this.props.games.map((item) =>
                        <ListItem className={classes.listItem} key={item.date}>
                            <span className={classes.span + ' ' + classes.date}>
                                {(new Date(item.date).toDateString())}
                            </span>
                            <span className={classes.span}>{item.winner.name}
                                <Chip
                                className={classes.chip}
                                avatar={
                                    <Avatar>
                                        <Icon>arrow_upward</Icon>
                                    </Avatar>
                                }
                                label={parseInt(item.winner.rating, 10) - 1600} />
                            </span>

                            <span className={classes.span}>{item.loser.name}
                                <Chip
                                className={classes.chip}
                                avatar={
                                    <Avatar>
                                        <Icon>arrow_downward</Icon>
                                    </Avatar>
                                }
                                label={(item.loser.rating)} />
                            </span>
                        </ListItem>
                    )}
                </List>
            </div>
        );
    }
}

export default withStyles(styles)(RecentGames);
