import React from 'react';
import { makeStyles } from "@mui/styles";
import Grid from "@mui/material/Grid";

const useStyles = makeStyles(() => ({
    root: {
        background: 'white',
        height: '700px',
        width: '100%',
        marginLeft: '2px',
        

    },
    grid: {
        borderBottom: "1px solid #cfcfcf",
        borderLeft: '1px solid #cfcfcf',
        flexGrow: 1,
        minHeight: '50px',
        height: '50px',
        gridRowGap: 1,
    },
    header: {
        flexGrow: 1,
        height: '84px',
        display: 'grid',
        alignItems: 'self-end'
    },
    dayName: {
        color: '#70757a',
        fontSize: '11px',
        fontWeight: 500,
        letterSpacing: '0.8',
        width: '100%',
        marginTop: '8px',
    },
    date: {
        color: '#3c4043',
        fontSize: '26px',
        width: '100%',
    },
    headerDivider: {
        borderBottom: "1px solid #cfcfcf",
        borderLeft: '1px solid #cfcfcf',
        height: '10px',
        position: 'relative',
        bottom: 0
    }
}))

export default function CalendarSheet(){
    const classes = useStyles();

    return (
        <React.Fragment>
             <Grid container  style={{width: '100%'}}>
                <Grid container style={{ marginLeft: 2, marginTop: 2}} item  spacing={0}>
                    {['SUN','MON','TUE','WED','THU','FRI','SAT'].map((value) => (
                        <Grid key={value} item className={classes.header}>
                            <div className={classes.dayName}>{value}</div>
                            <div className={classes.date}>2</div>
                            <div className={classes.headerDivider}></div>
                        </Grid>
                    ))}
                </Grid>
            </Grid>
            <Grid container className={classes.root}>
            {[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23].map((value) => (
                <Grid key={value} container item spacing={0}>
                {['SU','M','T','W','TH','F','SA'].map((value) => (
                    <Grid key={value} item className={classes.grid}></Grid>
                ))}
                </Grid>
            ))}
            </Grid>
        </React.Fragment>
    )
}