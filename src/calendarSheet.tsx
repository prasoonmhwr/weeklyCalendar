import React, { useState } from 'react';
import { makeStyles } from "@mui/styles";
import Grid from "@mui/material/Grid";
import { IconButton } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';

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
        width: '46px',
        height: '46px',
        marginLeft: 'auto',
        marginRight: 'auto',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '100%'
    },
    headerDivider: {
        borderBottom: "1px solid #cfcfcf",
        borderLeft: '1px solid #cfcfcf',
        height: '10px',
        position: 'relative',
        bottom: 0
    },
    weekNavigator:{
        height: '25px',
        width: '100%',
        display:'flex',
        padding: '1em'
    },
    monthText: {
        color: '#3c4043',
        fontSize: '22px',
        fontWeight: 400,
        whiteSpace: 'nowrap',
        marginLeft: 5
    },
    todayDate: {
        backgroundColor: '#1a73e8',
        fontSize: '25px',
        color: 'white'
    },
    todayDay: {
        color: '#1a73e8'
    },
    prevDates:{
        color: '#70757a'
    }
   
}))

function CalendarSheet(){
    const classes = useStyles();
    const displayDays = ["SUN","MON","TUE","WED","THU","FRI","SAT"]
    const months = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"]
    const [todayDate,setTodayDate] = useState(new Date());
    let dayToday = todayDate.getDay()
    const [thisWeek,setThisWeek] = useState(() => {
        let start = 0;
        let end=6;
        let startWeek = [0,1,2,3,4,5,6].map(i=>{
            return new Date()
        });
        while(start<=dayToday && end > dayToday){
            startWeek[start].setDate(startWeek[start].getDate() - (dayToday-start))
            startWeek[end].setDate(startWeek[end].getDate() + (end-dayToday))
            start++;
            end--;
        }
        while(start<=dayToday){
            startWeek[start].setDate(startWeek[start].getDate() - (dayToday-start))
            start++;
        }
        while(end > dayToday){
            startWeek[end].setDate(startWeek[end].getDate() + (end-dayToday))
            end--;
        }
        return startWeek
    })
    
    function getWeek(date:Date,direction:String){
        let fromDate = new Date(date);
        console.log(fromDate)
        let week = [0,1,2,3,4,5,6].map(i=>{
            return new Date(date)
        });
        if(direction === "next"){
            for(let i=1;i<=7;i++){
                week[i-1].setDate(fromDate.getDate() + i)
                console.log(week[i-1])
            }
            console.log(week)
            setThisWeek(week)
        }
        if(direction === "prev"){
            for(let i=1;i<=7;i++){
                week[7-i].setDate(fromDate.getDate() - i)
            }
            // console.log(week)
            setThisWeek(week)
        }
        
    }
    function calculateMonthHeader(date1:Date, date2:Date){
        return date1.getMonth() == date2.getMonth()? months[date2.getMonth()]: `${months[date1.getMonth()].substring(0,3)} - ${months[date2.getMonth()].substring(0,3)}`
    }
    return (
        <React.Fragment>
            <div className={classes.weekNavigator}>
                    <IconButton sx={{ color:"#5f6368"}} onClick={() => { getWeek(thisWeek[0],"prev"); }}>
                        <NavigateBeforeIcon />
                    </IconButton>
                    <IconButton sx={{ color:"#5f6368"}} onClick={() => { getWeek(thisWeek[6],"next"); }}>
                        <NavigateNextIcon />
                    </IconButton>
                <div className={classes.monthText}>
                    {calculateMonthHeader(thisWeek[0],thisWeek[6])}, {todayDate.getFullYear()}
                </div>
            </div>
             <Grid container  style={{width: '100%'}}>
                <Grid container style={{ marginLeft: 2, marginTop: 2}} item  spacing={0}>
                    {thisWeek.map((value,index) => (
                        <Grid item className={classes.header}>
                            <div className={`${(value.getDate() === todayDate.getDate() && value.getMonth() === todayDate.getMonth() && value.getFullYear() === todayDate.getFullYear())?classes.todayDay:''} ${classes.dayName}`}>{displayDays[index]}</div>
                            <div className={`${(value.getDate() === todayDate.getDate() && value.getMonth() === todayDate.getMonth() && value.getFullYear() === todayDate.getFullYear())?classes.todayDate:''} ${value.getTime()<todayDate.getTime()?classes.prevDates:''} ${classes.date}`}>{value.getDate()}</div>
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

export default React.memo(CalendarSheet)