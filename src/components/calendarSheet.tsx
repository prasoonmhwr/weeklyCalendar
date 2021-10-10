import React, { useState, useEffect } from 'react';
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
        minHeight: '60px',
        height: '60px'
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
    },
    time: {
        color: '#70757a',
        fontSize: '10px',
        width:'5%',
        position: 'relative',
        top: '-7px'
    },
    timeZone: {
        color: '#70757a',
        fontSize: '10px',
        width:'5%',
        position: 'relative',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        top: '-7px'
    },
    timeSlider: {
        position: 'relative',
        zIndex: 505,
        borderTop: '#ea4335 solid 2px',
        left: 0,
        right: 0,
        pointerEvents: 'none',

        '&::before': {
            background: '#ea4335',
            borderRadius: '50%',
            content: "''",
            position: 'absolute',
            height: '12px',
            marginLeft: '-122.5px',
            marginTop: '-7px',
            width: '12px',
            zIndex: '505'
        }
    }
   
}))

function CalendarSheet(){
    const classes = useStyles();
    const displayDays = ["SUN","MON","TUE","WED","THU","FRI","SAT"]
    const months = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"]
    const [todayDate,setTodayDate] = useState(new Date());
    const [currentHour,setCurrentHour] = useState(()=> {
        let date = new Date()
        return date.getHours()
    });
    const [currentMin,setCurrentMin] = useState(()=> {
        let date = new Date()
        return date.getMinutes() - 1 
    });
    let dayToday = todayDate.getDay()
    const [timeZone,setTimeZone] = useState(() => {
        let zone = todayDate.toString()!.match(/GMT\+[0-9]+/)![0]
        return zone 
    })
    
    // if (typeof timeZone === 'string') {
    //     timeZone = timeZone?.match(/GMT\+[0-9]+/)[0]
    // }
    // console.log()
    // timeZone = timeZone && timeZone.match(/GMT\+[0-9]+/)[0]
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
        return date1.getMonth() === date2.getMonth()? months[date2.getMonth()]: `${months[date1.getMonth()].substring(0,3)} - ${months[date2.getMonth()].substring(0,3)}`
    }
    function calculateTimeSliderPosition(){
        let date = new Date()
        let hour = date.getHours();
        let minute = date.getMinutes();
        setCurrentHour(hour)
        setCurrentMin(minute-1)
    }
    useEffect(() => {
        const interval = setInterval(calculateTimeSliderPosition,10000)
        return ()=> clearInterval(interval)
    },[])
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
            
            <Grid container className={classes.root}>
            <Grid container  style={{width: '100%'}}>
                <Grid container style={{  marginTop: 2}} item  spacing={0}>
                <div className={classes.timeZone}>{timeZone}</div>
                    {thisWeek.map((value,index) => (
                        <Grid item className={classes.header}>
                            <div className={`${(value.getDate() === todayDate.getDate() && value.getMonth() === todayDate.getMonth() && value.getFullYear() === todayDate.getFullYear())?classes.todayDay:''} ${classes.dayName}`}>{displayDays[index]}</div>
                            <div className={`${(value.getDate() === todayDate.getDate() && value.getMonth() === todayDate.getMonth() && value.getFullYear() === todayDate.getFullYear())?classes.todayDate:''} ${value.getTime()<todayDate.getTime()?classes.prevDates:''} ${classes.date}`}>{value.getDate()}</div>
                            <div className={classes.headerDivider}></div>
                        </Grid>
                    ))}
                </Grid>
            </Grid>
            
            {[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23].map((hourValue) => (
                <Grid key={hourValue} container item  spacing={0}>
                {hourValue === 0 ?<div className={classes.time}></div> :<div className={classes.time}>{hourValue > 11?`${hourValue === 12?hourValue:hourValue%12} PM`:`${hourValue} AM`}</div>}
                {thisWeek.map((value,index) => (
                    <Grid key={index}  item  spacing={0} className={classes.grid}>
                        {value.getDate() === todayDate.getDate() && hourValue === currentHour && <div className={classes.timeSlider} style={{ top: (currentMin)+'px'}}></div>}
                    </Grid>
                ))}
                </Grid>
            ))}
            </Grid>
        </React.Fragment>
    )
}

export default React.memo(CalendarSheet)