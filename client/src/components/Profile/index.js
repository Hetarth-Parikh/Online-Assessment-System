import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardText,
  MDBCardBody,
  MDBCardImage,
} from "mdb-react-ui-kit";
import Typography from "@mui/material/Typography";
import Navbar from "../Home/Navbar";
import Button from '@mui/material/Button';
import SaveIcon from '@mui/icons-material/Save';
import ClearIcon from '@mui/icons-material/Clear';
import { SERVER_URL } from "../../config/config";
import { ToastContainer, toast } from "react-toastify";
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import './style.css';
import CanvasJSReact from './canvasjs.react';
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

let quizData = [];

const columns = [
  { id: "no", label: 'No.'}, 
  { id: 'title', label: 'Title' },
  { id: 'category',label: 'Category'},
  { id: 'score', label: 'Score' },
  { id: 'date', label: 'Date' },
  { id: 'review', label: 'Review' },
];

let rows = [];

function StickyHeadTable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.no}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === 'number'
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}

const getCookie = (cookie_name) => {
  let name = cookie_name + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let cookie_array = decodedCookie.split(';');
  for(let i = 0; i <cookie_array.length; i++) {
    let c = cookie_array[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function Bar(props) {
  const performanceData = props.chartData["performanceData"];  
  const options = {
    animationEnabled: true,
    theme: "light2",
    title:{ text: "Performance" },
    axisX: { title: "Topics", reversed: true},
    axisY: { title: "Questions Attempted", includeZero: true},
    data: [{
      type: "bar",
      toolTipContent: `Accuracy : {z}%`,
      dataPoints: [
        { y:  performanceData["Linux"][1],z:performanceData["Linux"][0]/performanceData["Linux"][1]*100, label: "Linux" },
        { y:  performanceData["DevOps"][1],z:performanceData["DevOps"][0]/performanceData["DevOps"][1]*100, label: "DevOps" },
        { y:  performanceData["PHP"][1],z:performanceData["PHP"][0]/performanceData["PHP"][1]*100, label: "PHP" },
        { y:  performanceData["random"][1],z:performanceData["random"][0]/performanceData["random"][1]*100, label: "Random" }
      ]
    }]
  }
  return(
    <CanvasJSChart options = {options}/>
  )
};


function Area(props){
  const speedData = props.chartData["speedData"];
  const categoryData = props.chartData["categoryData"];
  
  const data_acc=[];
  var cur=1;
  speedData.forEach(function(ele) {
    let temp={
        z:categoryData[cur-1], 
        y:ele[0]/1000,
        x:cur,
    }
    cur=cur+1;
    data_acc.push(temp);
  });
  const options = {
    animationEnabled: true,
    title: {
      text: "Speed"
    },
    axisY: { title: "Speed"},
		axisX: { title: "Quiz", interval:1},
		data: [{
      type: "splineArea",
			toolTipContent: `Category : {z} <br/>Quiz {x}: {y}sec`,
			dataPoints: data_acc
		}]
  }
  return(
    <CanvasJSChart options = {options}/>
  )
}


function Pie(props){
  const performanceData = props.chartData["performanceData"];  
  const options = {
    theme: "light1",
    animationEnabled: true,
    title:{
      text: "Topics"
    },
    data: [{
      type: "pie",
      showInLegend: true,
      legendText: "{label}",
      toolTipContent: "{label}: <strong>{y}%</strong>",
      indexLabel: "{y}%",
      indexLabelPlacement: "inside",
      dataPoints: [
        { y:  performanceData["Linux"][1], label: "Linux" },
        { y:  performanceData["PHP"][1], label: "PHP" },
        { y:  performanceData["DevOps"][1], label: "DevOps" },
        { y:  performanceData["random"][1], label: "Random" }
      ]
    }]
  }
  return(
    <CanvasJSChart options = {options}/>
  )
}

function Line(props) {
  const chartData = props.chartData;  
  const data_acc=[];
  var cur=1;
  chartData["accuracy"].forEach(function(ele) {
    let temp={
        y:ele[0],
        x:cur,
    }
    cur=cur+1;
    data_acc.push(temp);
  });
  const options = {
		animationEnabled: true,
		theme: "light1", // "light2", "dark1", "dark2"
		axisY: { title: "Accuracy", minimum:0, maximum:100, interval:10},
		axisX: { title: "Quiz", interval:1},
    title: { text: "Accuracy"},
		data: [{
			type: "line",
			toolTipContent: "Quiz {x}: {y}%",
			dataPoints: data_acc
		}]
	}
  return(
    <CanvasJSChart options = {options}/>
  )
};

const Analytics = () => {
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState({});

  const getData = async () => {
    if(loading){
      return;
    }
    const res = await fetch(SERVER_URL + "/api/user/visualizer", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: 'include',
    });

    const data = await res.json();
    setLoading(true);
    setChartData(data);
  };

  useEffect(()=>{
    getData();
  })

  return (
    <>
      {!loading && <div style={{margin:'3em', fontSize:'larger'}}>We are fetching your data... </div>}
      {loading && 
      <>
        <MDBRow className="mt-3">
          <MDBCol sm="6">
            <Line chartData={chartData}/>
          </MDBCol>
          <MDBCol sm="6">
            <Bar chartData={chartData}/>
          </MDBCol>
        </MDBRow>
        <MDBRow className="mt-5">
        < MDBCol sm="6">
            <Pie chartData={chartData}/>
          </MDBCol>
        <MDBCol sm="6">
          <Area chartData={chartData}/>
          </MDBCol>
        </MDBRow>
      </>
      }
    </>
  )
}

const Profile = (props) => {
	const navigate = useNavigate();
	const email = getCookie('email');
	const [isChanged,setIschanged] = useState(false);
	const [fname,setFname] = useState('Your Name');
	const updateFname = (e) => {
		setFname(e.target.value);
		setIschanged(true);
	}
	const [mobile,setMobile] = useState('9876543210');
	const updateMobile = (e) => {
		setMobile(e.target.value);
		setIschanged(true);
	}
	const [country,setCountry] = useState('India');
	const updateCountry = (e) => {
		setCountry(e.target.value);
		setIschanged(true);
	}
	const [initialData,setInitialData] = useState({'name':fname,'mobile':mobile,'country':country});


  const propogateRows = () => {
    rows = [];
    for(let id = 0; id < quizData.length; id++){
      let tag='';
      if(quizData[id].category===undefined || quizData[id].category==='' || quizData[id].category==="random")
        tag = "Random"
      else    
        tag = quizData[id].category;
      const timeStamp = Date.parse(quizData[id].time);
      const date= new Date(timeStamp);
      const dateFormat = date.getHours() + ":" + date.getMinutes() + ", "+ date.toDateString();
      const row = {
        'no' : id + 1,
        'title': 'Practice Quiz',
        'category': tag,
        'score': quizData[id].correctAnswers + "/" + quizData[id].totalQuestions, 
        'date' : dateFormat, 
        'review':  <Button variant="outlined" size="small" onClick={handleReview} value={id}> Review </Button>
      }
      rows.push(row);
    }
  }
  

	const getData = async () => {
		const res = await fetch(SERVER_URL + "/api/user/read", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: 'include',
    });

    const data = await res.json();

		if(data.message === "Valid Access"){
      quizData = data.user.quiz;
			setInitialData(data.user);
			setIschanged(false);
			setFname(data.user.name);
			setMobile(data.user.mobile);
			setCountry(data.user.country);
		}else if(data.message === "Invalid Access"){
			toast.error(data.message, { position: "top-right" });
      setTimeout(() => {
        navigate("/register", { replace: true });
      }, 3000);
		}else{
			toast.error(data.message, { position: "top-right" });
		}
    propogateRows();
	};
	const handleSave = async () => {
		setInitialData({'name':fname,'mobile':mobile,'country':country});
		const res = await fetch(SERVER_URL + "/api/user/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: 'include',
			body: JSON.stringify({'email':email, 'name':fname,'mobile':mobile,'country':country}),
    });

		const data = await res.json();
		if(data.success===true){
			toast.success(data.message, { position: "top-right" });
		}else{
			toast.error(data.message, { position: "top-right" });
		}
	};
	const clear = () => {
		setIschanged(false);
		setFname(initialData.name);
		setMobile(initialData.mobile);
		setCountry(initialData.country);
	}

  const handleReview = (e) => {
    const index = e.target.value;
    props.setReviewData(quizData[index]);
    navigate("/review", { replace: true });
  }

  return (
    <section onLoad={getData}>
      <Navbar />
      <MDBContainer className="py-5">
        <MDBRow>
          <MDBCol lg="4">
            <MDBCard className="mb-5">
              <MDBCardBody className="text-center">
                <MDBCardImage
                  src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp"
                  alt="avatar"
                  className="rounded-circle"
                  style={{ width: "150px" }}
                  fluid
                />
                <p className="text-muted mb-1 mt-3">{fname}</p>
								<p className="text-muted mb-2 mt-1">{country}</p>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
          <MDBCol lg="8">
            <MDBCard className="mb-4">
              <MDBCardBody>
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Full Name</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">
                      <input
                        type="text"
                        name="Full Name"
                        value={fname}
                        onChange={updateFname}
												className = "input_field"
                      />
                    </MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Email</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">
                      {email}
                    </MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Mobile</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">
												<input 
													type="text" 
													value={mobile}
													className = "input_field"
													onChange={updateMobile}
													maxLength={10}
													minLength={10}
												/> 
                    </MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Country</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">
											<input
                        type="text"
                        value={country}
                        onChange={updateCountry}
												className = "input_field"
                      />
                    </MDBCardText>
                  </MDBCol>
                </MDBRow>
								<hr/>
								<MDBRow>
									<MDBCol sm="8" />
									<MDBCol sm="4">
										<div style={{display:"flex",justifyContent:"flex-end"}}>
											<Button variant="contained" endIcon={<ClearIcon />} color='error' disabled={isChanged?false:true} size="small" sx={{marginRight:"1em"}} onClick={clear}>
  											Cancel
											</Button>
											<Button variant="contained" endIcon={<SaveIcon />} color='success' disabled={isChanged?false:true} size="small" onClick={handleSave}>
  											Save
											</Button>
										</div>
									</MDBCol>
                </MDBRow>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>

				<MDBRow>
          <MDBCol lg="16">
            <MDBCard className="mb-5">
              <Typography
                variant="h4"
                component="h4"
                textAlign="center"
                sx={{ color: "black" }}
                pt={3}
              >
                Quiz History
              </Typography>
              <StickyHeadTable/>
            </MDBCard>
          </MDBCol>
        </MDBRow>
        
        <MDBRow>
          <MDBCol lg="16">
            <div style={{'backgroundColor':'white'}}>
              <Typography
                variant="h4"
                component="h4"
                textAlign="center"
                sx={{ color: "black" }}
                pt={3}
              >
                Analytics
              </Typography>
              <Analytics/>
            </div>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
			<ToastContainer/>
    </section>
  );
};

export default Profile;
