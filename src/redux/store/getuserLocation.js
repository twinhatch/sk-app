/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */
const initialState = {
    data: {
        location: {
            coords: {
                longitude: 77.391029,
                latitude: 28.535517,
            },
        },
        add: [
            {
                formatted_address: 'Katargam,Surat,Gujarat',
            },
        ],
    },

};

const getuserLocationReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'USER_LOCATION':
            return { ...state, data: action.payload };
        default:
            return state;
    }
};



export const getuserLocation = data => {
    return {
        type: 'USER_LOCATION',
        payload: data,
    };
};

export default getuserLocationReducer;