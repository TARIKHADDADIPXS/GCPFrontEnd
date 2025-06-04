import React, { useState } from "react";
import { Button, Box, Typography } from "@mui/material";

interface UploadViewProps {
  user: any;
}

const UploadView: React.FC<UploadViewProps> = ({ user }) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    setFile(selected || null);
    setPreview(selected ? URL.createObjectURL(selected) : null);
  };

  const handleUpload = async () => {
    if (!file) return;
    const res = await fetch("/api/get-signed-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename: file.name, token: user.credential })
    });
    const { url } = await res.json();
    await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": file.type },
      body: file
    });
    alert("Upload successful!");
  };

  return (
    <Box>
      <Typography variant="h5">Upload Document or Photo</Typography>
      <input
        type="file"
        accept="image/*,application/pdf"
        capture="environment"
        onChange={handleFileChange}
      />
      {preview && (
        <Box mt={2}>
          <img src={preview} alt="Preview" style={{ maxWidth: 300 }} />
        </Box>
      )}
      <Button
        variant="contained"
        color="primary"
        onClick={handleUpload}
        disabled={!file}
        sx={{ mt: 2 }}
      >
        Upload
      </Button>
    </Box>
  );
};

export default UploadView;