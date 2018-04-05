import React, { Component } from 'react';

import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';


class Overview extends Component {
    handlePlayerClick = (event) => {
        this.props.onPlayerClick(event);
    }
    render() {
        const rankings = ['🥇', '🥈', '🥉'];
        return (
            <div>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Ranking</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.props.players.map((player, index) =>
                            <TableRow
                                key={player.key}
                                onClick={() => this.handlePlayerClick(player)}
                                hover={true}
                            >
                                <TableCell>{rankings[index] || index + 1}</TableCell>
                                <TableCell>{player.name}</TableCell>
                                <TableCell>{player.rating}</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        );
    }
}

export default Overview;
