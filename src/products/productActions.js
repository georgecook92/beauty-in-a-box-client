import { createAction } from 'redux-actions';
import axios from 'axios';
import {List} from "immutable";

export const initialiseProducts = createAction("Initialise products");
export const setLoadingTrue = createAction("Set product loading true");

export const fetchAllSuccess = createAction('Fetch all products success');
export const fetchAllFail = createAction('Fetch all products fail');

const API_ROOT = "http://localhost:8080/api";

export const fetchAllProducts = () => {
  return function(dispatch) {
    dispatch(setLoadingTrue());
    const request = axios.get(`${API_ROOT}/products/getAll`);
    request.then((response) => {
      const data = List(response.data);
      dispatch(fetchAllSuccess(data));
    }).catch((e) => {
      dispatch(fetchAllFail(e));
    })
  };
};
