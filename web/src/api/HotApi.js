import axios from 'axios';
import {apiAdress} from "../config";

export function getHotById(d3ModelId) {
    return axios({
        method: 'post',
        url: apiAdress + '/getHotById',
        data: {
            d3ModelId: d3ModelId,
        },
    })
}

export function uploadHeadMinio(data) {
    return axios({
        method: 'post',
        url: apiAdress + '/uploadHeadMinio',
        data: data,
    })
}

export function addHot(data) {
    return axios({
        method: 'post',
        url: apiAdress + '/addHot',
        data: data,
    })
}

export function updateHot(data) {
    return axios({
        method: 'post',
        url: apiAdress + '/updateHot',
        data: data,
    })
}

export function deleteHot(data) {
    return axios({
        method: 'post',
        url: apiAdress + '/deleteHot',
        data: data,
    })
}

