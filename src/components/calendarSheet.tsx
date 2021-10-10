import React, { useState, useEffect } from 'react';
import { makeStyles } from "@mui/styles";
import Grid from "@mui/material/Grid";
import { IconButton } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import {displayEvents } from '../indexedDB/indexedDb'

const useStyles = makeStyles(() => ({
    root: {
        background: 'white',
        height: '700px',
        width: '100%',
        paddingTop: '142px'

    },
    grid: {
        borderBottom: "1px solid #cfcfcf",
        borderLeft: '1px solid #cfcfcf',
        flex: '1 1 0',
        minHeight: '60px',
        height: '60px'
    },
    header: {
        flex: '1 1 0',
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
        padding: '1em 0',
        position: 'fixed',
        background: 'white',
        zIndex: 2000
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
            marginLeft: '-52%',
            marginTop: '-7px',
            width: '12px',
            zIndex: '505'
        }
    },
    eventCard:{
        borderRadius: "4px",
        marginTop: "1px",
        outline: 'none',
        zIndex: 5,
        backgroundColor: 'rgb(33, 255, 6)',
        borderColor: 'rgb(22, 204, 0)',
        position: 'relative',
        overflow:'hidden'
    },
    eventTitle:{
        maxHeight: '15px',
        display: 'flex',
        wordBreak: 'break-word',
        fontSize: '12px',
        paddingLeft: '5px',
        fontWeight: 500,
        textAlign: 'left',
        overflow: 'hidden'
    },
    eventTime:{
        maxHeight: '15px',
        display: 'flex',
        wordBreak: 'break-word',
        fontSize: '12px',
        paddingTop: '3px',
        paddingLeft: '5px'
    },
    dateHeader:{
        width: '100%',
        position: 'fixed',
        top: '57px',
        background: 'white',
        zIndex: 2000
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
    // const [timeZone,setTimeZone] = useState(() => {
    //     let zone = todayDate.toString()!.match(/GMT\+[0-9]+/)![0]
    //     return zone 
    // })
    let timeZone = todayDate.toString()!.match(/GMT\+[0-9]+/)![0]
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
    
    const [events,setEvents] = useState<any>([])
    const [db,setDb] = useState<any>(null)
    
    function getWeek(date:Date,direction:String){
        let fromDate = new Date(date);
        let week = [0,1,2,3,4,5,6].map(i=>{
            return new Date(date)
        });
        if(direction === "next"){
            for(let i=1;i<=7;i++){
                week[i-1].setDate(fromDate.getDate() + i)
            }
            setThisWeek(week)
            let start= new Date(week[0])
            let end = new Date(week[6])
            start.setHours(0,0,0,0)
            end.setHours(23,59,59)

            displayEvents(db,start.getTime(),end.getTime()).then((request)=>{
            request.onsuccess = function(event:any) {
                console.log(event.target.result)
                // return event.target.result
                setEvents(event.target.result)
            };
            request.onerror = function(err:any) {
                return []
            };
               
            })

        }
        if(direction === "prev"){
            for(let i=1;i<=7;i++){
                week[7-i].setDate(fromDate.getDate() - i)
            }
            setThisWeek(week)
           
            let start= new Date(week[0])
            let end = new Date(week[6])
            start.setHours(0,0,0,0)
            end.setHours(23,59,59)

            displayEvents(db,start.getTime(),end.getTime()).then((request) => {
                request.onsuccess = function(event:any) {
                    console.log(event.target.result)
                    // return event.target.result
                    setEvents(event.target.result)
                };
                request.onerror = function(err:any) {
                    return []
                };
            })
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
    function calculateCardHeight(duration:number):number{
        let multiplier = Math.floor(duration/15);

        return (multiplier*15)

    }
    function calculateCardTop(dateTime:number):string{
        let date = new Date(dateTime)
        let minutes = date.getMinutes()
        let multiplier = Math.floor(minutes/15);
        return `${(multiplier*15)}px`
    }
    function calculateCardWidth(dateTime:number):string{
        return '100%'
    }
    function calculateTimeString(dateTime:number,duration:number):string{
        let date = new Date(dateTime);
        let startHour = date.getHours() === 0?12:(date.getHours()%12);
        let startMinutes = date.getMinutes()
        let quotient = Math.floor((startMinutes+duration)/60);
        let remainder = (startMinutes+duration) % 60;

        return `${startMinutes >0 ? (startHour+':'+startMinutes):startHour} ${(date.getHours()<12 && (date.getHours()+quotient)>=12)?'am':''} - ${remainder>0?(((startHour+quotient)%12 === 0 ?12:(startHour+quotient)%12)+':'+remainder):(startHour+quotient)%12 === 0 ?12:(startHour+quotient)%12} ${(date.getHours()+quotient)<12?'am':'pm'}`
    }
    useEffect(() => {
        let DBOpenRequest = window.indexedDB.open("calEvents",2);
        DBOpenRequest.onerror = function(event) {
            console.log("Error opening the db")
        };
            
        DBOpenRequest.onsuccess = async function(event) {
            setDb(DBOpenRequest.result);
            let start = new Date(thisWeek[0])
            let end = new Date(thisWeek[6])
            start.setHours(0,0,0,0)
            end.setHours(23,59,59)
            displayEvents(DBOpenRequest.result,start.getTime(),end.getTime()).then((request)=>{
                request.onsuccess = function(event:any) {
                    console.log(event.target.result)
                    // return event.target.result
                    setEvents(event.target.result)
                };
                request.onerror = function(err:any) {
                    return []
                };
            })
            
        }
        const interval = setInterval(calculateTimeSliderPosition,10000)
        return ()=> clearInterval(interval)
    },[thisWeek])
    return (
        <React.Fragment>
            <div className={classes.weekNavigator}>
            <div className={classes.time}></div>
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
            <Grid container  className={classes.dateHeader}>
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
                    <Grid key={index}  item className={classes.grid} >
                        {value.getDate() === todayDate.getDate() && hourValue === currentHour && <div className={classes.timeSlider} style={{ top: (currentMin)+'px'}}></div>}
                        {events.length>0 && events.map((e:any)=>{
                            let ev:any = new Date(e.dateTime)
                            let evMins = ev.getMinutes()
                            return (value.getDate() === ev.getDate() && ev.getHours() === hourValue && <div className={classes.eventCard} style={{ height: calculateCardHeight(e.duration)+'px', top: calculateCardTop(e.dateTime), width: calculateCardWidth(e.dateTime)}}>
                                <div className={classes.eventTitle} style={{paddingTop: calculateCardHeight(e.duration) <= 30?'0px':'3px'}}>{calculateCardHeight(e.duration) <= 30?e.title+', '+(ev.getHours()===0?12:ev.getHours()%12)+(evMins>0?evMins<10?':0'+evMins:':'+evMins:'')+(ev.getHours()<12?'am':'pm'):e.title}</div>
                                { calculateCardHeight(e.duration) > 30 &&<div className={classes.eventTime}>{calculateTimeString(e.dateTime,e.duration)}</div>}
                            </div>)
                        })}
                    </Grid>
                ))}
                </Grid>
            ))}
            </Grid>
        </React.Fragment>
    )
}

export default React.memo(CalendarSheet)