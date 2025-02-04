import { Modal, List, ListItem, ListItemText, Button, ListItemButton } from "@mui/material";
import { ArtefactVersion, downloadArtefactFile } from "../actions";
import { FilePresent } from "@mui/icons-material";

interface ArtefactDetailsProps {
  open: boolean;
  onClose: () => void;
  selectedVersion: ArtefactVersion;
}

export default function ArtefactDetails({ open, onClose, selectedVersion }: ArtefactDetailsProps) {
  if (!selectedVersion) return null;

  return (
    <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="artefact-details-title"
        aria-describedby="artefact-details-description"
    >
        <div className="flex h-full w-full items-center justify-center">
            <div className="mx-8 w-full max-w-3xl rounded-xl bg-white md:px-0 md:py-4">
                <div className="flex h-full w-full flex-col justify-between space-y-4 px-6 py-2">
                    {selectedVersion && (
                        <>
                        <h2 id="artefact-details-title" className="text-xl font-bold mb-4">
                            {selectedVersion.name}:{selectedVersion.tags}
                        </h2>
                        <p>
                            <strong>Digest:</strong> {selectedVersion.digest}
                        </p>
                        <p>
                            <strong>Tags:</strong>{" "}
                            {selectedVersion.tags?.length > 0 ? selectedVersion.tags.join(", ") : "No Tag"}
                        </p>
                        <p>
                            <strong>Author:</strong> {selectedVersion.annotations?.name || "Unknown"}
                        </p>
                        
                        <p className="mt-2 font-semibold">Annotations:</p>
                            <List
                            sx={{
                                maxHeight: 200,
                                overflowY: "auto",
                                bgcolor: "background.paper",
                                borderRadius: 2,
                                border: "1px solid #ddd",
                                boxShadow: 2,
                            }}
                            >
                            {selectedVersion.annotations ? (
                                Object.entries(selectedVersion.annotations)
                                .filter(([key]) => key !== "included-files") // Exclude "included-files"
                                .map(([key, value], index) => (
                                    <ListItem
                                    key={index}
                                    sx={{
                                        padding: "10px",
                                        borderBottom: "1px solid #eee",
                                        "&:last-child": { borderBottom: "none" },
                                    }}
                                    >
                                    <ListItemText
                                        primary={key}
                                        secondary={String(value)}
                                        primaryTypographyProps={{ fontWeight: "bold", fontSize: "0.9rem" }}
                                        secondaryTypographyProps={{ fontSize: "0.85rem", color: "text.secondary" }}
                                    />
                                    </ListItem>
                                ))
                            ) : (
                                <ListItem>
                                <ListItemText primary="No annotations available" sx={{ color: "#888" }} />
                                </ListItem>
                            )}
                            </List>

                        <p className="mt-2 font-semibold">Included Files:</p>
                            <List
                            sx={{
                                maxHeight: 200,
                                overflowY: "auto",
                                bgcolor: "background.paper",
                                borderRadius: 2,
                                border: "1px solid #ddd",
                                boxShadow: 2,
                            }}
                            >
                            {selectedVersion.annotations?.["included-files"] ? (
                                selectedVersion.annotations["included-files"].split("; ").map((fileName: string, index: number) => (
                                <ListItemButton
                                    key={index}
                                    onClick={() => downloadArtefactFile(selectedVersion.name, selectedVersion.tags[0], fileName)}
                                    sx={{
                                    "&:hover": { backgroundColor: "#f5f5f5" },
                                    padding: "10px",
                                    borderBottom: "1px solid #eee",
                                    }}
                                >
                                    <FilePresent color="primary" sx={{ marginRight: 1 }} />
                                    <ListItemText primary={fileName} />
                                </ListItemButton>
                                ))
                            ) : (
                                <ListItem>
                                <ListItemText primary="No files included" sx={{ color: "#888" }} />
                                </ListItem>
                            )}
                            </List>
                        
                        <Button
                            variant="contained"
                            color="secondary"
                            fullWidth
                            sx={{ mt: 2 }}
                            onClick={onClose}
                        >
                            Close
                        </Button>
                        </>
                    )}
                </div>
            </div>
        </div>
    </Modal>
  );
}