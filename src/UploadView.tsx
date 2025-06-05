import React, { useState } from "react";
import { Button, Box, Typography, Paper, IconButton, Dialog, DialogContent, DialogTitle, Tooltip, useMediaQuery } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTheme } from "@mui/material/styles";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import CloseIcon from "@mui/icons-material/Close";

interface UploadViewProps {
    user: any;
}

const UploadView: React.FC<UploadViewProps> = ({ user }) => {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [zoomOpen, setZoomOpen] = useState(false);
    const [uploading, setUploading] = useState(false);

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (uploading) return;
        const selected = e.target.files?.[0];
        setFile(selected || null);
        setPreview(selected ? URL.createObjectURL(selected) : null);
    };

    const handleRemoveFile = () => {
        setFile(null);
        setPreview(null);
    };

    const handleUpload = async () => {
        if (!file) return;
        setUploading(true);
        try {
            // Getting the right Url where to store
            const res = await fetch("http://localhost:4000/api/get-signed-url", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ filename: file.name }) 
            });

            // Upload the image to the bucket storage
            const { url } = await res.json();
            await fetch(url, {
                method: "PUT",
                headers: {     "Content-Type": "application/octet-stream" },
                body: file
            });
            alert("Upload successful!");
        } catch (err) {
            alert("Upload failed!");
        } finally {
            setUploading(false);
        }
    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight="60vh"
            sx={{
                backgroundImage:
                    "url('https://assets.paperjam.lu/images/articles/plus-economique-au-plus-chic-s/0.5/0.5/640/426/667445.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                width: "100%",
                height: "100vh",
                p: 2,
                m: 0,
                overflow: "hidden",
            }}
        >
            <Box
                sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100vh",
                    bgcolor: "#ffffffe6",
                    zIndex: 1,
                }}
            />
            <Paper elevation={0} sx={{
                p: 2, borderRadius: 3, width: "100%", maxWidth: 400,
                background: "rgba(255,255,255,0.85)",
                zIndex: 2,
                position: "relative",
            }}>
                <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
                    <CloudUploadIcon color="primary" sx={{ fontSize: 48, mb: 1 }} />
                    <Typography variant="h5" fontWeight={600} gutterBottom>
                        Upload Document or Photo
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 2 }}>
                        Select an image or PDF from your device or take a new photo. Images will be previewed below.
                    </Typography>
                    <Button
                        variant="outlined"
                        component="label"
                        startIcon={<CloudUploadIcon />}
                        sx={{ mb: 2 }}
                        fullWidth
                        disabled={uploading}
                    >
                        Choose File
                        <input
                            type="file"
                            accept="image/*,application/pdf"
                            capture="environment"
                            hidden
                            onChange={handleFileChange}
                            disabled={uploading}
                        />
                    </Button>
                    {preview && (
                        <Box
                            mt={2}
                            display="flex"
                            flexDirection="column"
                            alignItems="center"
                            width="100%"
                        >
                            <Paper
                                elevation={1}
                                sx={{
                                    p: 1,
                                    borderRadius: 2,
                                    background: "#fff",
                                    position: "relative",
                                    width: "fit-content"
                                }}
                            >
                                <Tooltip title="Click to zoom">
                                    <img
                                        src={preview}
                                        alt="Preview"
                                        style={{
                                            maxWidth: 260,
                                            maxHeight: 180,
                                            borderRadius: 8,
                                            cursor: "pointer",
                                            boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
                                        }}
                                        onClick={() => setZoomOpen(true)}
                                    />
                                </Tooltip>
                                {/* Button need to be filled */}
                                <IconButton
                                    size="small"
                                    sx={{
                                        position: "absolute",
                                        bottom: 8,
                                        right: 40,
                                        background: "#fff",
                                        boxShadow: 1
                                    }}
                                    onClick={() => setZoomOpen(true)}
                                    aria-label="Zoom"
                                    color="primary"
                                >
                                    <ZoomInIcon fontSize="small" />
                                </IconButton>
                                <IconButton
                                    size="small"
                                    sx={{
                                        position: "absolute",
                                        bottom: 8,
                                        right: 8,
                                        background: "#fff",
                                        boxShadow: 1
                                    }}
                                    onClick={handleRemoveFile}
                                    aria-label="Remove"
                                    disabled={uploading}
                                    color="error"
                                >
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                            </Paper>
                            <Dialog open={zoomOpen} onClose={() => setZoomOpen(false)} maxWidth={false} fullScreen={fullScreen}>
                                <DialogTitle
                                    sx={{
                                        m: 0,
                                        p: 2,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        bgcolor: (theme) => theme.palette.primary.main,
                                        color: (theme) => theme.palette.primary.contrastText
                                    }}
                                >
                                    Preview
                                    <IconButton
                                        aria-label="close"
                                        onClick={() => setZoomOpen(false)}
                                        sx={{
                                            color: (theme) => theme.palette.primary.contrastText,
                                            ml: 2,
                                        }}
                                        size="large"
                                    >
                                        <CloseIcon />
                                    </IconButton>
                                </DialogTitle>
                                <DialogContent
                                    sx={{
                                        p: 0,
                                        background: (theme) => theme.palette.background.default
                                    }}
                                >
                                    <Zoom>
                                        <img
                                            src={preview}
                                            alt="Zoomed Preview"
                                            style={{
                                                maxWidth: "100%",
                                                maxHeight: "100%",
                                                display: "block",
                                                margin: "auto",
                                                background: "transparent"
                                            }}
                                        />
                                    </Zoom>
                                </DialogContent>
                            </Dialog>
                        </Box>
                    )}
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleUpload}
                        disabled={!file || uploading}
                        sx={{ mt: 3, fontWeight: 600 }}
                        fullWidth
                    >
                        {uploading ? "Uploading..." : "Upload"}
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default UploadView;