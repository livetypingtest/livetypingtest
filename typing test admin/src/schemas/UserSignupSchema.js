import * as yup from 'yup'

const UserSignupSchema = yup.object({
    username : yup.string().required("Must Enter Username"),
    email : yup.string().email('Invalid email format').required('Enter Email ID'),
    password : yup.string().required("Insert Your Password"),
    repassword : yup.string().oneOf([yup.ref("password")], "Password and Re-Password should be same").required("Insert Your Re-Password"),
})

export default UserSignupSchema