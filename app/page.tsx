
"use client"
import HeadersTop from "./dashboard/common/HeadersTop";
import ApplicationsReceived from "./dashboard/component/ProjectManager/ApplicationsReceived";

import SideMenu from "./dashboard/component/SideMenu";
import TotalEmployees from "./dashboard/component/ProjectManager/TotalEmployees";
import NumberofVacancies from "./dashboard/component/ProjectManager/NumberofVacancies";
import Number_of_Interviews from "./dashboard/component/ProjectManager/Number_of_Interviews";
import TodayInterviews from "./dashboard/component/ProjectManager/TodayInterviews";

import PostedJobsCard from "./dashboard/component/ProjectManager/PostedJobsCard";
import CandidateStatus from "./dashboard/component/ProjectManager/CandidateStatus";
import PostedJobsTop from "./dashboard/component/ProjectManager/PostedJobsTop";
import Upcomings from "./dashboard/component/ProjectManager/Upcomings";
import Activity from "./dashboard/component/ProjectManager/Activity";
import HiringCandidates from "./dashboard/component/ProjectManager/HiringCandidates";
import ScheduledInterviewsGraph from "./dashboard/component/ProjectManager/ScheduledInterviewsGraph";
import CalendarProject from "./dashboard/component/ProjectManager/CalendarProject";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import React, { useState } from 'react';


export default function Home() {
  // Define an array of data objects representing each card's content
  const jobsData = [
    {
      title: "Python Developer",
      category: "Senior Developers",
      number: "303",
      percentage: "22%",
      time: "6 mins ago",
      imageSrc: "image/python.png",
    },
    {
      title: "Angular Developers",
      category: "Senior Developers",
      number: "250",
      percentage: "18%",
      time: "8 mins ago",
      imageSrc: "image/Angularicon.png",
    },

    {
      title: "Java Developers",
      category: "Senior Developers",
      number: "250",
      percentage: "18%",
      time: "8 mins ago",
      imageSrc: "image/graphic.png",
    },
    {
      title: "rrrrrUX|UI Designers",
      category: "Senior Developers",
      number: "250",
      percentage: "18%",
      time: "8 mins ago",
      imageSrc: "image/java.png",
    },

    // Add more job data objects as needed
  ];



  // tab start 
  interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
  }

  function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
      <div
     
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box className="p-0" sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };


  //tab end
  return (

    <main className="demo">
      <HeadersTop />

      <section className="container-fluid my-md-5 my-4">
        <div className="row">
          <div className="col-lg-1 ps-0 position-relative">
            <SideMenu />
          </div>

          <div className="col-lg-11 pe-lg-4">
            <div className="row justify-content-between  align-items-center">
              <div className="col-lg-8 projectText">
                <h1>Project Manager</h1>
                <p className="mt-3">
                  Enjoy your selecting potential candidates Tracking and
                  Management System.
                </p>
              </div>

              <div className="col-lg-4 mt-3 mt-lg-0 text-center text-lg-end">
                <button className="btn btn-light me-3 mx-lg-2">
                  JD Assets
                </button>
                <button className="btn btn-blue">Create New JD</button>
              </div>
            </div>

            <div className="row mt-4">
              <div className="col-lg-8 col-md-7 mt-3 mt-md-0 projectText">
                <ScheduledInterviewsGraph />
              </div>

              <div className="col-lg-4 col-md-5 mt-3 mt-md-0">
                <ApplicationsReceived />
              </div>
            </div>

            {/* new section */}

            <div className="row">
              <div className="col-lg-4 col-md-6 mt-4 pt-md-2">
                <TotalEmployees />
              </div>

              <div className="col-lg-4 col-md-6 mt-4 pt-md-2">
                <NumberofVacancies />
              </div>

              <div className="col-lg-4 col-md-12 mt-4 pt-md-2">
                <Number_of_Interviews />
              </div>
            </div>

            {/* new section */}

            <div className="row">
              <div className="col-lg-9 mt-4">
                <div className="shadow bg-white p-3">
                  <h3 className="projectManHeading">
                    Today Interviews Meetings Info
                  </h3>
                  <hr className="my-3" />

                  <div className="d-flex overflow-x-scroll interviewScroll">
                    <TodayInterviews />
                    <TodayInterviews />
                    <TodayInterviews />
                    <TodayInterviews />
                  </div>
                </div>

                {/* new section */}

                <div className="shadow bg-white">
                  <PostedJobsTop titleName="Posted Jobs" />

                  {/* <div className="ol-lg-12 px-3">
                    <ul className="d-flex">
                      <li className="d-inline-block pe-5">Active Jobs</li>
                      <li className="d-inline-block pe-5">Inactive Jobs</li>
                    </ul>
                   
                  </div> */}

                  <Box sx={{ width: '100%' }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                      <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                        <Tab label="Active Jobs" {...a11yProps(0)} />
                        <Tab label="Inactive Jobs" {...a11yProps(1)} />

                      </Tabs>
                    </Box>
                    <hr className="mt-0"/>
                    <CustomTabPanel className="p-0" value={value} index={0}>
                      <div className="row px-3 pb-3">
                        {jobsData.map((job, index) => (
                          <PostedJobsCard key={index} {...job} />
                        ))}
                      </div>
                    </CustomTabPanel>
                    <CustomTabPanel className="p-0 bg-dark" value={value} index={1}>
                      <div className="row px-3 pb-3">
                        
                        {jobsData.map((job, index) => (
                          <PostedJobsCard key={index} {...job} />
                        ))}
                      </div>
                    </CustomTabPanel>

                  </Box>


                </div>

                {/* new sections */}
                <div className="shadow bg-white">
                  <PostedJobsTop titleName="Candidate Status" />
                  <CandidateStatus />
                </div>
              </div>

              <div className="col-lg-3 mt-4">
                <div className="overflow-hidden d-flex justify-center">
                  <CalendarProject />
                </div>
                <div className="mt-5">
                  <Upcomings />
                </div>

                <div className="mt-5">
                  <Activity />
                </div>

                <div className="mt-5">
                  <HiringCandidates />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

  );
}
