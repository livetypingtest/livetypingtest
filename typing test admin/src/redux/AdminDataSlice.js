import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios'
import { ADMIN_API_URL } from '../util/API_URL'

const handleGetAdminData = createAsyncThunk('handleGetAdminData', async(ID) => {
    // console.log(ID)
    const response = await axios.get(`${ADMIN_API_URL}`,{ headers : { Authorization : ID } });
    if(response.data.status === 200) {
        let checkMsg = {
            status : true,
            message : response.data.message,
            type : response.data.type,
            data : response.data.adminData,
        }
        return checkMsg
    } else {
        let checkMsg = {
            status : false,
            message : response.data.message,
            type : response.data.type,
            data : [],
        }
        // console.log(checkMsg)
        return checkMsg
    }
});

const handleSigninAdmin = createAsyncThunk('handleSigninAdmin', async(formData) => {
    const response = await axios.post(`${ADMIN_API_URL}/signin`, formData);
    if(response.data.status === 200) {
        localStorage.setItem('isSignin', true)
        localStorage.setItem('adminToken', response.data.token)
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

const handleGetUser = createAsyncThunk('handleGetUser', async(username)=>{
    // console.log(username)
    const ID = localStorage.getItem('adminToken')
    const response = await axios.get(`${ADMIN_API_URL}/users/${username}`, { headers : { Authorization : ID } })
    // console.log(response.data)
    if(response.data.status === 200) {
        let checkMsg = {
            status : true,
            message : response.data.message,
            type : response.data.type,
            data : response.data.userData
        }
        return checkMsg
    } else {
        let checkMsg = {
            status : false,
            message : response.data.message,
            type : response.data.type,
            data : []
        }
        // console.log(checkMsg)
        return checkMsg
    }
})

const handleDeleteUserAccount = createAsyncThunk('handleDeleteUserAccount', async(username) => {
    const ID = localStorage.getItem('adminToken')
    try{
        const response = await axios.delete(`${ADMIN_API_URL}/users/${username}`, { headers : { Authorization : ID } })
        // console.log(response.data)
        if(response.data.status === 200) {
            let checkMsg = {
                status : true,
                message : response.data.message,
                type : response.data.type,
                data : username,
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

const handleDeleteBulkAccount = createAsyncThunk('handleDeleteBulkAccount', async(formData) => {
    const ID = localStorage.getItem('adminToken')
    try{
        const response = await axios.post(`${ADMIN_API_URL}/users/bulk-delete`, formData, { headers : { Authorization : ID } })
        // console.log(response.data)
        if(response.data.status === 200) {
            let checkMsg = {
                status : true,
                message : response.data.message,
                type : response.data.type,
                data : formData,
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

const handleBlockUnblockUser = createAsyncThunk('handleBlockUnblockUser', async(username) => {
    const ID = localStorage.getItem('adminToken')
    const data = {username : username, date : new Date()}
    const response = await axios.post(`${ADMIN_API_URL}/users/block-unblock/${ID}`, data)
    if(response.data.status === 200) {
        let checkMsg = {
            status : true,
            message : response.data.message,
            type : response.data.type,
            data : data,
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

const handleUpdatePassword = createAsyncThunk('handleUpdatePassword', async(formData) => {
    const ID = localStorage.getItem('adminToken')
    console.log(formData)
    const response = await axios.post(`${ADMIN_API_URL}/users/updatepass`, formData, { headers : { Authorization : ID } })
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

const handleUploadProfile = createAsyncThunk('handleUploadProfile', async(data) => {
    const ID = localStorage.getItem('adminToken')
    const {username, formData} = data;
    try {
        // Send the file to your server endpoint
        const response = await axios.post(`${ADMIN_API_URL}/users/upload-profile/${username}`, formData, {
            headers: {
            'Content-Type': 'multipart/form-data',
            Authorization : ID
        },
        });
        if(response.data.status === 200) {
            const profileData = {username : username, responseData : response.data.profile}
            let checkMsg = {
                status : true,
                message : response.data.message,
                type : response.data.type,
                data : profileData,
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

const handleAdminProfileUpload = createAsyncThunk('handleAdminProfileUpload', async(formData) => {
    const ID = localStorage.getItem('adminToken')
    try {
        // Send the file to your server endpoint
        const response = await axios.post(`${ADMIN_API_URL}/upload-profile`, formData, {
            headers: {
            'Content-Type': 'multipart/form-data',
            Authorization : ID
        },
        });
        if(response.data.status === 200) {
            const profileData = {responseData : response.data.profile}
            let checkMsg = {
                status : true,
                message : response.data.message,
                type : response.data.type,
                data : profileData,
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

const handleAddParagraphs = createAsyncThunk('handleAddParagraphs', async(formData)=> {
    const ID = localStorage.getItem('adminToken')
    const response = await axios.post(`${ADMIN_API_URL}/add-para`, formData, { headers : { Authorization : ID } })
    if(response.data.status === 200) {
        let checkMsg = {
            status : true,
            message : response.data.message,
            type : response.data.type,
            data : response.data.paragraphs,
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

const handleDeleteParagraph = createAsyncThunk('handleDeleteParagraph', async(formData)=> {
    const ID = localStorage.getItem('adminToken')
    const response = await axios.post(`${ADMIN_API_URL}/para`, formData, { headers : { Authorization : ID } })
    if(response.data.status === 200) {
        let checkMsg = {
            status : true,
            message : response.data.message,
            type : response.data.type,
            data : formData,
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

const handleGetBlogPost = createAsyncThunk('handleGetBlogPost', async(data) => {
    const ID = localStorage.getItem('adminToken')
    const response = await axios.post(`${ADMIN_API_URL}/blog`, data, {
        headers: {
        'Content-Type': 'multipart/form-data',
        Authorization : ID
    },
    })
    if(response.data.status === 200) {
        let checkMsg = {
            status : true,
            message : response.data.message,
            type : response.data.type,
            data : response.data.blog,
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

const handleAddBlogPost = createAsyncThunk('handleAddBlogPost', async(data) => {
    const ID = localStorage.getItem('adminToken')
    const response = await axios.post(`${ADMIN_API_URL}/blog`, data, {
        headers: {
        'Content-Type': 'multipart/form-data',
        Authorization : ID
    },
    })
    if(response.data.status === 200) {
        let checkMsg = {
            status : true,
            message : response.data.message,
            type : response.data.type,
            data : response.data.blog,
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

const handleEditBlogPost = createAsyncThunk('handleEditBlogPost', async(data) => {
    const ID = localStorage.getItem('adminToken')
    const response = await axios.post(`${ADMIN_API_URL}/blog/edit`, data, {
        headers: {
            'Content-Type': 'multipart/form-data',
            Authorization : ID
        },
    })
    if(response.data.status === 200) {
        let checkMsg = {
            status : true,
            message : response.data.message,
            type : response.data.type,
            data : response.data.blog,
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

const handleDeleteBlogPost = createAsyncThunk('handleDeleteBlogPost', async(id) => {
    const ID = localStorage.getItem('adminToken')
    const response = await axios.delete(`${ADMIN_API_URL}/blog/delete/${id}`, { headers : { Authorization : ID } })
    if(response.data.status === 200) {
        let checkMsg = {
            status : true,
            message : response.data.message,
            type : response.data.type,
            data : id,
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

const handleAddBlogCategory = createAsyncThunk('handleAddBlogCategory', async(Data) => {
    const ID = localStorage.getItem('adminToken')
    const response = await axios.post(`${ADMIN_API_URL}/blog/category`, Data, { headers : { Authorization : ID } })
    if(response.data.status === 200) {
        let checkMsg = {
            status : true,
            message : response.data.message,
            type : response.data.type,
            data : Data?.category,
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

const handleCreateUser = createAsyncThunk('handleCreateUser', async(Data) => {
    const ID = localStorage.getItem('adminToken')
    const response = await axios.post(`${ADMIN_API_URL}/users/add`, Data, { headers : { Authorization : ID } })
    if(response.data.status === 200) {
        let checkMsg = {
            status : true,
            message : response.data.message,
            type : response.data.type,
            data : response.data.userData,
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

const handleDeleteBlogCategory = createAsyncThunk('handleDeleteBlogCategory', async(data) => {
    const ID = localStorage.getItem('adminToken')
    const response = await axios.delete(`${ADMIN_API_URL}/blog/${data}`, { headers : { Authorization : ID } })
    if(response.data.status === 200) {
        let checkMsg = {
            status : true,
            message : response.data.message,
            type : response.data.type,
            data : data,
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
    isDataPending : false,
    adminData : {},
    allUserData : [],
    userData : {},
    paragraphs : {
        Min1 : {
            easy : [],
            medium : [],
            hard : []
        },
        Min3 : {
            easy : [],
            medium : [],
            hard : []
        },
        Min5 : {
            easy : [],
            medium : [],
            hard : []
        },
    },
    blog : []
}

const AdminDataSlice = createSlice({
    name : "adminDataSlice",
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
            state.adminData = {}
        },
        handleAddBlogPostToState : (state, action) => {
            state.blog = action.payload
        },
        handleGetAllUsers : (state, action) => {
            state.allUserData = action.payload
        }
    },
    extraReducers : builder => {
        builder.addCase(handleGetAdminData.fulfilled, (state, action) => {
            if(action.payload.status) {
                const { paragraphs } = action.payload.data
                state.adminData = action.payload.data
                state.paragraphs = paragraphs
                state.isDataPending = false
                state.isError = false
                state.isFullfilled = true
            } else {    
                state.isError = true
                state.isDataPending = false
            }
        });
        builder.addCase(handleGetAdminData.pending, (state, action) => {
            state.isDataPending = true
        });
        builder.addCase(handleSigninAdmin.fulfilled, (state, action) => {
            if(action.payload.status) {
                state.isFullfilled = true
                state.fullFillMsg.type = action.payload.type,
                state.fullFillMsg.message = action.payload.message,
                state.isError = false
                state.isProcessing = false
                state.processingMsg = {}
                state.errorMsg = {}
            } else { 
                state.isProcessing = false
                state.isError = true
                state.errorMsg.message = action.payload.message
                state.errorMsg.type = action.payload.type
            }
        });
        builder.addCase(handleSigninAdmin.pending, (state, action) => {
            state.isProcessing = true
            state.processingMsg.message = 'Fetching Data...'
            state.processingMsg.type = 'signin'
        });
        builder.addCase(handleGetUser.fulfilled, (state, action) => {
            if(action.payload.status) {
                state.isFullfilled = true
                state.fullFillMsg.type = action.payload.type,
                state.fullFillMsg.message = action.payload.message,
                state.userData = action.payload.data
                state.isError = false
                state.isProcessing = false
                state.processingMsg = {}
                state.errorMsg = {}
            } else { 
                state.isProcessing = false
                state.isError = true
                state.errorMsg.message = action.payload.message
                state.errorMsg.type = action.payload.type
            }
        });
        builder.addCase(handleGetUser.pending, (state, action) => {
            state.isProcessing = true
            state.processingMsg.message = 'Fetching Data...'
            state.processingMsg.type = 'userData'
        });
        builder.addCase(handleDeleteUserAccount.fulfilled, (state, action) => {
            if(action.payload.status) {
                const {data} = action.payload
                const filteredData = state.allUserData?.filter(value => value.username !== data)
                state.isFullfilled = true
                state.fullFillMsg.type = action.payload.type
                state.fullFillMsg.message = action.payload.message
                state.adminData.userCount -= 1
                state.allUserData = filteredData
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
        builder.addCase(handleDeleteBulkAccount.fulfilled, (state, action) => {
            if (action.payload.status) {
                const { data } = action.payload;
        
                // Filter out deleted users and update the list
                const filteredData = state.allUserData?.filter(value => !data?.includes(value.username));
                state.allUserData = filteredData;
        
                // Update success message
                state.isFullfilled = true;
                state.fullFillMsg.type = action.payload.type;
                state.fullFillMsg.message = action.payload.message;
        
                // Adjust user count by the number of deleted users
                state.adminData.userCount -= data.length;
        
                // Reset error and processing flags
                state.isError = false;
                state.isProcessing = false;
            } else { 
                // Handle error case
                state.isProcessing = false;
                state.isError = true;
                state.errorMsg.message = action.payload.message;
                state.errorMsg.type = action.payload.type;
            }
        });
        builder.addCase(handleDeleteBulkAccount.pending, (state, action) => {
            state.isProcessing = true
            state.processingMsg.message = 'Deleting User'
            state.processingMsg.type = 'delete'
        });
        builder.addCase(handleBlockUnblockUser.fulfilled, (state, action) => {
            if (action.payload.status) {
                const { username } = action.payload.data;
        
                // Update isblock status in allUserData
                state.allUserData = state.allUserData.map(value => {
                    if (value.username === username) {
                        return {
                            ...value,
                            isblock: !value.isblock // Toggle the block status
                        };
                    }
                    return value; // Return the unchanged user
                });
        
                // Update state.userData immutably
                if (state.userData.username === username) {
                    state.userData.isblock = !state.userData.isblock; // Toggle the block status
                }

                const userAccountId = state.allUserData.filter(value => value.username === username)[0]?.accountid
                const blockedState = state.allUserData.filter(value => value.username === username)[0]?.isblock
                // Update adminData.block based on the new block status
                if (blockedState) {
                    // If the user is blocked, push the account ID to adminData.block
                    if (!state.adminData.block.includes(userAccountId)) {
                        console.log('Adding to block:', userAccountId);
                        state.adminData.block.push(userAccountId);
                    }
                } else {
                    // If the user is unblocked, pull the account ID from adminData.block
                    console.log('Removing from block:', userAccountId);
                    state.adminData.block = state.adminData.block.filter(id => id !== userAccountId);
                }
        
                // Set fulfillment state
                state.isFullfilled = true;
                state.fullFillMsg.type = action.payload.type;
                state.fullFillMsg.message = action.payload.message;
                state.isError = false;
                state.isProcessing = false;
        
                console.log('Updated adminData.block:', state.adminData.block);
            } else {
                // Handle error case
                state.isProcessing = false;
                state.isError = true;
                state.errorMsg.message = action.payload.message;
                state.errorMsg.type = action.payload.type;
            }
        });                        
        builder.addCase(handleBlockUnblockUser.pending, (state, action) => {
            state.isProcessing = true
            state.processingMsg.message = 'Blocking User'
            state.processingMsg.type = 'block-unblock'
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
        builder.addCase(handleUploadProfile.fulfilled, (state, action) => {
            // Check if the payload indicates a successful operation
            if (action.payload.status) {
                const { username, responseData } = action.payload.data;
                // console.log("profileData : ", action.payload.data)
        
                // Set fulfillment state and message
                state.isFullfilled = true;
                state.fullFillMsg = {
                    type: action.payload.type,
                    message: action.payload.message,
                };
        
                // Update profile image in userData
                state.userData.profileimage = responseData; // Use newname if it's the correct key
        
                // Update profile image in allUserData for the specific user
                state.allUserData = state.allUserData.map((user) =>
                    user.username === username
                        ? { ...user, profile: responseData?.newname } // Make sure responseData has the correct property
                        : user
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
        builder.addCase(handleUploadProfile.pending, (state, action) => {
            state.isProcessing = true
            state.processingMsg = {
                type : 'profile',
                messsage : 'Profile Uploade in Process'
            }
        });
        builder.addCase(handleAdminProfileUpload.fulfilled, (state, action) => {
            // Check if the payload indicates a successful operation
            if (action.payload.status) {
                const { responseData } = action.payload.data;
                // console.log("profileData : ", action.payload.data)
        
                // Set fulfillment state and message
                state.isFullfilled = true;
                state.fullFillMsg = {
                    type: action.payload.type,
                    message: action.payload.message,
                };
        
                // Update profile image in userData
                state.adminData.profileimage = responseData; // Use newname if it's the correct key
        
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
        builder.addCase(handleAdminProfileUpload.pending, (state, action) => {
            state.isProcessing = true
            state.processingMsg = {
                type : 'profile',
                messsage : 'Profile Uploade in Process'
            }
        });
        builder.addCase(handleAddParagraphs.fulfilled, (state, action) => {
            // Check if the payload indicates a successful operation
            if (action.payload.status) {
                // Set fulfillment state and message
                state.isFullfilled = true;
                state.fullFillMsg = {
                    type: action.payload.type,
                    message: action.payload.message,
                };
                console.log(action.payload?.data)
                state.paragraphs = action.payload?.data
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
        builder.addCase(handleAddParagraphs.pending, (state, action) => {
            state.isProcessing = true
            state.processingMsg = {
                type : 'addpara',
                messsage : 'adding Paragraphs'
            }
        });
        builder.addCase(handleDeleteParagraph.fulfilled, (state, action) => {
            // Check if the payload indicates a successful operation
            if (action.payload.status) {
                const { id, level, time } = action.payload.data; // Ensure data exists in the payload
                // Set fulfillment state and message
                state.isFullfilled = true;
                state.fullFillMsg = {
                    type: action.payload.type,
                    message: action.payload.message,
                };
        
                // Map time to the appropriate field
                const changeTime = {
                    '1': 'Min1',
                    '3': 'Min3',
                    '5': 'Min5',
                };
                const timeField = changeTime[time];
        
                // Update paragraphs by filtering out the deleted paragraph
                if (state.paragraphs[timeField] && state.paragraphs[timeField][level]) {
                    state.paragraphs[timeField][level] = state.paragraphs[timeField][level].filter(value => value.id !== id);
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
        builder.addCase(handleDeleteParagraph.pending, (state, action) => {
            state.isProcessing = true
            state.processingMsg = {
                type : 'deletepara',
                messsage : 'Deleting Paragraphs'
            }
        });
        builder.addCase(handleAddBlogPost.fulfilled, (state, action) => {
            // Check if the payload indicates a successful operation
            if (action.payload.status) {
                // Set fulfillment state and message
                state.isFullfilled = true;
                state.fullFillMsg = {
                    type: action.payload.type,
                    message: action.payload.message,
                };
                state.blog.push(action.payload?.data)
                state.adminData.blogCount += 1
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
        builder.addCase(handleAddBlogPost.pending, (state, action) => {
            state.isProcessing = true
            state.processingMsg = {
                type : 'blog',
                messsage : 'Posting Blog'
            }
        });
        builder.addCase(handleEditBlogPost.fulfilled, (state, action) => {
            // Check if the payload indicates a successful operation
            if (action.payload.status) {
                // Set fulfillment state and message
                state.isFullfilled = true;
                state.fullFillMsg = {
                    type: action.payload.type,
                    message: action.payload.message,
                };
                state.blog.push(action.payload?.data)
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
        builder.addCase(handleEditBlogPost.pending, (state, action) => {
            state.isProcessing = true
            state.processingMsg = {
                type : 'blog',
                messsage : 'Updating Blog'
            }
        });
        builder.addCase(handleDeleteBlogPost.fulfilled, (state, action) => {
            // Check if the payload indicates a successful operation
            if (action.payload.status) {
                // Set fulfillment state and message
                state.isFullfilled = true;
                state.fullFillMsg = {
                    type: action.payload.type,
                    message: action.payload.message,
                };
                state.blog = state.blog?.filter(value => value._id !== action.payload?.data)
                state.adminData.blogCount -= 1
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
        builder.addCase(handleDeleteBlogPost.pending, (state, action) => {
            state.isProcessing = true
            state.processingMsg = {
                type : 'blogDelete',
                messsage : 'deleting Blog'
            }
        });
        builder.addCase(handleAddBlogCategory.fulfilled, (state, action) => {
            // Check if the payload indicates a successful operation
            if (action.payload.status) {
                // Set fulfillment state and message
                state.isFullfilled = true;
                state.fullFillMsg = {
                    type: action.payload.type,
                    message: action.payload.message,
                };
                state.adminData.blogCategory?.push(action.payload.data)
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
        builder.addCase(handleAddBlogCategory.pending, (state, action) => {
            state.isProcessing = true
            state.processingMsg = {
                type : 'addBlogCategory',
                messsage : 'Adding Blog Category'
            }
        });
        builder.addCase(handleDeleteBlogCategory.fulfilled, (state, action) => {
            // Check if the payload indicates a successful operation
            if (action.payload.status) {
                // Set fulfillment state and message
                state.isFullfilled = true;
                state.fullFillMsg = {
                    type: action.payload.type,
                    message: action.payload.message,
                };
                state.adminData.blogCategory = state.adminData.blogCategory?.filter(value => value !== action.payload?.data)
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
        builder.addCase(handleDeleteBlogCategory.pending, (state, action) => {
            state.isProcessing = true
            state.processingMsg = {
                type : 'deleteBlogCategory',
                messsage : 'Deleting Blog Category'
            }
        });
        builder.addCase(handleCreateUser.fulfilled, (state, action) => {
            // Check if the payload indicates a successful operation
            if (action.payload.status) {
                // Set fulfillment state and message
                state.isFullfilled = true;
                state.fullFillMsg = {
                    type: action.payload.type,
                    message: action.payload.message,
                };
                state.allUserData?.push(action.payload.data)
                state.adminData.userCount += 1
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
        builder.addCase(handleCreateUser.pending, (state, action) => {
            state.isProcessing = true
            state.processingMsg = {
                type : 'signup',
                messsage : 'Creating User'
            }
        });
    }
})

export default AdminDataSlice.reducer;
export {handleGetAdminData, handleSigninAdmin, handleDeleteBlogCategory, handleDeleteBulkAccount, handleAdminProfileUpload, handleGetBlogPost, handleCreateUser, handleAddBlogCategory, handleDeleteBlogPost, handleDeleteParagraph, handleEditBlogPost, handleAddBlogPost, handleAddParagraphs, handleUpdatePassword, handleBlockUnblockUser, handleDeleteUserAccount, handleUploadProfile, handleGetUser};
export const {resetState, handleClearState, handleGetAllUsers, handleAddBlogPostToState} = AdminDataSlice.actions