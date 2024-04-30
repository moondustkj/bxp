import { Box, Button, MenuItem, TextField } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import styled from "@emotion/styled";

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

const SubmitButton = styled(Button)({
    border: '1px solid blue',
    width: '200px',
    display: 'block',
    margin: '30px auto',
    backgroundColor: '#ffc65c !important',
    color: 'black',
    borderColor: '#ffc65c'
})

const Form = () => {
    const [commonData, setCommonData] = useState({});
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        number: '',
        comments: ''
    });
    const [uploadedFile, setFile] = useState({});
    const [errors, setErrors] = useState({
        name: '',
        email: '',
        number: '',
        invoice: '',
        images: '',
        complaintType: '',
        channel: '',
        category: ''
    })

    // fetch common data on mounted 
    useEffect(() => {
        fetchDataHandler();
    }, []);

    useEffect(() => {
        console.log(uploadedFile, 'common data');
    }, [uploadedFile])

    const fetchDataHandler = () => {
        axios.get(process.env.REACT_APP_API_URL + '/getCommonData').then(res => {
            if (res.data.code === 1 && res.data.data) {
                const updated = {
                    ...res.data.data,
                    complaintTypes: res.data.data.complaintTypes.map(i => ({
                        label: i,
                        value: i
                    })),
                    channel: res.data.data.channel.map(option => ({
                        label: option,
                        value: option
                    }))
                }
                setCommonData(updated)
            }
        })
    }

    const fileUploadHandler = (event, type) => {
        if (type === 'invoice') {
            setFile(prev => ({
                ...prev,
                invoice: event.target.files
            }));
        } else if (type === 'images') {
            setFile(prev => ({
                ...prev,
                images: event.target.files
            }));
        }
    }

    const submitFormHandler = (event) => {
        console.log('on submit ---', event);
        event.preventDefault();
        if (!formData?.name) {
            setErrors(prev => ({
                ...prev,
                name: "Name is required"
            }));
        }
        if (!formData?.number || formData?.number.length !== 10 || !['6', '7', '8', '9'].includes(formData?.number[0])) {
            setErrors(prev => ({
                ...prev,
                number: !formData.number ? 'Phone number is required' : 'Please enter a valid Phone Number'
            }));
        }

        let regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]+$/i;
        if (!formData.email || !regex.test(formData?.email)) {
            setErrors(prev => ({
                ...prev,
                email: !formData.email ? 'Phone email is required' : 'Please enter a valid email'
            }));
        }

        if (!formData.complaintType?.value) {
            setErrors(prev => ({
                ...prev,
                complaintType: 'Complaint type is required'
            }));
        }

        if (!formData.channel?.value) {
            setErrors(prev => ({
                ...prev,
                channel: 'Channel is required'
            }));
        }

        if (!formData.category?.value) {
            setErrors(prev => ({
                ...prev,
                category: 'Category is required'
            }));
        }
    }

    const setFormDataHandler = (e, type) => {
        switch (type) {
            case 'name':
                setFormData(prev => ({
                    ...prev,
                    name: e.target.value
                }));
                break;
            case 'number':
                if (e.target.value.length > 10) setFormData(prev => ({
                    ...prev,
                    'number': e.target.value.slice(0, 10)
                }))
                else setFormData(prev => ({
                    ...prev,
                    'number': e.target.value.replace(/[^0-9]/g, '')
                }));
                break;
            case 'comments':
                setFormData(prev => ({
                    ...prev,
                    comments: e.target.value
                }));
                break;
            case 'email':
                setFormData(prev => ({
                    ...prev,
                    email: e.target.value
                }));
                break;
            default:
                break;
        }
    }
    return <div>
        <h3>Complaint Form</h3>
        <form className="">
            <div className="input-wrapper">
                <TextField id="standard-basic"
                    error={Boolean(errors?.name)}
                    label={<>Name<span className="text-danger">*</span></>}
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    helperText={errors?.name}
                    onChange={(e) => setFormDataHandler(e, 'name')} value={formData.name} />
                <TextField error={Boolean(errors?.number)}
                    label={<>Phone Number<span className="text-danger">*</span></>}
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    helperText={errors?.number}
                    onChange={(e) => setFormDataHandler(e, 'number')} value={formData.number} />
            </div>
            <div className="input-wrapper">
                <TextField error={Boolean(errors?.email)}
                    id="standard-basic"
                    label={<>Email<span className="text-danger">*</span></>}
                    variant="outlined"
                    fullWidth
                    helperText={errors?.email}
                    margin="normal"
                    onChange={(e) => setFormDataHandler(e, 'email')} value={formData.email} />
                <TextField error={Boolean(errors?.complaintType)}
                    label={<>Complaint Type<span className="text-danger">*</span></>} variant="outlined" fullWidth select margin="normal"
                    helperText={errors?.complaintType}
                    defaultValue={""}>
                    {
                        commonData?.complaintTypes?.length ? commonData.complaintTypes.map(itm => (
                            <MenuItem key={itm.label} value={itm.value}>
                                {itm.label}
                            </MenuItem>
                        )) : null
                    }
                </TextField>
            </div>
            <div className="input-wrapper">
                <TextField error={Boolean(errors?.category)}
                    label={<>Product Categories<span className="text-danger">*</span></>} variant="outlined" fullWidth select margin="normal"
                    helperText={errors?.category}
                    defaultValue={""}>
                    {
                        commonData?.categories?.length ? commonData.categories.map(itm => (
                            <MenuItem key={itm.label} value={itm.value}>
                                {itm.label}
                            </MenuItem>
                        )) : null
                    }
                </TextField>
                <TextField error={Boolean(errors?.channel)}
                    label={<>Purchase Channel<span className="text-danger">*</span></>}
                    variant="outlined"
                    fullWidth
                    select
                    margin="normal"
                    helperText={errors?.channel}
                    defaultValue={""}>
                    {
                        commonData?.channel?.length ? commonData.channel.map(itm => (
                            <MenuItem key={itm.label} value={itm.value}>
                                {itm.label}
                            </MenuItem>
                        )) : null
                    }
                </TextField>
            </div>
            <div className="input-wrapper">
                <TextField label="Comments" variant="outlined" multiline fullWidth margin="normal" minRows={2}
                    onChange={(e) => setFormDataHandler(e, 'comments')} value={formData.comments} />
            </div>
            <div className="input-wrapper">
                <Box>
                    <Button
                        component="label"
                        role={undefined}
                        variant="outlined"
                        color="primary"
                        tabIndex={-1}
                        startIcon={<UploadFileOutlinedIcon />}
                    >
                        Upload Invoice<span className="text-danger">*</span>
                        <VisuallyHiddenInput type="file"
                            accept="application/pdf"
                            onChange={(event) => fileUploadHandler(event, 'invoice')} />
                    </Button>
                    {
                        errors?.invoice ? <span>errors.invoice</span> : null
                    }
                    <div>
                        {
                            uploadedFile?.invoice?.length ? <span>{uploadedFile.invoice[0].name}</span> : null
                        }
                    </div>
                </Box>
                <Box>
                    <Button
                        component="label"
                        role={undefined}
                        variant="outlined"
                        color="primary"
                        tabIndex={-1}
                        startIcon={<UploadFileOutlinedIcon />}
                    >
                        Upload Images<span className="text-danger">*</span>
                        <VisuallyHiddenInput type="file"
                            accept="images/*"
                            multiple
                            onChange={(event) => fileUploadHandler(event, 'images')} />
                    </Button>
                    {
                        errors?.invoice ? <span>errors.invoice</span> : null
                    }
                    <div>
                        {
                            uploadedFile?.images?.length ?
                                [...uploadedFile.images].map(file => (
                                    <span>{file.name}&nbsp;</span>
                                ))
                                : null
                        }
                    </div>
                </Box>
            </div>
            <div className="input-wrapper">
                <SubmitButton type="button" onClick={submitFormHandler}>
                    Submit
                </SubmitButton>
            </div>
        </form>
    </div>
}

export default Form;