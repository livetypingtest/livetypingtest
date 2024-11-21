import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios'
import {BASE_API_URL}  from '../util/API_URL'


const handleGetTermData = createAsyncThunk('handleGetTermData', async() => {
    const response = await axios.get(`${BASE_API_URL}/term-condition`)
    if(response.data.status === 200) {
        let checkMsg = {
            status : true,
            message : response.data.message,
            type : response.data.type,
            data : response.data.result,
        }
        return checkMsg
    } else {
        let checkMsg = {
            status : false,
            message : response.data.message,
            type : response.data.type,
            data : []
        }
        return checkMsg
    }
})

const handleGetPrivacyData = createAsyncThunk('handleGetPrivacyData', async() => {
    const response = await axios.get(`${BASE_API_URL}/privacy-policy`)
    if(response.data.status === 200) {
        let checkMsg = {
            status : true,
            message : response.data.message,
            type : response.data.type,
            data : response.data.result,
        }
        return checkMsg
    } else {
        let checkMsg = {
            status : false,
            message : response.data.message,
            type : response.data.type,
            data : []
        }
        return checkMsg
    }
})

const handleGetAboutData = createAsyncThunk('handleGetAboutData', async() => {
    const response = await axios.get(`${BASE_API_URL}/about`)
    if(response.data.status === 200) {
        let checkMsg = {
            status : true,
            message : response.data.message,
            type : response.data.type,
            data : response.data.result,
        }
        return checkMsg
    } else {
        let checkMsg = {
            status : false,
            message : response.data.message,
            type : response.data.type,
            data : []
        }
        return checkMsg
    }
})


const initialState = {
    isProcessing : false,
    isFullfilled : false,
    isError : false,
    errorMsg : {
        type : '',
        message : ''
    },
    fullFillMsg : {
        type : '',
        message : ''
    },
    processingMsg : {
        type : '',
        message : ''
    },
    term : {},
    privacy : {},
    about : {createdat : '', metaData : []}
}

const UserDataSlice = createSlice({
    name : "userDataSlice",
    initialState,
    reducers : {
        resetState : (state) =>{
            state.isError = false;
            state.isFullfilled = false;
            state.isProcessing = false
            state.errorMsg = {},
            state.fullFillMsg = {}
            state.processingMsg = {}
        },
        handleClearState : (state) => {
            
        }
    },
    extraReducers : builder => {
        builder.addCase(handleGetTermData.fulfilled, (state, action) => {
            // Check if the payload indicates a successful operation
            if (action.payload.status) {
                // Set fulfillment state and message
                state.isFullfilled = true;
                state.fullFillMsg = {
                    type: action.payload.type,
                    message: action.payload.message,
                };
                // console.log(action.payload?.data) 
                const {privacyPolicy, termsCondition} = action.payload?.data
                state.term = termsCondition
                state.privacy = privacyPolicy
                state.isError = false;
                state.isProcessing = false;
            } else {
                // Handle error state
                state.isProcessing = false;
                state.isError = true;
                state.errorMsg = {
                    message: action.payload.message,
                    type: action.payload.type,
                };
            }
        });              
        builder.addCase(handleGetTermData.pending, (state, action) => {
            state.isProcessing = true
            state.processingMsg = {
                type : 'termsCondition',
                messsage : 'Fetching Terms & Condition Data'
            }
        });
        builder.addCase(handleGetPrivacyData.fulfilled, (state, action) => {
            // Check if the payload indicates a successful operation
            if (action.payload.status) {
                // Set fulfillment state and message
                state.isFullfilled = true;
                state.fullFillMsg = {
                    type: action.payload.type,
                    message: action.payload.message,
                };
                state.privacy = action.payload?.data
                // Reset error state
                state.isError = false;
                state.isProcessing = false;
            } else {
                // Handle error state
                state.isProcessing = false;
                state.isError = true;
                state.errorMsg = {
                    message: action.payload.message,
                    type: action.payload.type,
                };
            }
        });              
        builder.addCase(handleGetPrivacyData.pending, (state, action) => {
            state.isProcessing = true
            state.processingMsg = {
                type : 'privacyPolicy',
                messsage : 'Fetching Privacy & Policy Data'
            }
        });
        builder.addCase(handleGetAboutData.fulfilled, (state, action) => {
            // Check if the payload indicates a successful operation
            if (action.payload.status) {
                // Set fulfillment state and message
                state.isFullfilled = true;
                state.fullFillMsg = {
                    type: action.payload.type,
                    message: action.payload.message,
                };
                const {createdat, metaData} = action.payload?.data
                state.about = {
                    createdat : createdat,
                    metaData : metaData
                }
                // Reset error state
                state.isError = false;
                state.isProcessing = false;
            } else {
                // Handle error state
                state.isProcessing = false;
                state.isError = true;
                state.errorMsg = {
                    message: action.payload.message,
                    type: action.payload.type,
                };
            }
        });
        builder.addCase(handleGetAboutData.pending, (state, action) => {
            state.isProcessing = true
            state.processingMsg = {
                type : 'about',
                messsage : 'Getting About Data'
            }
        });
    }
})

export default UserDataSlice.reducer;
export {handleGetTermData, handleGetAboutData, handleGetPrivacyData};
export const{ resetState, handleClearState } = UserDataSlice.actions