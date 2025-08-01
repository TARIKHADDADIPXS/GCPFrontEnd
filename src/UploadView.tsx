import React, { useState } from "react";
import {
    Button,
    Box,
    Typography,
    Paper,
    IconButton,
    Dialog,
    DialogContent,
    DialogTitle,
    Tooltip,
    useMediaQuery,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTheme } from "@mui/material/styles";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import CloseIcon from "@mui/icons-material/Close";
import appConfig from "./config/app.config";
import { TextField } from "@mui/material";

// Import icons for different file types
import { PictureAsPdf, TableView, Slideshow, FolderZip, Article, AudioFile, PlayCircle } from "@mui/icons-material";

const UploadView: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [zoomOpen, setZoomOpen] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [location, setLocation] = useState("");
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (uploading) return; // Prevent selecting a new file while uploading
        const selected = e.target.files?.[0];
        setFile(selected || null);
        setPreview(selected ? URL.createObjectURL(selected) : null);
    };

    const handleRemoveFile = () => {
        setFile(null);
        setPreview(null);
    };

    const backendUrl = appConfig.apiBaseUrl;

    const handleUpload = async () => {
        if (!file) return;
        setUploading(true);
        try {
            const res = await fetch(`${backendUrl}get-signed-url`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ filename: file.name, fileType: file.type, location }),
            });

            const { url, metadataUrl } = await res.json();

            await fetch(url, {
                method: "PUT",
                headers: { "Content-Type": file.type },
                body: file,
            });

             // Upload metadata
            await fetch(metadataUrl, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    location,
                    timestamp: new Date().toISOString(),
                    filename: file.name,
                }),
            });
            alert("Upload successful!");
            setFile(null);
            setPreview(null);
        } catch (err) {
            alert("Upload failed!");
        } finally {
            setUploading(false);
        }
    };

    const isImage = file && file.type.startsWith("image/");
    const isAudio = file && file.type.startsWith("audio/");
    const isVideo = file && file.type.startsWith("video/");
    const isPDF = file && file.type === "application/pdf";
    const isText = file && (file.type === "text/plain" || file.type === "text/csv" || file.type === "application/json" || file.type === "application/xml" || file.type === "application/rtf" || file.type === "application/msword" || file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
    const isExcel = file && (file.type === "application/vnd.ms-excel" || file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    const isPPT = file && (file.type === "application/vnd.ms-powerpoint" || file.type === "application/vnd.openxmlformats-officedocument.presentationml.presentation");
    const isZip = file && (file.type === "application/zip" || file.type === "application/x-zip-compressed");

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight="60vh"
        >
            <Paper
                elevation={0}
                sx={{
                    p: 2,
                    borderRadius: 3,
                    width: "100%",
                    maxWidth: 400,
                    background: "rgba(255,255,255,0.85)",
                    zIndex: 2,
                    position: "relative",
                }}
            >
                <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
                    <CloudUploadIcon color="primary" sx={{ fontSize: 48, mb: 1 }} />
                    <Typography variant="h5" fontWeight={600} gutterBottom>
                        Upload Document or Photo
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 2 }}>
                        Select a file from your device. A preview will be shown below.
                    </Typography>
                    <Button
                        variant="outlined"
                        component="label"
                        startIcon={<CloudUploadIcon />}
                        sx={{ mb: 2 }}
                        fullWidth
                        disabled={uploading} // Prevent selecting new file while uploading
                    >
                        Choose File
                        <input
                            type="file"
                            hidden
                            onChange={handleFileChange}
                            disabled={uploading} // Prevent selecting new file while uploading
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
                                    width: "fit-content",
                                }}
                            >
                                {/* Preview for image files */}
                                {isImage && (
                                    <>
                                        <Tooltip title="Click to zoom">
                                            <img
                                                src={preview}
                                                alt="Preview"
                                                style={{
                                                    maxWidth: 260,
                                                    maxHeight: 180,
                                                    borderRadius: 8,
                                                    cursor: "pointer",
                                                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                                                }}
                                                onClick={() => setZoomOpen(true)}
                                            />
                                        </Tooltip>
                                        <IconButton
                                            size="small"
                                            sx={{
                                                position: "absolute",
                                                bottom: 8,
                                                right: 40,
                                                background: "#fff",
                                                boxShadow: 1,
                                            }}
                                            onClick={() => setZoomOpen(true)}
                                            aria-label="Zoom"
                                            color="primary"
                                        >
                                            <ZoomInIcon fontSize="small" />
                                        </IconButton>
                                    </>
                                )}

                                {/* For non-image files, show corresponding icons */}
                                {!isImage && (
                                    <Box display="flex" flexDirection="column" alignItems="center">
                                        {isPDF && <PictureAsPdf sx={{ fontSize: 100, color: "#f44336" }} />}
                                        {isExcel && <TableView sx={{ fontSize: 100, color: "#388e3c" }} />}
                                        {isPPT && <Slideshow sx={{ fontSize: 100, color: "#1976d2" }} />}
                                        {isZip && <FolderZip sx={{ fontSize: 100, color: "#795548" }} />}
                                        {isAudio && <AudioFile sx={{ fontSize: 100, color: "#607d8b" }} />}
                                        {isVideo && <PlayCircle sx={{ fontSize: 100, color: "#607d8b" }} />}
                                        {isText && <Article sx={{ fontSize: 100, color: "#000000" }} />}
                                        {!isPDF && !isExcel && !isPPT && !isZip && !isAudio && !isVideo && !isText && (
                                            <Typography variant="body2" color="text.secondary" align="center">
                                                {file?.name}
                                            </Typography>
                                        )}
                                        <Typography variant="body2" color="text.secondary" align="center">
                                            {file?.name}
                                        </Typography>
                                    </Box>
                                )}

                                <IconButton
                                    size="small"
                                    sx={{
                                        position: "absolute",
                                        bottom: 8,
                                        right: 8,
                                        background: "#fff",
                                        boxShadow: 1,
                                    }}
                                    onClick={handleRemoveFile}
                                    aria-label="Remove"
                                    disabled={uploading}
                                    color="error"
                                >
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                            </Paper>
                            <Dialog
                                open={zoomOpen}
                                onClose={() => setZoomOpen(false)}
                                maxWidth={false}
                                fullScreen={fullScreen}
                            >
                                <DialogTitle
                                    sx={{
                                        m: 0,
                                        p: 2,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        bgcolor: (theme) => theme.palette.primary.main,
                                        color: (theme) => theme.palette.primary.contrastText,
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
                                        background: (theme) => theme.palette.background.default,
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
                                                background: "transparent",
                                            }}
                                        />
                                    </Zoom>
                                </DialogContent>
                            </Dialog>
                        </Box>
                    )}

                    <TextField
                        label="Location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        variant="outlined"
                        fullWidth
                        disabled={uploading}
                        sx={{ mt: 2 }}
                    />
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
