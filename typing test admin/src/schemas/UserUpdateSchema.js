import * as yup from 'yup';

const passwordUpdateSchema = (requiresCurrentPassword) =>
  yup.object({
    currentpassword: requiresCurrentPassword
      ? yup.string().required("Must Enter Your Current Password")
      : yup.string(),
    newpassword: yup.string().required("Insert Your New Password"),
    repassword: yup
      .string()
      .oneOf([yup.ref("newpassword")], "Password and Re-Password should be the same")
      .required("Insert Your Re-Password"),
  });

export { passwordUpdateSchema };
