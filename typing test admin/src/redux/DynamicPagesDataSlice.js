import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios'
import {BASE_API_URL} from '../util/API_URL'

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

const handlePostTermData = createAsyncThunk('handlePostTermData', async(formData) => {
    const ID = localStorage.getItem('adminToken')
    const response = await axios.post(`${BASE_API_URL}/term-condition`, formData, { headers : { Authorization : ID } })
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

const handleDeleteTermData = createAsyncThunk('handleDeleteTermData', async() => {
    const ID = localStorage.getItem('adminToken')
    const response = await axios.delete(`${BASE_API_URL}/term-condition`, { headers : { Authorization : ID } })
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
})

const handleGetContactData = createAsyncThunk('handleGetContactData', async() => {
    const response = await axios.get(`${BASE_API_URL}/contact`)
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

const handleUpdateContactData = createAsyncThunk('handleUpdateContactData', async(ID) => {
    const response = await axios.put(`${BASE_API_URL}/contact/${ID}`)
    if(response.data.status === 200) {
        let checkMsg = {
            status : true,
            message : response.data.message,
            type : response.data.type,
            data : ID,
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

const handleDeleteBulkContactData = createAsyncThunk('handleDeleteBulkContactData', async(Ids) => {
    const response = await axios.post(`${BASE_API_URL}/contact/bulk`, {ids : Ids})
    if(response.data.status === 200) {
        let checkMsg = {
            status : true,
            message : response.data.message,
            type : response.data.type,
            data : Ids,
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

const handleDeleteSingleContactData = createAsyncThunk('handleDeleteSingleContactData', async(ID) => {
    const response = await axios.delete(`${BASE_API_URL}/contact/${ID}`)
    if(response.data.status === 200) {
        let checkMsg = {
            status : true,
            message : response.data.message,
            type : response.data.type,
            data : ID,
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

const handlePostPrivacyData = createAsyncThunk('handlePostPrivacyData', async(formData) => {
    const ID = localStorage.getItem('adminToken')
    const response = await axios.post(`${BASE_API_URL}/privacy-policy`, formData, { headers : { Authorization : ID } })
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

const handleDeletePrivacyData = createAsyncThunk('handleDeletePrivacyData', async() => {
    const ID = localStorage.getItem('adminToken')
    const response = await axios.delete(`${BASE_API_URL}/privacy-policy`, { headers : { Authorization : ID } })
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

const handlePostAboutData = createAsyncThunk('handlePostAboutData', async(formData) => {
    const ID = localStorage.getItem('adminToken')
    const response = await axios.post(`${BASE_API_URL}/about`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization : ID
            },
    })
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

const handleDeleteOneAbout = createAsyncThunk('handleDeleteOneAbout', async(dataId) => {
    const ID = localStorage.getItem('adminToken')
    const response = await axios.delete(`${BASE_API_URL}/about/${dataId}`, {
        headers: {
            Authorization : ID
        },
    })
    if(response.data.status === 200) {
        let checkMsg = {
            status : true,
            message : response.data.message,
            type : response.data.type,
            data : dataId,
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

const handleUpdateAboutData = createAsyncThunk('handleUpdateAboutData', async(obj) => {
    const adminId = localStorage.getItem('adminToken')
    const {ID, formData} = obj
    const response = await axios.put(`${BASE_API_URL}/about/${ID}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
            Authorization : adminId
        },
    })
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

const handleDeleteAbout = createAsyncThunk('handleDeleteAbout', async() => {
    const ID = localStorage.getItem('adminToken')
    const response = await axios.delete(`${BASE_API_URL}/about`, {
        headers: {
            Authorization : ID
        },
    })
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
    about : {createdat : '', metaData : []},
    contact : []
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
        builder.addCase(handleGetContactData.fulfilled, (state, action) => {
            // Check if the payload indicates a successful operation
            if (action.payload.status) {
                // Set fulfillment state and message
                state.isFullfilled = true;
                state.fullFillMsg = {
                    type: action.payload.type,
                    message: action.payload.message,
                };
                const {data} = action.payload
                state.contact = data?.contact
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
        builder.addCase(handleGetContactData.pending, (state, action) => {
            state.isProcessing = true
            state.processingMsg = {
                type : 'contact',
                messsage : 'Fetching Contact Data'
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
        builder.addCase(handlePostTermData.fulfilled, (state, action) => {
            // Check if the payload indicates a successful operation
            if (action.payload.status) {
                // Set fulfillment state and message
                state.isFullfilled = true;
                state.fullFillMsg = {
                    type: action.payload.type,
                    message: action.payload.message,
                };
                const {content, createdat, title} = action.payload?.data
                state.term = {
                    content : content,
                    title : title,
                    createdat : createdat
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
        builder.addCase(handlePostTermData.pending, (state, action) => {
            state.isProcessing = true
            state.processingMsg = {
                type : 'termsCondition',
                messsage : 'Adding Terms & Condition Data'
            }
        });
        builder.addCase(handlePostPrivacyData.fulfilled, (state, action) => {
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
        builder.addCase(handlePostPrivacyData.pending, (state, action) => {
            state.isProcessing = true
            state.processingMsg = {
                type : 'privacyPolicy',
                messsage : 'Adding Privacy & Policy Data'
            }
        });
        builder.addCase(handleDeleteTermData.fulfilled, (state, action) => {
            // Check if the payload indicates a successful operation
            if (action.payload.status) {
                // Set fulfillment state and message
                state.isFullfilled = true;
                state.fullFillMsg = {
                    type: action.payload.type,
                    message: action.payload.message,
                };
                state.term = {}
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
        builder.addCase(handleDeleteTermData.pending, (state, action) => {
            state.isProcessing = true
            state.processingMsg = {
                type : 'termsCondition',
                messsage : 'Deleting Terms & Condition Data'
            }
        });
        builder.addCase(handleDeletePrivacyData.fulfilled, (state, action) => {
            // Check if the payload indicates a successful operation
            if (action.payload.status) {
                // Set fulfillment state and message
                state.isFullfilled = true;
                state.fullFillMsg = {
                    type: action.payload.type,
                    message: action.payload.message,
                };
                state.privacy = {}
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
        builder.addCase(handleDeletePrivacyData.pending, (state, action) => {
            state.isProcessing = true
            state.processingMsg = {
                type : 'privacyPolicy',
                messsage : 'Deleting Privacy & Policy Data'
            }
        });
        builder.addCase(handlePostAboutData.fulfilled, (state, action) => {
            // Check if the payload indicates a successful operation
            if (action.payload.status) {
                // Set fulfillment state and message
                state.isFullfilled = true;
                state.fullFillMsg = {
                    type: action.payload.type,
                    message: action.payload.message,
                };
        
                // Destructure the data from the payload
                const { createdat, metaData } = action.payload.data;
        
                // Correct way: Update the state without overwriting `state.about`
                state.about = {
                    ...state.about,  // Retain the existing state.about values
                    createdat: createdat,  // Update the createdat field
                };
        
                // Check if metaData exists and is an array, then push the new data
                if (Array.isArray(state.about.metaData)) {
                    state.about.metaData.push(metaData[0]);
                } else {
                    state.about.metaData = [metaData];  // Initialize metaData if not an array
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
        builder.addCase(handlePostAboutData.pending, (state, action) => {
            state.isProcessing = true
            state.processingMsg = {
                type : 'about',
                messsage : 'Adding About Data'
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
        builder.addCase(handleDeleteOneAbout.fulfilled, (state, action) => {
            // Check if the payload indicates a successful operation
            if (action.payload.status) {
                // Set fulfillment state and message
                state.isFullfilled = true;
                state.fullFillMsg = {
                    type: action.payload.type,
                    message: action.payload.message,
                };
                state.about.metaData = state.about.metaData?.filter(value => value._id !== action.payload.data)
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
        builder.addCase(handleDeleteOneAbout.pending, (state, action) => {
            state.isProcessing = true
            state.processingMsg = {
                type : 'aboutDeleteOne',
                messsage : 'Deleting About Data'
            }
        });
        builder.addCase(handleDeleteAbout.fulfilled, (state, action) => {
            // Check if the payload indicates a successful operation
            if (action.payload.status) {
                // Set fulfillment state and message
                state.isFullfilled = true;
                state.fullFillMsg = {
                    type: action.payload.type,
                    message: action.payload.message,
                };
                state.about = {}
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
        builder.addCase(handleDeleteAbout.pending, (state, action) => {
            state.isProcessing = true
            state.processingMsg = {
                type : 'aboutDeleteMany',
                messsage : 'Deleting About Data'
            }
        });
        builder.addCase(handleUpdateAboutData.fulfilled, (state, action) => {
            // Check if the payload indicates a successful operation
            if (action.payload.status) {
                // Set fulfillment state and message
                state.isFullfilled = true;
                state.fullFillMsg = {
                    type: action.payload.type,
                    message: action.payload.message,
                };
        
                const { data } = action.payload;  // Assuming `data` contains the updated information
                const {id, updatedItem} = data
                const updatedMetaData = {
                    title: updatedItem?.title,
                    content: updatedItem?.content,
                    imageUrl: updatedItem?.imageUrl,
                    _id: id,
                    button: {
                        title: updatedItem?.button?.title,
                        url: updatedItem?.button?.url
                    }
                };
        
                // console.log("Updated Meta Data:", updatedMetaData);
                // console.log("Current Meta Data:", state.about.metaData);
        
                // Ensure metaData is an array
                if (Array.isArray(state.about.metaData)) {
                    // Find the index of the item to update
                    const itemIndex = state.about.metaData.findIndex(value => value._id === id);
                    if (itemIndex !== -1) {
                        // Update the item in state
                        state.about.metaData[itemIndex] = {
                            ...state.about.metaData[itemIndex],  // Keep the old data
                            ...updatedMetaData  // Merge with the new data
                        };
                        console.log("Updated Meta Data at Index:", state.about.metaData[itemIndex]);
                    } else {
                        // console.error('Item not found in metaData');
                    }
                } else {
                    // console.error('metaData is not an array or is missing');
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
        builder.addCase(handleUpdateAboutData.pending, (state, action) => {
            state.isProcessing = true
            state.processingMsg = {
                type : 'aboutUpdate',
                messsage : 'Updating About Data'
            }
        });
        builder.addCase(handleUpdateContactData.fulfilled, (state, action) => {
            // Check if the payload indicates a successful operation
            if (action.payload.status) {
                // Set fulfillment state and message
                state.isFullfilled = true;
                state.fullFillMsg = {
                    type: action.payload.type,
                    message: action.payload.message,
                };
        
                const { data } = action.payload; // Assuming `data` contains the updated contact object
                state.contact = state.contact?.map((value) =>
                    value._id === data ? { ...value, status: 'seen' } : value
                );
                
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
        builder.addCase(handleUpdateContactData.pending, (state, action) => {
            state.isProcessing = true
            state.processingMsg = {
                type : 'updatecontact',
                messsage : 'Updating Contact Data'
            }
        });
        builder.addCase(handleDeleteBulkContactData.fulfilled, (state, action) => {
            // Check if the payload indicates a successful operation
            if (action.payload.status) {
                // Set fulfillment state and message
                state.isFullfilled = true;
                state.fullFillMsg = {
                    type: action.payload.type,
                    message: action.payload.message,
                };
        
                const { data } = action.payload; // Assuming `data` contains an array of deleted IDs
        
                // Filter out deleted contacts from the current state
                state.contact = state.contact.filter(contact => !data.includes(contact._id));
        
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
        builder.addCase(handleDeleteBulkContactData.pending, (state, action) => {
            state.isProcessing = true
            state.processingMsg = {
                type : 'deletebulkcontact',
                messsage : 'Deleting About Data'
            }
        });
        builder.addCase(handleDeleteSingleContactData.fulfilled, (state, action) => {
            // Check if the payload indicates a successful operation
            if (action.payload.status) {
                // Set fulfillment state and message
                state.isFullfilled = true;
                state.fullFillMsg = {
                    type: action.payload.type,
                    message: action.payload.message,
                };
                state.contact = state.contact?.filter(value => value._id !== action.payload?.data)
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
        builder.addCase(handleDeleteSingleContactData.pending, (state, action) => {
            state.isProcessing = true
            state.processingMsg = {
                type : 'deletecontact',
                messsage : 'Deleting About Data'
            }
        });
    }
})

export default UserDataSlice.reducer;
export {handleGetTermData, handlePostTermData, handleDeleteSingleContactData, handleDeleteBulkContactData, handleUpdateContactData, handleGetContactData, handleDeleteAbout, handleUpdateAboutData, handleDeleteOneAbout, handleGetAboutData, handlePostAboutData, handleDeleteTermData, handleGetPrivacyData, handlePostPrivacyData, handleDeletePrivacyData};
export const{ resetState, handleClearState } = UserDataSlice.actions