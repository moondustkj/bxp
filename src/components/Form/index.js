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
    backgroundColor: '#ffc65c',
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
                let regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]+$/i;
                if(!regex.test(e.target.value)){
                    console.log('erorr');
                } 
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
                <TextField id="standard-basic" label="Name" variant="outlined" fullWidth margin="normal"
                    onChange={(e) => setFormDataHandler(e, 'name')} value={formData.name} />
                <TextField label="Phone Number" variant="outlined" fullWidth margin="normal"
                    onChange={(e) => setFormDataHandler(e, 'number')} value={formData.number} />
            </div>
            <div className="input-wrapper">
                <TextField id="standard-basic" label="Email" variant="outlined" fullWidth margin="normal"
                    onChange={(e) => setFormDataHandler(e, 'email')} value={formData.email} />
                <TextField label="Complaint Type" variant="outlined" fullWidth select margin="normal"
                    helperText="Please select your complaint type"
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
                <TextField label="Product Categories" variant="outlined" fullWidth select margin="normal"
                    helperText="Please select the product category"
                    defaultValue={""}>
                    {
                        commonData?.categories?.length ? commonData.categories.map(itm => (
                            <MenuItem key={itm.label} value={itm.value}>
                                {itm.label}
                            </MenuItem>
                        )) : null
                    }
                </TextField>
                <TextField label="Purchase Channel" variant="outlined" fullWidth select margin="normal"
                    helperText="Please select the purchase channel"

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
                        variant="contained"
                        tabIndex={-1}
                        startIcon={<UploadFileOutlinedIcon />}
                    >
                        Upload Invoice
                        <VisuallyHiddenInput type="file"
                            accept="application/pdf"
                            onChange={(event) => fileUploadHandler(event, 'invoice')} />
                    </Button>
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
                        variant="contained"
                        tabIndex={-1}
                        startIcon={<UploadFileOutlinedIcon />}
                    >
                        Upload Images
                        <VisuallyHiddenInput type="file"
                            accept="images/*"
                            multiple
                            onChange={(event) => fileUploadHandler(event, 'images')} />
                    </Button>
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
                <SubmitButton type="button" variant="contained" onClick={submitFormHandler}>
                    Submit
                </SubmitButton>
            </div>
        </form>
    </div>
}

export default Form;