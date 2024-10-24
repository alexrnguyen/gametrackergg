import { Button, Modal, Box, Typography } from "@mui/material";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

const ProfileImageModal = ({open, onClose, currentProfileImage}) => {
    const currentUserId = Cookies.get("userId");
    const [fileName, setFileName] = useState("");
    
    // TODO: Update image preview when a new file is uploaded
    useEffect(() => {

    }, [fileName]);

    const styles = {
        modal: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 750,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            borderRadius: '10px',
            boxShadow: 24,
            p: 4
        }
    };

    function isValidExtension(fileName) {
        const validExtensions = ['jpg', 'png'];
        const extension = fileName.split(".")[fileName.split(".").length - 1];
        return validExtensions.includes(extension);
    }

    // Uploads an image to the client, but does not save the image on the server
    function handleUpload(event) {
        event.preventDefault();

        // Check that a valid file was uploaded
        if (event.target.files && isValidExtension(event.target.files[0].name)) {
            const reader = new FileReader();
            reader.onload = function() {
                const imagePreview = document.getElementById('image-preview');
                imagePreview.src = reader.result;
            }
            reader.readAsDataURL(event.target.files[0]);
        }
    }

    // Saves the image to the server as the user's profile image
    async function handleSubmit(event) {
        event.preventDefault();

        // Get data from file input
        const profilePictureInput = document.getElementById("profile-picture-input");
        const file = profilePictureInput.files[0];
        console.log(file);

        // Check that a valid file was uploaded
        if (file && isValidExtension(file.name)) {
            const reader = new FileReader();
            reader.onload = async function() {
                const result = reader.result;
                const base64String = result.split("base64,")[1];
                const response = await fetch(`http://localhost:5000/api/profileImage/${currentUserId}/upload`, {
                    method: "PUT",
                    credentials: "include",
                    headers: {'Content-Type': 'text/plain'},
                    body: base64String
                });
                onClose();
            }
            reader.readAsDataURL(file);
        }
    }

    return (
        <Modal
            open={open}
            onClose={onClose}
        >
            <Box sx={styles.modal}>
                <Typography id="modal-modal-title" className='text-center' variant="h6" component="h2">
                    Edit Profile Image
                </Typography>
                <div className="flex flex-col items-center">
                    <div className="relative rounded-full w-48 h-48 border-black border-2 overflow-hidden mb-4">
                        <img src={currentProfileImage} id="image-preview" alt="Uploaded Image" />
                    </div>
                    <form className="flex flex-col" method="post" encType="multipart/form-data" onSubmit={handleSubmit}>
                        <input id="profile-picture-input" accept="image/*" type="file" className="mb-4" onChange={handleUpload} required />
                        <Button variant="contained" type="submit">Submit</Button>
                    </form>
                </div>
            </Box>
        </Modal>
    )
}

export default ProfileImageModal;