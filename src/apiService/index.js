import axios from "axios";



class ApiService {
    baseURL = "http://localhost:8080/api/v1";

    constructor(){

    }

    getMachine(callback){
        axios.get(this.baseURL + "/machine").then(response => {
            callback(response);
        })
    }

    getReasonByMachine(machine, callback){
        axios.get(this.baseURL + "/reason", {
            params: {
                machine
            }
        }).then(response=>{
            callback(response);        
        })
    }

    getAnomalyByMachine(machine, callback){
        axios.get(this.baseURL + "/anomaly", {
            params: {
                machine
            }
        }).then(response=>{
            callback(response);        
        })
    }

    getAction(callback){
        axios.get(this.baseURL + "/action").then(response => {
            callback(response);
        })
    }

    updateAnomaly(anomalyObj, callback){
        axios.put(this.baseURL + "/anomaly", anomalyObj).then(response => {
            callback(response);
        })
    }
}

export default new ApiService();