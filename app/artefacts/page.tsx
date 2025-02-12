"use client";
import { useSession } from "next-auth/react";
import Container from "../components/container";
import Navbar from "../components/navbar";
import {
  Button,
  Modal,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableSortLabel,
  TableBody,
} from "@mui/material";
import {
  UploadOutlined,
  ExpandMore,
  FolderCopy,
  FileDownload,
  Info,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import BinaryUploader from "../components/binaryUploader";
import ArtefactDetails from "../components/artefactDetails";
import { fetchArtefacts, Artefact, fetchArtefactVersions, downloadArtefact} from "../actions";

export default function Artefacts() {

  const { data: session, status } = useSession();

  const [modalOpened, setModalOpened] = useState(false);
  const handleOpen = () => setModalOpened(true);
  const handleClose = () => setModalOpened(false);

  const [artefacts, setArtefacts] = useState<Artefact[]>([]);
  const [totalArtefacts, setTotalArtefacts] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchArtefacts(page, 10)
      .then((data) => {
        setArtefacts(data.artefacts);
        setTotalPages(Math.ceil(data.total / 10)); // Assuming 10 per page
        setTotalArtefacts(data.total); 
        console.log("Artefacts:", data.artefacts, "Total:", data.total);
      })
      .catch((error) => console.error("Error fetching artefacts:", error));
  }, [page]);

  const [expanded, setExpanded] = useState<string | false>(false);
  const [orderBy, setOrderBy] = useState<"author" | "createdAt" | "tag">("createdAt");
  const [orderDirection, setOrderDirection] = useState<"asc" | "desc">("asc");
  // State to store artefact versions for each artefact
  const [artefactVersions, setArtefactVersions] = useState<{
    [key: string]: any[];
  }>({});
  // Holds the clicked artefact version
  const [selectedVersion, setSelectedVersion] = useState<any>(null); 

  // Handle accordion expansion
  const handleAccordionChange = (artefactName: string) => async () => {
    const isExpanding = expanded !== artefactName;
    setExpanded(isExpanding ? artefactName : false);

    if (isExpanding && !artefactVersions[artefactName]) {
      try {
        const { artefact_versions } = await fetchArtefactVersions(artefactName);
        setArtefactVersions((prev) => ({
          ...prev,
          [artefactName]: artefact_versions,
        }));
      } catch (error) {
        console.error("Error fetching artefact versions:", error);
      }
    }
  };

  const handleSort = (column: "author" | "createdAt" | "tag") => {
    const isAsc = orderBy === column && orderDirection === "asc";
    setOrderBy(column);
    setOrderDirection(isAsc ? "desc" : "asc");
  };

  const [artefactDescriptionModalOpen, setArtefactDescriptionModalOpen] = useState(false);

  const handleOpenArtefactDescriptionModal = (version: any) => {
    setSelectedVersion(version);
    setArtefactDescriptionModalOpen(true);
  };

  const handleCloseArtefactDescriptionModal = () => {
    setSelectedVersion(null);
    setArtefactDescriptionModalOpen(false);
  };

  if (status === "loading") return <p>Loading...</p>;
  if (!session) return <p>Access Denied. Please log in.</p>;

  return (
    <main>
      <Modal open={modalOpened} onClose={handleClose}>
        <div className="flex h-full w-full items-center justify-center">
          <BinaryUploader closeCallback={handleClose}></BinaryUploader>
        </div>
      </Modal>
      <Container contain={true} className="flex flex-col space-y-2">
        <Navbar className="h-12 w-full"></Navbar>
        <div className="flex w-full flex-col justify-between space-y-4 px-2 text-black">
          <div className="mt-2 flex w-full items-center justify-between md:px-4">
            <div className="flex items-center space-x-2">
              <p className="text-xl">Artefacts</p>
              <p className="text-base">{totalArtefacts}</p>
            </div>
            <Button
              variant="contained"
              endIcon={<UploadOutlined />}
              onClick={handleOpen}
            >
              Upload
            </Button>
          </div>

          {/* Render Artefacts */}
          <div className="mt-4 px-4">
            {artefacts.length > 0 ? (
              artefacts.map((artefact) => (
                <Accordion
                  key={artefact.name}
                  expanded={expanded === artefact.name}
                  onChange={handleAccordionChange(artefact.name)}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMore />}
                    aria-controls={`panel-${artefact.name}-content`}
                    id={`panel-${artefact.name}-header`}
                  >
                    <div className="flex items-center space-x-2">
                      <FolderCopy />
                      <p className="text-xl font-bold">{artefact.name}</p>
                      <p className="text-xs">{artefact.artifactCount}</p>
                    </div>
                  </AccordionSummary>
                  
                  <AccordionDetails>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Details</TableCell>
                          <TableCell>
                            <TableSortLabel
                              active={orderBy === "tag"}
                              direction={orderBy === "tag" ? orderDirection : "asc"}
                              onClick={() => handleSort("tag")}
                            >
                              Tag
                            </TableSortLabel>
                          </TableCell>
                          <TableCell>
                            <TableSortLabel
                              active={orderBy === "author"}
                              direction={orderBy === "author" ? orderDirection : "asc"}
                              onClick={() => handleSort("author")}
                            >
                              Author
                            </TableSortLabel>
                          </TableCell>
                          <TableCell>
                            <TableSortLabel
                              active={orderBy === "createdAt"}
                              direction={orderBy === "createdAt" ? orderDirection : "asc"}
                              onClick={() => handleSort("createdAt")}
                            >
                              Created At
                            </TableSortLabel>
                          </TableCell>
                          <TableCell>Download</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {artefactVersions[artefact.name]
                          ?.sort((a, b) => {
                            if (orderBy === "author") {
                              return orderDirection === "asc"
                                ? (a.annotations?.name || "").localeCompare(b.annotations?.name || "")
                                : (b.annotations?.name || "").localeCompare(a.annotations?.name || "");
                            }
                            if (orderBy === "tag") {
                              return orderDirection === "asc"
                                ? (a.tags?.[0] || "").localeCompare(b.tags?.[0] || "")
                                : (b.tags?.[0] || "").localeCompare(a.tags?.[0] || "");
                            }
                            if (orderBy === "createdAt") {
                              return orderDirection === "asc"
                                ? (a.created_at || "").localeCompare(b.created_at || "")
                                : (b.created_at || "").localeCompare(a.created_at || "");
                            }
                          })
                          .map((version) => (
                            <TableRow key={version.digest}>
                              <TableCell>
                                  <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={<Info />}
                                    onClick={() => handleOpenArtefactDescriptionModal(version)}
                                  >
                                    See more
                                  </Button>
                              </TableCell>
                              <TableCell>
                                {version.tags?.length > 0 ? version.tags.join(", ") : "No Tag"}
                              </TableCell>
                              <TableCell>{version.annotations?.name || "Unknown"}</TableCell>
                              <TableCell>{version.created_at || "Unknown"}</TableCell>
                              <TableCell>
                                {version.annotations?.["included-files"] ? (
                                  <Button
                                    variant="contained"
                                    color="secondary"
                                    startIcon={<FileDownload />}
                                    onClick={() =>
                                      downloadArtefact(artefact.name, version.tags?.[0] || "latest")
                                    }
                                  >
                                    Download
                                  </Button>
                                ) : (
                                  <Button variant="contained" color="secondary" disabled>
                                    No File
                                  </Button>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </AccordionDetails>
                </Accordion>
              ))
            ) : (
              <p>No artefacts found.</p>
            )}
          </div>
          
          {/* Pagination Controls */}
          <div className="mt-2 flex w-full items-center justify-between md:px-4">
            <Button
              variant="contained"
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
            >
              Previous
            </Button>
            <p>
              Page {page} of {totalPages}
            </p>
            <Button
              variant="contained"
              disabled={page === totalPages}
              onClick={() => setPage((prev) => prev + 1)}
            >
              Next
            </Button>
          </div>
          
          <ArtefactDetails 
            open={artefactDescriptionModalOpen} 
            onClose={handleCloseArtefactDescriptionModal} 
            selectedVersion={selectedVersion} 
          />;
          
        </div>
      </Container>
    </main>
  );
}
