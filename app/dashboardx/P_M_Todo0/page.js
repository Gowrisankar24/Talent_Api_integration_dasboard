"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale";
import Link from "next/link";
import {
  Calendar,
  momentLocalizer,
  dateFnsLocalizer,
  Views
} from "react-big-calendar";
import "./style.css";
import SideMenu from "@/app/dashboard/component/SideMenu";
import "react-big-calendar/lib/css/react-big-calendar.css"; // Import the calendar styles
import moment from "moment";
import { getCalenderview_1 } from "@/store/reducers/calenderReducer";
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Modal from '@mui/material/Modal';
import { getMeetingView } from "@/store/reducers/meetingReducer";
const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});
export default function P_M_Todo0() {
  const dispatch = useDispatch();
  const myEventsList = [
    {
      title: "Event 1",
      start: new Date(),
      end: new Date(new Date().setHours(new Date().getHours() + 1)),
    },
  ];
  const [view, setView] = useState('week');
  const [date, setDate] = useState(new Date())
  const [selectedMonth, setSelectedMonth] = useState(moment().format('MMMM'));
  const [selectedYear, setSelectedYear] = useState(moment().format('YYYY'));
  const [activeEventModal, setActiveEventModal] = useState(false);
  const [meetingView, setMeetingView] = useState(false);
  const [modalEvent, setModalEvent] = useState([]);
  const [getSingleData, setGetSingleData] = useState([])
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [events, setEvents] = useState([]);
  const [DefaultDate, setDefaultDate] = useState(new Date())
  const calenderOneData = useSelector((state) => state?.calender_1_Slice?.data);
  const meetingLinkData = useSelector((state) => state?.getMeetingViewSlice?.data);
  // const defaultDate =moment(meetingLinkData?.start).startOf('week').toDate()

  useEffect(() => {
    const newDate = moment(date).toDate();
    setView('week')
    setDate(newDate)
    dispatch(getCalenderview_1({ from_date: moment(newDate).startOf('week').format('YYYY-MM-DD'), to_date: moment(newDate).endOf('week').format('YYYY-MM-DD') }));
  }, [])

  useEffect(() => {
    if (calenderOneData && calenderOneData?.length > 0) {
      const eventsmap = calenderOneData?.map((event) => ({
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
      setEvents(eventsmap)
    } else {
      setEvents([])
    }
  }, [calenderOneData])
  useEffect(() => {
    if (meetingLinkData) {
      const eventsmap = {
        id: meetingLinkData?.id,
        title: meetingLinkData?.summary,
        start: new Date(meetingLinkData?.start),
        end: new Date(meetingLinkData?.end),
        description: meetingLinkData?.desc,
        attendees: meetingLinkData?.attendees,
        status: meetingLinkData?.status,
        comment: meetingLinkData?.comment,
        score: meetingLinkData?.score,
        created_by: meetingLinkData?.user_det?.handled_by?.firstName,
        link: meetingLinkData?.link,
      };
      setDefaultDate(moment(meetingLinkData?.start).startOf('day').toDate() || new Date())
      setGetSingleData([eventsmap]);
    } else {
      setGetSingleData([]);
    }
  }, [meetingLinkData]);
  // Define months and years
  const months = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  const years = [
    { value: "2022", label: "2022" },
    { value: "2023", label: "2023" },
    { value: "2024", label: "2024" },
    // Add more years as needed
  ];
  const updateDate = (newDate, view) => {
    setDate(newDate);
    dispatch(getCalenderview_1({
      from_date: moment(newDate).startOf(view).format('YYYY-MM-DD'),
      to_date: moment(newDate).endOf(view).format('YYYY-MM-DD'),
    }));
  };
  // Handle month and year changes
  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
    const newDate = moment(date).month(e.target.value).toDate();
    setDate(newDate);
    updateDate(newDate, 'month')
    // dispatch(getCalenderview_1({ from_date: moment(newDate).startOf('month').format('YYYY-MM-DD'), to_date: moment(newDate).endOf('month').format('YYYY-MM-DD') }))
  };

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
    const newDate = moment(date).year(e.target.value).toDate();
    setDate(newDate);
    updateDate(newDate, 'month')
    // dispatch(getCalenderview_1({ from_date: moment(newDate).startOf('month').format('YYYY-MM-DD'), to_date: moment(newDate).endOf('month').format('YYYY-MM-DD') }))
  };


  const handleSelectSlot = (event) => {
    if (typeof event.start === "string") {
      event.start = new Date(event.start);
    }

    if (typeof event.end === "string") {
      event.end = new Date(event.end);
    }
    // setActiveEventModal(event);

  };

  const handleSelect = (event, e) => {
    // const { start, end } = event;
    setModalEvent(event)
    setActiveEventModal(true);
    // setPosition({ x: e.clientX, y: e.clientY });
  };

  const EventDetailModal = () => {
    return (
      <>
        {activeEventModal?.title && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              backgroundColor: "white",
              border: "1px solid black",
              padding: "10px",
              color: "blue",
              height: "100%",
              zIndex: 1000,
            }}
          >
            {activeEventModal?.title}
          </div>
        )}
      </>
    );
  };

  const navigateToToday = () => {
    setDate(new Date());
    setView('day');
    updateDate(new Date(), 'day')
    // dispatch(getCalenderview_1({ from_date: moment().format('YYYY-MM-DD'), to_date: moment().format('YYYY-MM-DD')}))
  };
  const groupedEvents = events && events?.reduce((groups, event) => {
    const key = event?.start?.getTime(); // Use timestamp as key for grouping
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(event);
    return groups;
  }, {});
  const eventsWithCount = Object.values(groupedEvents)?.map(eventsAtSameTime => {
    const firstEvent = eventsAtSameTime[0];
    return {
      ...firstEvent,
      count: eventsAtSameTime.length,
      eventsAtSameTime
    };
  });
  // Custom Event Component
  const CustomEvent = ({ event }) => {
    return (
      <>
        {event?.count > 1 ? (
          <>
            <div className="calendarTopSection">
              <Badge badgeContent={event.count} color='warning' anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
                <ul>
                  <li className="text-[12px] py-1">{event.title}</li>
                  <li className="text-[12px] py-1">Interviewer: Geetha</li>
                  <li className="text-[12px] py-1">Time : {moment(event.start).format('hh:mm A')} - {moment(event.end).format('hh:mm A')}</li>
                  <li className="text-[12px] py-1">Via : Google Voice</li>
                </ul>
              </Badge>
            </div>
          </>
        ) : (
          <>
            <div className="calendarTopSection">
              <ul>
                <li className="text-[12px] py-1">{event.title}</li>
                <li className="text-[12px] py-1">Interviewer: Geetha</li>
                <li className="text-[12px] py-1">Time : {moment(event.start).format('hh:mm A')} - {moment(event.end).format('hh:mm A')}</li>
                <li className="text-[12px] py-1">Via : Google Voice</li>
              </ul>
            </div>
            {/* <div className="shadow bg-white" style={{ position: "relative" }}>
                <strong className="text-black">{event.title}</strong>
                <p>{event.start.toLocaleString()}</p>
              </div>
              {activeEventModal && <EventDetailModal />} */}
          </>
        )
        }
      </>
    )
  };
  const CustomMeetingEvent = ({ event }) => {
    return (
      <div className="custom-event">
        <div className="event-title">{event?.title}</div>
        <div className="text-md">Created By: {event?.created_by}</div>
        <div className="text-md">interview Date: {' '}{moment(event.start).format('DD-MM-YYYY')}</div>
        <div className="text-md">interview Time: {' '}{moment(event.start).format('hh:mm A')}-{moment(event.end).format('hh:mm A')}</div>
        <div className="text-md">Interview via:G-Meet</div>
        <div className="text-md">Link: {' '}
          <a href={event?.link} className="font-bold text-[#5e80b5]">{event?.link}</a>
        </div>
      </div>
    )
  }
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
              <button className="text-[#373a3c] inline-block mx-1 border-1 border-s-2 border-[#1976d2] p-1" onClick={() => {
                const prevDate = moment(date).subtract(1, view === 'month' ? 'months' : view === 'week' ? 'weeks' : 'days').toDate();
                onNavigate('PREV')
                updateDate(prevDate, view);

              }
              }>
                <NavigateBeforeIcon />
              </button>
              <button className="text-[#373a3c] inline-block m-0 border-1 border-s-2 border-[#1976d2] p-1"
                onClick={() => {
                  const nextDate = moment(date).add(1, view === 'month' ? 'months' : view === 'week' ? 'weeks' : 'days').toDate();
                  onNavigate('NEXT');
                  updateDate(nextDate, view);
                }
                }>
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
                  updateDate(newDate, 'week');
                  // dispatch(getCalenderview_1({ from_date: moment(newDate).startOf('week').format('YYYY-MM-DD'), to_date: moment(newDate).endOf('week').format('YYYY-MM-DD') }));
                }} className={activeBtn('week')}>Week</Button>,
                <Button key={3} onClick={() => {
                  onView('month'),
                    updateDate(date, 'month')
                  // dispatch(getCalenderview_1({ from_date: moment(date).startOf('month').format('YYYY-MM-DD'), to_date: moment(date).endOf('month').format('YYYY-MM-DD') }))
                }} className={activeBtn('month')}>Month</Button>,
                <Button
                  key={4}
                  onClick={() => {
                    onView('year')
                    onNavigate(moment().format('YYYY-MM-DD'));
                    updateDate(date, 'year')
                    // dispatch(getCalenderview_1({ from_date: moment().format('YYYY-MM-DD'), to_date: moment().format('YYYY-MM-DD') }))
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

  const CustomMeetToolBar = () => {
    return null;
  }
  const style = {
    position: 'absolute',
    top: '30%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: '#c9ced6',
    border: '2px solid transparent',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
  };
  const Meetingstyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    // bgcolor: '#c9ced6',
    // border: '2px solid transparent',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
  };
  // const startDate = getSingleData?.length > 0 ? moment(getSingleData[0]?.start).startOf('week').toDate() : new Date();
  return (
    <section className="">
      <div className="container-fluid my-md-5 my-4">
        <div className="row">
          <div className="col-lg-1 leftMenuWidth ps-0 position-relative">
            <SideMenu />
          </div>

          <div className="col-lg-11 pe-lg-4 ps-lg-0">
            <div className="row justify-content-between align-items-center">
              <div className="col-lg-8 projectText">
                <h1>Calendar</h1>
                <p className="mt-3">
                  Enjoy your selecting potential candidates Tracking and
                  Management System.
                </p>
              </div>

              <div className="col-lg-4 mt-3 mt-lg-0 text-center text-lg-end">
                <Link
                  prefetch
                  href="/P_M_JobDescriptions1"
                  className="btn btn-light me-3 mx-lg-2"
                >
                  JD Assets
                </Link>
                <Link
                  prefetch
                  href="P_M_JobDescriptions4"
                  className="btn btn-blue bg-[#0a66c2!important]"
                >
                  Create New JD
                </Link>
              </div>
            </div>

            <div className="TotalEmployees shadow bg-white rounded-3 p-3 w-100 mt-4">
              <div className="md:flex align-items-center">
                <h3 className="projectManHeading">Your Todo’s</h3>
                <div className="ml-auto d-flex todoHeadingSelect">
                  <div className="month-year-picker">
                    <select value={selectedMonth} onChange={handleMonthChange}>
                      {/* <option value="">Select Month</option> */}
                      {months.map((month) => (
                        <option key={month.value} value={month.label}>
                          {month.label}
                        </option>
                      ))}
                    </select>
                    <select value={selectedYear} onChange={handleYearChange}>
                      <option value="">Select Year</option>
                      {years.map((year) => (
                        <option key={year.value} value={year.value}>
                          {year.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div
                className="d-none d-lg-block "
                style={{ width: "100%", position: "relative" }}
              >

                {/* <div className="calendarTopSection top-[250px] left-[100px]">
                  <ul>
                    <li className="text-[12px] py-1">Python Developer</li>
                    <li className="text-[12px] py-1">Interviewer: Geetha</li>
                    <li className="text-[12px] py-1">Time : 10 - 11 A.M</li>
                    <li className="text-[12px] py-1">Via : Google Voice</li>
                  </ul>
                </div>

                <div className="calendarTopSection top-[450px] left-[200px]">
                  <ul>
                    <li className="text-[12px] py-1">Python Developer</li>
                    <li className="text-[12px] py-1">Interviewer: Geetha</li>
                    <li className="text-[12px] py-1">Time : 10 - 11 A.M</li>
                    <li className="text-[12px] py-1">Via : Google Voice</li>
                  </ul>
                </div>

                <div className="calendarTopSection top-[450px] left-[800px]">
                  <ul>
                    <li className="text-[12px] py-1">Python Developer</li>
                    <li className="text-[12px] py-1">Interviewer: Geetha</li>
                    <li className="text-[12px] py-1">Time : 10 - 11 A.M</li>
                    <li className="text-[12px] py-1">Via : Google Voice</li>
                  </ul>
                </div>


                <div className="calendarTopSection top-[280px] left-[400px]">
                  <ul>
                    <li className="text-[12px] py-1">Python Developer</li>
                    <li className="text-[12px] py-1">Interviewer: Geetha</li>
                    <li className="text-[12px] py-1">Time : 10 - 11 A.M</li>
                    <li className="text-[12px] py-1">Via : Google Voice</li>
                  </ul>
                </div>

                <div className="calendarTopSection top-[280px] left-[700px]">
                  <ul>
                    <li className="text-[12px] py-1">Python Developer</li>
                    <li className="text-[12px] py-1">Interviewer: Geetha</li>
                    <li className="text-[12px] py-1">Time : 10 - 11 A.M</li>
                    <li className="text-[12px] py-1">Via : Google Voice</li>
                  </ul>
                </div>

                <div className="calendarTopSection top-[320px] left-[1000px]">
                  <ul>
                    <li className="text-[12px] py-1">Python Developer</li>
                    <li className="text-[12px] py-1">Interviewer: Geetha</li>
                    <li className="text-[12px] py-1">Time : 10 - 11 A.M</li>
                    <li className="text-[12px] py-1">Via : Google Voice</li>
                  </ul>
                </div> */}
                <Calendar
                  className="TodoDataTable"
                  selectable
                  localizer={localizer}
                  events={eventsWithCount}
                  startAccessor="start"
                  endAccessor="end"
                  style={{ height: 1000 }}
                  defaultView={"month"}
                  timeslots={4}
                  step={15}
                  view={view}
                  views={{ month: true, week: true, day: true, year: true }} // Show only month, week, and day views
                  components={view != 'year' ? {
                    toolbar: (props) => {
                      return (
                        <CustomToolbar
                          {...props}
                          date={date}
                          view={view}
                          onView={setView}
                          onNavigate={setDate}
                        />)
                    },
                    event: CustomEvent
                  } : ('')}
                  formats={{
                    dayFormat: "EEEE",
                  }}
                  onView={setView}
                  onNavigate={setDate}
                  onSelectSlot={handleSelectSlot}
                  onSelectEvent={(event, e) => handleSelect(event?.eventsAtSameTime, e)}
                />
              </div>
              {
                modalEvent?.length > 0 && (
                  <Modal
                    open={activeEventModal}
                    onClose={() => setActiveEventModal(false)}
                    aria-labelledby="event-modal-title"
                    aria-describedby="event-modal-description"
                  >
                    <Box sx={{ ...style, minWidth: '60%', width: '60%', height: '50%' }}>
                      <h2 id="parent-modal-title">Your Todo`s</h2>
                      {
                        modalEvent?.map((event, index) => {
                          return (
                            <div className="mt-4" key={event?.id}
                              onClick={() => {
                                setMeetingView(true)
                                dispatch(getMeetingView({ id: event?.id }))
                              }}
                            >
                              <Grid container>
                                <Grid item xs={8}>
                                  <Card sx={{ width: '50%' }} className="border-l-[13px] !border-l-[#0A66C2] p-1 ms-4 cursor-pointer hover:bg-[#0A66C2] hover:!text-white">
                                    <div className="pl-2">
                                      <p className="text-[12px] py-1"> {event?.title}</p>
                                      <p className="text-[12px] py-1">Interviewer: Geetha</p>
                                      <p className="text-[12px] py-1">Time: {moment(event?.start).format('hh:mm A')} - {moment(event?.end).format('hh:mm A')}</p>
                                      <p className="text-[12px] py-1">Via: Google Voice</p>
                                    </div>
                                  </Card>
                                </Grid>
                                <Grid item xs={4} />
                              </Grid>

                            </div>
                          )
                        }
                        )
                      }
                    </Box>
                  </Modal>
                )
              }
              <Modal open={meetingView} onClose={() => {
                setMeetingView(false)
              }}>
                <Box sx={{ ...Meetingstyle, width: '60%', height: '70%' }}>
                  <div>
                    {
                      getSingleData?.length > 0 && (
                        <Calendar
                          className="TodoDataTable"
                          localizer={localizer}
                          events={getSingleData}
                          startAccessor="start"
                          endAccessor="end"
                          defaultView={"week"}
                          style={{ height: 600, width: 1200 }}
                          components={{
                            toolbar: (props) => {
                              return (
                                <CustomMeetToolBar
                                  {...props} />
                              )
                            },
                            event: CustomMeetingEvent,
                            // header: CustomWeekHeader, 
                          }}
                          formats={{
                            dayFormat: `dd MMM E`
                          }}
                          defaultDate={DefaultDate || new Date()}
                        />
                      )
                    }
                  </div>
                </Box>
              </Modal>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}

// const CustomEvent = (event:any) => {
//   console.log(event,"sadfsdfsd")
//   return (
//     <span> <strong> {event.title} </strong> </span>
//   )
// }
// Custom Toolbar Component
const CustomToolbar = ({ label }) => {
  return (
    <div className="custom-toolbar ">
      <strong>{label}</strong>
      {/* Add custom buttons or components here */}
    </div>
  );
};
