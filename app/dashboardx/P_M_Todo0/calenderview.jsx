import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar'
import moment from 'moment'
import { CalanderView } from '@/constants/ROUTES';
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { useSelector } from 'react-redux';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Badge from '@mui/material/Badge';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { getCalenderview_1 } from '@/store/reducers/calenderReducer';
import { useDispatch } from 'react-redux';
import { BASE_URL } from '@/constants/ENVIRONMENT_VARIABLES';

export const Calenderview = () => {
    // const history = useHistory();
    const dispatch = useDispatch();
    const ListofMonths = [
        'January', 'February', 'March', 'April',
        'May', 'June', 'July', 'August',
        'September', 'October', 'November', 'December'
    ];
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: currentYear - 1990 + 1 }, (_, index) => 1990 + index);
    const [view, setView] = useState(Views.MONTH);
    const [date, setDate] = useState(new Date())
    const [selectedMonth, setSelectedMonth] = useState(moment().format('MMMM'));
    // const router = useRouter()
    const localizer = momentLocalizer(moment)
    // const pathname = usePathname();
    const calenderOneData = useSelector((state) => state?.calender_1_Slice?.data);
    console.log('cale', calenderOneData)
    const events = calenderOneData?.length > 0 && calenderOneData?.map(event => ({
        id: event?.id,
        title: event?.summary,
        desc: event?.desc,
        start: new Date(event?.start),
        end: new Date(event?.end),
        attendees: event?.attendees,
        status: event?.status,
        comment: event?.comment,
        link: event?.link
    }));
    const navigateToToday = () => {
        setDate(new Date());
        setView('day');
        dispatch(getCalenderview_1({ from_date: moment().format('YYYY-MM-DD'), to_date: moment().format('YYYY-MM-DD') }))
    };
    const CustomToolbar = ({ date, view, onNavigate, onView }) => {
        const dateRange = () => {
            if (view === 'month') {
                return moment(date).format('MMMM YYYY');
            } else if (view === 'week') {
                const start = moment(date).startOf('week');
                const end = moment(date).endOf('week');
                return `${start.format('MMM D')} - ${end.format('MMM D, YYYY')}`;
            } else if (view === 'day') {
                return moment(date).format('dddd, MMM D, YYYY');
            } else if (view === 'year') {
                return moment(date).format('YYYY');
            }
            return '';
        };
        const activeBtn = (buttonView) => {
            return view === buttonView ? 'btn-selected' : ''
        }
        return (
            <div className="mt-3 mb-3 flex flex-wrap float-left items-center text-sm">
                <Grid container rowSpacing={1}>
                    <Grid item xs={2}>
                        <span>
                            <button className="text-[#373a3c] inline-block mx-1 border-1 border-s-2 border-[#1976d2] p-1" onClick={() => onNavigate('PREV')}>
                                <NavigateBeforeIcon />
                            </button>
                            <button className="text-[#373a3c] inline-block m-0 border-1 border-s-2 border-[#1976d2] p-1" onClick={() => onNavigate('NEXT')}>
                                <NavigateNextIcon />
                            </button>
                        </span>
                    </Grid>
                    <Grid item xs={6}>
                        <span className='flex justify-center font-bold text-xl'>{dateRange()}</span>
                    </Grid>
                    <Grid item xs={4} className='float-right'>
                        <span className='float-right'>
                            <ButtonGroup size='large' className='float-right'>
                                <Button key={1} onClick={navigateToToday} className={activeBtn('day')}>Today</Button>,
                                <Button key={2} onClick={() => {
                                    const newDate = moment(date).toDate();
                                    onView('week')
                                    onNavigate(newDate)
                                    dispatch(getCalenderview_1({ from_date: moment(newDate).startOf('week').format('YYYY-MM-DD'), to_date: moment(newDate).endOf('week').format('YYYY-MM-DD') }));
                                }} className={activeBtn('week')}>Week</Button>,
                                <Button key={3} onClick={() => {
                                    onView('month'),
                                        dispatch(getCalenderview_1({ from_date: moment().startOf('month').format('YYYY-MM-DD'), to_date: moment().endOf('month').format('YYYY-MM-DD') }))
                                }} className={activeBtn('month')}>Month</Button>,
                                <Button
                                    key={4}
                                    onClick={() => {
                                        onView('year')
                                        dispatch(getCalenderview_1({ from_date: moment().format('YYYY-MM-DD'), to_date: moment().format('YYYY-MM-DD') }))
                                    }}
                                    className={activeBtn('year')}
                                >year</Button>,
                            </ButtonGroup>
                        </span>
                    </Grid>
                </Grid>
            </div >
        )
    }
    const handleMonthChange = (e) => {
        setSelectedMonth(e.target.value)
        const newDate = moment(date).month(e.target.value).toDate();
        setDate(newDate);
        dispatch(getCalenderview_1({ from_date: moment(newDate).startOf('month').format('YYYY-MM-DD'), to_date: moment(newDate).endOf('month').format('YYYY-MM-DD') }))
    }
    const handleYearChange = (e) => {
        const newDate = moment(date).year(e.target.value).toDate();
        setDate(newDate);
    };
    const groupedEvents = events && events?.reduce((groups, event) => {
        const key = event?.start?.getTime(); // Use timestamp as key for grouping
        if (!groups[key]) {
            groups[key] = [];
        }
        groups[key].push(event);
        return groups;
    }, {});
    const handleMeetinglick = () => {
        // history.push(`${BASE_URL}/meeting link`)
    }
    // const groupedEvents = groupEventsByStartTime(events);
    const EventComponent = ({ event }) => {
        return (
            <>
                {event?.count > 1 ? (
                    <span className='custom-event flex flex-row p-1'
                    // onClick={handleMeetinglick}
                    >
                        {/* <div> */}
                        <Badge badgeContent={event.count} color='warning' anchorOrigin={{ vertical: 'top', horizontal: 'left' }}>
                            <span className='text-white'>{event.title}</span>
                            <br />
                            Time: {`${moment(event?.start).format('hh:mm A')} - ${moment(event?.end).format('hh:mm A')}`}
                        </Badge>
                        {/* </div> */}
                    </span>
                ) : (
                    <div>
                        <strong>{event?.title}</strong>
                        <br />
                        Time: {`${moment(event?.start).format('hh:mm A')} - ${moment(event?.end).format('hh:mm A')}`}
                    </div>
                )
                }
            </>
        )
    }
    const eventsWithCount = Object.values(groupedEvents)?.map(eventsAtSameTime => {
        const firstEvent = eventsAtSameTime[0];
        return {
            ...firstEvent,
            count: eventsAtSameTime.length
        };
    });
    const activeBtn = (buttonView) => {
        return view === buttonView ? 'btn-selected' : ''
    }
    return (
        <>
            <div className={`p-3`}>
                <div
                // className="col-md-5 col-12 col-lg-4 d-flex mb-3 mb-md-0 justify-between align-items-center"
                >
                    <div>
                        <Grid container>
                            <Grid item xs={12}>
                                <h2 className='mt-2'>Your Todo`s</h2>
                                <span className='float-right mx-1'>
                                    <Select
                                        size='small'
                                        value={selectedMonth}
                                        onChange={handleMonthChange}
                                        className='me-2'
                                    >
                                        {ListofMonths?.map((d, index) =>
                                            <MenuItem key={index} value={d}>{d}</MenuItem>
                                        )}
                                    </Select>
                                    <Select
                                        size='small'
                                        value={moment(date).format('YYYY')}
                                        onChange={handleYearChange}
                                    >
                                        {Array.from({ length: 30 }, (_, index) => moment().year() - 20 + index).map((year, index) => (
                                            <MenuItem key={index} value={year}>{year}</MenuItem>
                                        ))}
                                    </Select>
                                </span>
                            </Grid>
                        </Grid>
                    </div>
                    <div className="custom-calendar-container">
                        {eventsWithCount && eventsWithCount?.length > 0 ? (
                            <>
                                <Calendar
                                    localizer={localizer}
                                    events={eventsWithCount}
                                    startAccessor="start"
                                    endAccessor="end"
                                    style={{ height: 1000 }}
                                    components={{
                                        toolbar: (props) => <CustomToolbar {...props} date={date} view={view} />,
                                        event: EventComponent
                                    }}
                                    view={view}
                                    views={{ month: true, week: true, year: true }}
                                    onView={setView}
                                    onNavigate={setDate}
                                    showAllEvents={true}
                                    defaultView={Views.MONTH}
                                />
                            </>
                        ) : (
                            <>
                                <Grid container rowSpacing={1} className='mt-3'>
                                    <Grid item xs={2}>
                                        <span>
                                            <button className="text-[#373a3c] inline-block mx-1 border-1 border-s-2 border-[#1976d2] p-1" onClick={() => onNavigate('PREV')}>
                                                <NavigateBeforeIcon />
                                            </button>
                                            <button className="text-[#373a3c] inline-block m-0 border-1 border-s-2 border-[#1976d2] p-1" onClick={() => onNavigate('NEXT')}>
                                                <NavigateNextIcon />
                                            </button>
                                        </span>
                                    </Grid>
                                    <Grid item xs={6}>
                                        {/* <span className='flex justify-center font-bold text-xl'>{dateRange()}</span> */}
                                    </Grid>
                                    <Grid item xs={4} className='float-right'>
                                        <span className='float-right'>
                                            <ButtonGroup size='large' className='float-right'>
                                                <Button key={1} onClick={navigateToToday} className={activeBtn('day')}>Today</Button>,
                                                <Button key={2} onClick={() => {
                                                    const newDate = moment(date).toDate();
                                                    setView('week')
                                                    setDate(newDate)
                                                    dispatch(getCalenderview_1({ from_date: moment(newDate).startOf('week').format('YYYY-MM-DD'), to_date: moment(newDate).endOf('week').format('YYYY-MM-DD') }));
                                                }} className={activeBtn('week')}>Week</Button>,
                                                <Button key={3} onClick={() => {
                                                    setView('month')
                                                    dispatch(getCalenderview_1({ from_date: moment().startOf('month').format('YYYY-MM-DD'), to_date: moment().endOf('month').format('YYYY-MM-DD') }))
                                                }} className={activeBtn('month')}>Month</Button>,
                                                <Button
                                                    key={4}
                                                    onClick={() => {
                                                        setView('year')
                                                        dispatch(getCalenderview_1({ from_date: moment().format('YYYY-MM-DD'), to_date: moment().format('YYYY-MM-DD') }))
                                                    }}
                                                    className={activeBtn('year')}
                                                >
                                                    year
                                                </Button>
                                            </ButtonGroup>
                                        </span>
                                    </Grid>
                                </Grid>
                                <div className='mt-3 flex justify-center'>
                                    <span className='text-xl font-semibold'>
                                        Oops Data not available
                                    </span>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}
