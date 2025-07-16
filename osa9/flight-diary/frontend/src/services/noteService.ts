import axios from 'axios';
import type { Entry, NewEntry } from '../types';

const baseurl = 'http://localhost:3000/api/diaries';

export const getEntries = () => {
    return axios
        .get<Entry[]>(baseurl)
        .then(response => response.data);
};

export const addEntry = (newEntry: NewEntry) => {
    return axios
        .post<Entry>(baseurl, newEntry)
        .then(response => response.data);
};