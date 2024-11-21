import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios'
import { USER_API_URL } from '../util/API_URL'

const handleLocalDataCalling = createAsyncThunk('handleLocalDataCalling', async() => {
    const response = await axios.get(`${USER_API_URL}/local`)
    if(response.data.status === 200) {
        return response.data.localData
    }
})

const handleGetUserData = createAsyncThunk('handleGetUserData', async(ID) => {
    // console.log(ID)
    const response = await axios.get(`${USER_API_URL}`, { headers : { Authorization : ID } });
    if(response.data.status === 200) {
        return response.data.userdata
    }
});

const handleSigninUser = createAsyncThunk('handleSigninUser', async(formData) => {
    const response = await axios.post(`${USER_API_URL}/signin`, formData)
    // console.log(response.data)
    if(response.data.status === 200) {
        localStorage.setItem('isSignin', true)
        localStorage.setItem('userToken', response.data.token)
        let checkMsg = {
            status : true,
            message : response.data.message,
            type : response.data.type
        }
        return checkMsg
    } else {
        let checkMsg = {
            status : false,
            message : response.data.message,
            type : response.data.type
        }
        // console.log(checkMsg)
        return checkMsg
    }
})

const handleSigninUserWithGoogle = createAsyncThunk('handleSigninUserWithGoogle', async(UserInfo) => {
    const response = await axios.post(`${USER_API_URL}/signin/google`, UserInfo)
    // console.log(response.data)
    if(response.data.status === 200) {
        localStorage.setItem('isSignin', true)
        localStorage.setItem('userToken', response.data.token)
        let checkMsg = {
            status : true,
            message : response.data.message,
            type : response.data.type
        }
        return checkMsg
    } else {
        let checkMsg = {
            status : false,
            message : response.data.message,
            type : response.data.type
        }
        // console.log(checkMsg)
        return checkMsg
    }
})

const handleUpdatePassword = createAsyncThunk('handleUpdatePassword', async(formData) => {
    const ID = localStorage.getItem('userToken')
    const response = await axios.post(`${USER_API_URL}/updatepass/${ID}`, formData, { headers : { Authorization : ID } })
    // console.log(response.data)
    if(response.data.status === 200) {
        let checkMsg = {
            status : true,
            message : response.data.message,
            type : response.data.type
        }
        return checkMsg
    } else {
        let checkMsg = {
            status : false,
            message : response.data.message,
            type : response.data.type
        }
        return checkMsg
    }
})

const handleCreateUser = createAsyncThunk('handleCreateUser', async(formData) => {
    const response = await axios.post(`${USER_API_URL}/signup`, formData)
    // console.log(response.data)
    if(response.data.status === 200) {
        localStorage.setItem('isSignin', true)
        localStorage.setItem('userToken', response.data.token)
        let checkMsg = {
            status : true,
            message : response.data.message,
            type : response.data.type
        }
        return checkMsg
    } else {
        let checkMsg = {
            status : false,
            message : response.data.message,
            type : response.data.type
        }
        // console.log(checkMsg)
        return checkMsg
    }
});

const handleSignupWithGoogle = createAsyncThunk('handleSignupWithGoogle', async(token) => {
    const formData = {
        token : token,
        createdate : new Date()
    }
    const response = await axios.post(`${USER_API_URL}/signup/google`, formData)
    if(response.data.status === 200) {
        localStorage.setItem('isSignin', true)
        localStorage.setItem('userToken', response.data.token)
        let checkMsg = {
            status : true,
            message : response.data.message,
            type : response.data.type
        }
        return checkMsg
    } else {
        let checkMsg = {
            status : false,
            message : response.data.message,
            type : response.data.type
        }
        // console.log(checkMsg)
        return checkMsg
    }
});

const handleTest = createAsyncThunk('handleTest', async(stats)=>{
    const ID = localStorage.getItem('userToken')
    const response = await axios.post(`${USER_API_URL}`, stats, { headers : { Authorization : ID } } )
    // console.log(response.data.recordBreak)
    if(response.data.status === 200) {
        if(response.data.recordBreak) {
            localStorage.setItem('newRecord', JSON.stringify(response.data.recordBreak))
        }
        let checkMsg = {
            status : true,
            message : response.data.message,
            type : response.data.type,
            data : {stats : response.data.stats, avgData : response.data.avgData},
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
});

const handleGetLeaderboardData = createAsyncThunk('handleGetLeaderboardData', async(data)=>{
    const { onLoadLimit, timeFilter } = data
    const response = await axios.get(`${USER_API_URL}/dashdata/${onLoadLimit}/${timeFilter}`)
    // console.log(response.data.userData)
    if(response.data.status === 200) {
        let checkMsg = {
            status : true,
            message : response.data.message,
            type : response.data.type,
            data : response.data.userData,
        }
        return checkMsg
    }
})

const handleUploadProfile = createAsyncThunk('handleUploadProfile', async(formData) => {
    const ID = localStorage.getItem('userToken')
    try {
        // Send the file to your server endpoint
        const response = await axios.post(`${USER_API_URL}/upload-profile`, formData, {
            headers: {
            'Content-Type': 'multipart/form-data',
            Authorization : ID
        },
        });
        // console.log(response.data)
        if(response.data.status === 200) {
            let checkMsg = {
                status : true,
                message : response.data.message,
                type : response.data.type,
                data : response.data.profile,
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
      } catch (error) {
        console.error('Error uploading file:', error);
    }
});

const handleDeleteUserAccount = createAsyncThunk('handleDeleteUserAccount', async() => {
    const ID = localStorage.getItem('userToken')
    try{
        const response = await axios.delete(`${USER_API_URL}`, { headers : { Authorization : ID } })
        // console.log(response.data)
        if(response.data.status === 200) {
            let checkMsg = {
                status : true,
                message : response.data.message,
                type : response.data.type,
                data : [],
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
    } catch (error) {
        console.error('Error deleting account:', error);
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
    isDataPending : false,
    userData : [],
    match1 : [],
    match3 : [],
    match5 : [],
    allUserData : [],
    paragraphs : {},
    blog : [],
    blogCategory : [],
    homePageSEO : {}
}

const UserDataSlice = createSlice({
    name : "userDataSlice",
    initialState,
    reducers : {
        resetState : (state) =>{
            state.isError = false;
            state.isFullfilled = false;
            state.errorMsg = {},
            state.fullFillMsg = {}
            state.processingMsg = {}
        },
        handleClearState : (state) => {
            state.userData = [];
            state.match1 = [];
            state.match3 = [];
            state.match5 = [];
            state.allUserData = [];
        }
    },
    extraReducers : builder => {
        builder.addCase(handleGetUserData.fulfilled, (state, action) => {
            if(action.payload) {
                state.userData = action.payload;
                state.match1 = action.payload.match_1;
                state.match3 = action.payload.match_3;
                state.match5 = action.payload.match_5;
                state.isDataPending = false
                state.isError = false
                state.isFullfilled = true
            } else {    
                state.isError = true
                state.isDataPending = false
            }
        });
        builder.addCase(handleGetUserData.pending, (state, action) => {
            state.isDataPending = true
        });
        builder.addCase(handleLocalDataCalling.fulfilled, (state, action) => {
            if(action.payload) {
                state.blog = action.payload.blog
                state.paragraphs = action.payload.paragraphs;
                state.blogCategory = action.payload.blogCategory
                state.homePageSEO = action.payload.homePageSEO
                state.isProcessing = false
                state.isError = false
                state.isFullfilled = true
            } else {    
                state.isError = true
                state.isProcessing = false
            }
        });
        builder.addCase(handleLocalDataCalling.pending, (state, action) => {
            state.isProcessing = true
        });
        builder.addCase(handleSigninUser.fulfilled, (state, action) => {
            if(action.payload.status) {
                state.isFullfilled = true
                state.fullFillMsg.type = action.payload.type,
                state.fullFillMsg.message = action.payload.message,
                state.isError = false
                state.isProcessing = false
            } else { 
                state.isProcessing = false
                state.isError = true
                state.errorMsg.message = action.payload.message
                state.errorMsg.type = action.payload.type
            }
        });
        builder.addCase(handleSigninUser.pending, (state, action) => {
            state.isProcessing = true
            state.processingMsg.message = 'Fetching Data...'
            state.processingMsg.type = 'signin'
        });
        builder.addCase(handleSigninUserWithGoogle.fulfilled, (state, action) => {
            if(action.payload.status) {
                state.isFullfilled = true
                state.fullFillMsg.type = action.payload.type,
                state.fullFillMsg.message = action.payload.message,
                state.isError = false
                state.isProcessing = false
            } else { 
                state.isProcessing = false
                state.isError = true
                state.errorMsg.message = action.payload.message
                state.errorMsg.type = action.payload.type
            }
        });
        builder.addCase(handleSigninUserWithGoogle.pending, (state, action) => {
            state.isProcessing = true
            state.processingMsg.message = 'Fetching Data...'
            state.processingMsg.type = 'signin'
        });
        builder.addCase(handleCreateUser.fulfilled, (state, action) => {
            if(action.payload.status) {
                state.isFullfilled = true
                state.isProcessing = false
                state.isError = false
                state.fullFillMsg.type = action.payload.type,
                state.fullFillMsg.message = action.payload.message
            } else { 
                state.isProcessing = false
                state.isError = true
                state.errorMsg.message = action.payload.message
                state.errorMsg.type = action.payload.type
            }
        });
        builder.addCase(handleCreateUser.pending, (state, action) => {
            state.isProcessing = true
            state.processingMsg.message = 'Fetching Data...'
            state.processingMsg.type = 'signup'
        });
        builder.addCase(handleSignupWithGoogle.fulfilled, (state, action) => {
            if(action.payload.status) {
                state.isFullfilled = true
                state.isProcessing = false
                state.isError = false
                state.fullFillMsg.type = action.payload.type,
                state.fullFillMsg.message = action.payload.message
            } else { 
                state.isProcessing = false
                state.isError = true
                state.errorMsg.message = action.payload.message
                state.errorMsg.type = action.payload.type
            }
        });
        builder.addCase(handleSignupWithGoogle.pending, (state, action) => {
            state.isProcessing = true
            state.processingMsg.message = 'Fetching Data...'
            state.processingMsg.type = 'signup'
        });
        builder.addCase(handleUpdatePassword.fulfilled, (state, action) => {
            if(action.payload.status) {
                state.isFullfilled = true
                state.isProcessing = false
                state.processingMsg = {}
                state.isError = false
                state.fullFillMsg.type = action.payload.type,
                state.fullFillMsg.message = action.payload.message
            } else { 
                state.isProcessing = false
                state.isError = true
                state.errorMsg.message = action.payload.message
                state.errorMsg.type = action.payload.type
            }
        });
        builder.addCase(handleUpdatePassword.pending, (state, action) => {
            state.isProcessing = true
            state.processingMsg.message = 'Updating Password...'
            state.processingMsg.type = 'updatepassword'
        });
        builder.addCase(handleTest.fulfilled, (state, action) => {
            if (action.payload?.status) {
                // Updating general state properties based on fulfilled action
                state.isFullfilled = true;
                state.fullFillMsg.type = action.payload.type;
                state.fullFillMsg.message = action.payload.message;
                state.isProcessing = false;
        
                // Extracting stats and avgData from the action payload
                const { stats } = action.payload.data;
                const { avgData } = action.payload.data;
        
                // Extracting the time from stats and mapping to match properties
                const { time } = stats;
        
                const matchPropertyMap = {
                    15: 'match1',
                    60: 'match1',
                    180: 'match3',
                    300: 'match5',
                };
        
                const matchProperty = matchPropertyMap[time];
        
                // If the matchProperty is found, update it immutably in the state
                if (matchProperty) {
                    state[matchProperty] = [...(state[matchProperty] || []), stats];
                }
        
                // Determine which "topXminavg" property to update based on the time value
                const avgPropertyMap = {
                    15: 'top1minavg',
                    60: 'top1minavg',
                    180: 'top3minavg',
                    300: 'top5minavg',
                };
        
                const avgProperty = avgPropertyMap[time];
                
        
                // If there's a corresponding avgProperty for the time, update userData immutably
                if (avgProperty) {
        
                    const difficultyKey = Object.keys(avgData).find(key => key !== 'all');
        
                    state.userData = {
                        ...state.userData,
                        [avgProperty]: {
                            ...(state.userData[avgProperty] || {}),
                            all: avgData.all,
                            ...(difficultyKey && { [difficultyKey]: avgData[difficultyKey] }),
                        }
                    };
                }
            } else {
                // Handle error case
                state.isError = true;
                state.errorMsg.type = action.payload.type;
                state.errorMsg.message = action.payload.message;
            }
        });            
        builder.addCase(handleTest.pending, (state, action) => {
            state.isProcessing = true
        });
        builder.addCase(handleGetLeaderboardData.fulfilled, (state, action) => {
            if(action.payload.status) {
                state.isFullfilled = true
                state.fullFillMsg.type = action.payload.type,
                state.fullFillMsg.message = action.payload.message,
                state.allUserData = action.payload.data
                state.isError = false
                state.isProcessing = false
            } else { 
                state.isProcessing = false
                state.isError = true
                state.errorMsg.message = action.payload.message
                state.errorMsg.type = action.payload.type
            }
        });
        builder.addCase(handleGetLeaderboardData.pending, (state, action) => {
            state.isProcessing = true
            state.processingMsg.message = 'Fetching LeaderBoard Data'
            state.processingMsg.type = 'leaderboard'
        });
        builder.addCase(handleUploadProfile.fulfilled, (state, action) => {
            if(action.payload.status) {
                state.isFullfilled = true
                state.fullFillMsg.type = action.payload.type,
                state.fullFillMsg.message = action.payload.message,
                state.userData.profileimage = action.payload.data,
                state.isError = false
                state.isProcessing = false
            } else { 
                state.isProcessing = false
                state.isError = true
                state.errorMsg.message = action.payload.message
                state.errorMsg.type = action.payload.type
            }
        });
        builder.addCase(handleUploadProfile.pending, (state, action) => {
            state.isProcessing = true
            state.processingMsg.type = 'profile'
        });
        builder.addCase(handleDeleteUserAccount.fulfilled, (state, action) => {
            if(action.payload.status) {
                state.isFullfilled = true
                state.fullFillMsg.type = action.payload.type,
                state.fullFillMsg.message = action.payload.message,
                state.isError = false
                state.isProcessing = false
            } else { 
                state.isProcessing = false
                state.isError = true
                state.errorMsg.message = action.payload.message
                state.errorMsg.type = action.payload.type
            }
        });
        builder.addCase(handleDeleteUserAccount.pending, (state, action) => {
            state.isProcessing = true
            state.processingMsg.message = 'Deleting User'
            state.processingMsg.type = 'delete'
        });
    }
})

export default UserDataSlice.reducer;
export {handleGetUserData, handleSigninUser, handleLocalDataCalling, handleCreateUser, handleUploadProfile, handleDeleteUserAccount, handleUpdatePassword, handleSignupWithGoogle, handleTest, handleGetLeaderboardData, handleSigninUserWithGoogle};
export const{ resetState, handleClearState } = UserDataSlice.actions