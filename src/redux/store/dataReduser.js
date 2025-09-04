/* eslint-disable prettier/prettier */
const initialState = {
    data: [],

};
const SET_DATA = 'SET_DATA';
const dataReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_DATA:
            return { ...state, data: action.payload };
        default:
            return state;
    }
};

export const setData = data => ({
    type: SET_DATA,
    payload: data,
});



export default dataReducer;
