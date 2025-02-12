import { useState } from "react";

import {
  Button,
  TextField,
  Divider,
  IconButton,
  Typography,
  LinearProgress,
  CircularProgress,
} from "@mui/material";

import { Add, Delete, FolderOpen } from "@mui/icons-material";
import { uploadArtefact } from "../actions";

export default function BinaryUploader({
  closeCallback,
}: {
  closeCallback: Function;
}) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [annotations, setAnnotations] = useState<{ key: string; value: string }[]>([{ key: "", value: "" }]);
  const [artefactName, setArtefactName] = useState<string>("");
  const [tagName, setTagName] = useState<string>("");

  // State for progress tracking
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // Handle File Selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles([...selectedFiles, ...Array.from(event.target.files)]);
    }
  };

  // Remove a File
  const removeFile = (index: number) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  // Handle Adding a New Annotation Row
  const addAnnotation = () => {
    setAnnotations([...annotations, { key: "", value: "" }]);
  };

  // Handle Annotation Input Change
  const handleAnnotationChange = (index: number, field: "key" | "value", value: string) => {
    const newAnnotations = [...annotations];
    newAnnotations[index][field] = value;
    setAnnotations(newAnnotations);
  };

  // Handle Removing an Annotation
  const removeAnnotation = (index: number) => {
    setAnnotations(annotations.filter((_, i) => i !== index));
  };

  // Handle Upload Button Click
  const handleUpload = async () => {
    if (!artefactName || !tagName || selectedFiles.length === 0) {
      alert("Please fill in all fields and select at least one file.");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const response = await uploadArtefact(artefactName, tagName, selectedFiles, annotations, setUploadProgress);
      if (response.status === 201) {
        alert(`Artefact "${artefactName}:${tagName}" uploaded successfully!`);
        setSelectedFiles([]); // Clear file selection after successful upload
      } else if (response.status === 409) {
        alert(`Conflict: The artefact "${artefactName}:${tagName}" already exists. Please use a different tag.`);
      } else {
        alert("Unexpected response received. Please check the console for details.");
        console.error("Unexpected Response:", response);
      }
    } catch (error) {
      console.error("Upload failed:", error);
      alert("An unexpected error occurred. Please try again later.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="mx-8 w-full max-w-3xl rounded-xl bg-white md:px-0 md:py-4">
      <div className="flex h-full w-full flex-col justify-between space-y-4 px-6 py-2">
        <p className="mx-auto text-center text-lg font-semibold text-ska-secondary">
          Upload
        </p>
        <div className="flex flex-col justify-between space-y-2 text-xs">          
          <div className="flex w-full items-center justify-center">
            <Divider className="w-32 bg-ska-secondary"></Divider>
          </div>

          {/* Name Input */}
          <div className="form_group">
            <TextField
              label="Artefact Name"
              placeholder="Name"
              variant="outlined"
              size="small"
              className="grow"
              value={artefactName}
              onChange={(e) => setArtefactName(e.target.value)}
            />
          </div>
          {/* Tag Input */}
          <div className="form_group">
            <TextField
              label="Artefact Version"
              placeholder="Version"
              variant="outlined"
              size="small"
              className="grow"
              value={tagName}
              onChange={(e) => setTagName(e.target.value)}
            />
          </div>
          
          <Divider className="pt-2"></Divider>
          
          {/* File Input Button Group */}
          <div className="flex border rounded-lg overflow-hidden">
            <input
              type="file"
              hidden
              multiple
              id="file-upload"
              onChange={handleFileChange}
            />
            <label htmlFor="file-upload" className="flex w-full">
              <button className="flex-1 bg-gray-200 px-4 py-2 text-left text-gray-600">
                {selectedFiles.length > 0
                  ? `${selectedFiles.length} files selected`
                  : "No file chosen"}
              </button>
              <Button
                variant="contained"
                component="label"
                htmlFor="file-upload"
                className="flex items-center space-x-2 bg-sky-500 hover:bg-sky-600 text-white"
              >
                <FolderOpen />
                Select a File
              </Button>
            </label>
          </div>

          {/* List of Selected Files */}
          {selectedFiles.length > 0 && (
            <div className="space-y-2">
              {selectedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-md bg-white p-3 shadow-sm border border-gray-300"
                >
                  <Typography variant="body2" className="truncate font-medium text-gray-700">
                    {file.name}
                  </Typography>
                  <IconButton onClick={() => removeFile(index)} color="error">
                    <Delete />
                  </IconButton>
                </div>
              ))}
            </div>
          )}
          
          <Divider className="pt-2"></Divider>
          <p className="pb-2 text-sm font-bold">Custom Annotations</p>

          {/* Dynamic Annotation Inputs */}
          {annotations.map((annotation, index) => (
            <div key={index} className="flex space-x-2">
              <TextField
                label="Key"
                variant="outlined"
                size="small"
                value={annotation.key}
                onChange={(e) => handleAnnotationChange(index, "key", e.target.value)}
              />
              <TextField
                label="Value"
                variant="outlined"
                size="small"
                value={annotation.value}
                onChange={(e) => handleAnnotationChange(index, "value", e.target.value)}
              />
              {annotations.length > 1 && (
                <IconButton size="small" onClick={() => removeAnnotation(index)}>
                  <Delete fontSize="small" />
                </IconButton>
              )}
            </div>
          ))}

          <Button variant="outlined" startIcon={<Add />} onClick={addAnnotation} className="mt-2">
            Add Annotation
          </Button>
        </div>
        
        {isUploading && <LinearProgress variant="determinate" value={uploadProgress} />}

        <div className="flex justify-between">
          <Button variant="outlined" onClick={() => closeCallback()} disabled={isUploading}>
            Cancel
          </Button>
          <Button 
            variant="contained"
            color="primary"
            onClick={handleUpload}
            disabled={!artefactName || !tagName || selectedFiles.length === 0 || isUploading}
          >
            {isUploading ? <CircularProgress size={24} color="inherit" /> : "Upload"}
          </Button>
        </div>
      </div>
    </div>
  );
}
