import axios from 'axios';

export function getHotById(d3ModelId) {
    return axios({
        method: 'post',
        url: serverAdress + '/getHotById',
        data: {
            d3ModelId: d3ModelId,
        },
    })
}

export function uploadHeadMinio(data) {
    return axios({
        method: 'post',
        url: serverAdress + '/uploadHeadMinio',
        data: data,
    })
}

export function addHot(data) {
    return axios({
        method: 'post',
        url: serverAdress + '/addHot',
        data: data,
    })
}

export function updateHot(data) {
    return axios({
        method: 'post',
        url: serverAdress + '/updateHot',
        data: data,
    })
}

export function deleteHot(data) {
    return axios({
        method: 'post',
        url: serverAdress + '/deleteHot',
        data: data,
    })
}

