import './App.css';
import "bootstrap-icons/font/bootstrap-icons.css"

import { useEffect, useState } from 'react';
import CustomWaveForm from './components/CustomWaveForm';
import apiService from './apiService';
import Select from 'react-select'
import Swal from 'sweetalert2';

function App() {
  const [isClearable, setIsClearable] = useState(true);
  const [listMachine, setListMachine] = useState([]);
  const [machine, setMachine] = useState(null);
  const [listReason, setReasonList] = useState([]);
  const [selectedReason, setSelectedReason] = useState(null);
  const [listAnomaly, setListAnomaly] = useState([]);


  const [selectedAnomaly, setSelectedAnomaly] = useState(null);
  const [anomalyPlay, setAnomalyPlay] = useState(false);
  const [normalPlay, setNormalPlay] = useState(false);

  const [anomalyCurrentTime, setAnomalyCurrentTime] = useState(0);
  const [normalCurrentTime, setNormalCurrentTime] = useState(0);
  const [audioNormal, setAudioNormal] = useState(null);
  const [audioAnomaly, setAudioAnomaly] = useState(null);


  const [listAction, setListAction] = useState([]);
  const [selectedAction, setSelectedAction] = useState(null);
  const [comment, setComment] = useState("");

  useEffect(v => {
    apiService.getMachine(response => {
      setListMachine(response.data.map(v => { return { value: v.machine, label: v.machine } }));
    })



  }, []);

  useEffect(v => {


    apiService.getAnomalyByMachine(machine?.value, response => {
      if (response.data.length > 0) {
        setSelectedAnomaly(response.data[0]);
      }
      setListAnomaly(response.data);
    })
  }, [machine])

  useEffect(v => {
    apiService.getReasonByMachine(selectedAnomaly?.machine.machine, response => {
      let result = response.data.map(value => {
        return { label: value.reason, value: value.id }
      })
      setSelectedReason(null);
      let selectedReason = result.find(value => { return value.value == selectedAnomaly?.reason?.id })
      setReasonList(result);
      setSelectedReason(selectedReason);
    });

    apiService.getAction(response => {
      let result = response.data.map(value => {
        return { label: value.action, value: value.id }
      })
      setSelectedAction(null);
      let selectedAction = result.find(value => { return value.value == selectedAnomaly?.action?.id })
      setListAction(result)
      setSelectedAction(selectedAction)

    });
    setComment(selectedAnomaly?.comment??'');

    if(selectedAnomaly){
      apiService.getAudioFile(`//${window.location.host}` + selectedAnomaly.soundClipPath, response=>{
        setAudioNormal(URL.createObjectURL(response.data));
      });

      apiService.getAudioFile(`//${window.location.host}` + selectedAnomaly.anomalySoundClipPath, response=>{
        setAudioAnomaly(URL.createObjectURL(response.data));
      });


     
    }

    
    
  }, [selectedAnomaly])

  const updateAnomaly = () => {
    let anomalyObj = {
      id: selectedAnomaly.id,
      actionId: selectedAction.value,
      reasonId: selectedReason.value,
      comment: comment
    }
    apiService.updateAnomaly(anomalyObj, response => {
      Swal.fire({
        icon: 'success',
        title: 'Update anomaly success.',
        showConfirmButton: false,
        timer: 1500
      })

      //reload anomaly list
      apiService.getAnomalyByMachine(machine?.value, response => {
        if (response.data.length > 0) {
          //setSelectedAnomaly(response.data[0]);
        }
        setListAnomaly(response.data);
      })
    });
  }


  return (
    <div className="App">
      <div className="container-fluid p-0">
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <a className="navbar-brand" href="#">GROUNDAPP.AI</a>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item ">
                <a className="nav-link" href="#">DASHBOARD</a>
              </li>
              <li className="nav-item active">
                <a className="nav-link" href="#">ALERTS <span className="sr-only">(current)</span></a>
              </li>
            </ul>

          </div>

          <div className="my-2 my-lg-0">
            <span role="button" className='p-2'><i className="bi bi-gear"></i></span>
            <span role="button" className='p-2'><i className="bi bi-person"></i></span>
            <span role="button" className='p-2'><i className="bi bi-bell"></i></span>
            <span role="button" className='border-left pl-2'>Welcome Admin!</span>
          </div>
        </nav>
        <div className='p-3 bg' >
          <div className='row mx-2 bg-white p-2 border'>
            <div className='col-2 pl-4 pt-1 pb-1'>
              <Select isClearable={isClearable} options={listMachine} defaultValue={machine} onChange={setMachine} />
            </div>

          </div>
          <div className='row mx-2  bg-white border'>
            <div className='col-3 border p-0'>
              <button className='btn btn-block border darkBlue-text text-left pl-4'>
                <i className="bi bi-caret-left-fill"></i>Back
              </button>
              <div className='btn btn-block border darkBlue-text text-left pl-4 mt-0'>
                {listAnomaly.length} Alerts<span className="ml-2 badge badge-pill badge-primary">2 New</span>
              </div>
              <div>
                <div className='card'>
                  {
                    listAnomaly.map((v, index) => {
                      return <div className={selectedAnomaly == v ? "row m-2 border border-select" : "row m-2 border "} key={index} onClick={e => {
                        setSelectedAnomaly({...v});
                      }}>
                        <div className='col-1'>
                          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="bi bi-dot text-primary" viewBox="0 0 16 16">
                            <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
                          </svg>
                        </div>
                        <div className='col m-2'>
                          <div>
                            <span className='left'>ID #00013211</span>
                            <span className="right ml-2 badge badge-pill badge-warning text-white font-weight-normal px-2">Moderate</span>
                          </div>
                          <div className='mt-4'>
                            <div className='font-weight-bold'>Unknown Anomally</div>
                            <div className='font-weight-light'>Detect at {v.date}</div>
                            <div className='mt-2 text-primary'>
                              {v.machine.machine}
                            </div>
                          </div>
                        </div>

                      </div>
                    })
                  }


                </div>
              </div>
            </div>
            <div className='col'>
              {
                selectedAnomaly && (
                  <>
                    <div className='p-3'>
                      <div className='h4 text-secondary'>
                        Alert ID #00013211
                      </div>
                      <div className='text-secondary'>
                        Detect at {selectedAnomaly.date}
                      </div>
                    </div>
                    <hr />
                    <div className='row'>
                      <div className='col'>
                        <div className='h5 text-secondary'>Anomaly Machine Output</div>
                        <audio src={audioAnomaly} controls

                          onPlay={e => {
                            setAnomalyPlay(true);
                            setAnomalyCurrentTime(e.target.currentTime);
                          }} onPause={v => setAnomalyPlay(false)}
                        ></audio>
                        {
                          audioAnomaly && (<CustomWaveForm id={1} loadUrl={audioAnomaly} play={anomalyPlay} current={anomalyCurrentTime} />)
                        }
                      </div>
                      <div className='col'>
                        <div className='h5 text-secondary'>Normal Machine Output</div>
                        <audio src={audioNormal}
                          controls

                          onPlay={e => {
                            setNormalPlay(true)
                            setNormalCurrentTime(e.target.currentTime);
                          }} onPause={v => setNormalPlay(false)}
                        ></audio>
                        {
                          audioNormal && (<CustomWaveForm id={2} loadUrl={audioNormal} play={normalPlay} current={normalCurrentTime} />)
                        }
                        
                      </div>

                    </div>
                    <div className='row mt-4'>
                      <div className='col'>
                        <div className='darkBlue-text font-weight-bold'>Equipment</div>
                        <div className='darkBlue-text font-weight-normal'>{selectedAnomaly?.machine?.machine}</div>
                        <div className='darkBlue-text font-weight-bold'>Suspected Reason</div>
                        <Select options={listReason} defaultValue={selectedReason} value={selectedReason} onChange={setSelectedReason} />
                        <div className='darkBlue-text font-weight-bold'>Action Require</div>
                        <Select options={listAction} defaultValue={selectedAction} value={selectedAction} onChange={setSelectedAction} />
                        <div className='darkBlue-text font-weight-bold mt-3'>Comments</div>
                        <textarea type="textarea" className='form-control mt-1' rows={3} value={comment} onChange={(e) => {
                          setComment(e.target.value);
                        }}></textarea>
                        <div className='mt-3'>
                          <button className='btn btn-primary' onClick={e => { updateAnomaly() }}>UPDATE</button>
                        </div>
                      </div>
                    </div>
                  </>
                )
              }

            </div>
          </div>


        </div>
      </div>
    </div>
  );
}

export default App;
