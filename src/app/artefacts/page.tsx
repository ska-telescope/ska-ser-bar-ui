"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Container from "../components/container";
import Navbar from "../components/navbar";
import {
  Button,
  Modal,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableCell,
  TableRow,
  Paper,
  TablePagination,
  TextField,
  Collapse,
} from "@mui/material";
import {
  UploadOutlined,
  ExpandMore,
  Info
} from "@mui/icons-material";
import { useEffect, useState, Fragment, ChangeEvent } from "react";
import BinaryUploader from "../components/binaryUploader";
import ArtefactVersionsList from "../components/artefactVersionsList";
import { fetchArtefacts, Artefact, fetchArtefactVersions, ArtefactVersion } from "../actions";

export default function Artefacts() {

  const { data: session, status } = useSession();
  const router = useRouter();

  const [modalOpened, setModalOpened] = useState(false);
  const handleOpen = () => setModalOpened(true);
  const handleClose = () => setModalOpened(false);

  const [artefacts, setArtefacts] = useState<Artefact[]>([]);
  const [totalArtefacts, setTotalArtefacts] = useState(1);
  const [page, setPage] = useState(0);

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchArtefacts()
      .then((data) => {
        setArtefacts(data.artefacts);
        setTotalArtefacts(data.total);
      })
      .catch((error) => console.error("Error fetching artefacts:", error));
  }, []);

  useEffect(() => {
    if (!(status === "authenticated" && session)) {
      router.push("/");
    }
  }, [status, session, router]);

  const [expandedArtefact, setExpandedArtefact] = useState<string | null>(null);
  // State to store artefact versions for each artefact
  const [artefactVersions, setArtefactVersions] = useState<{
    [key: string]: ArtefactVersion[];
  }>({});
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Handle search input change
  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0); // Reset to first page when searching
  };

  // Handle artefact expansion and version fetching
  const handleViewDetails = async (artefactName: string) => {
    const isExpanding = expandedArtefact !== artefactName;
    setExpandedArtefact(isExpanding ? artefactName : null);

    if (isExpanding && !artefactVersions[artefactName]) {
      try {
        const { artefactVersions } = await fetchArtefactVersions(artefactName);
        setArtefactVersions((prev) => ({
          ...prev,
          [artefactName]: artefactVersions,
        }));
      } catch (error) {
        console.error("Error fetching artefact versions:", error);
      }
    }
  };

  // Filter artefacts based on search input
  const filteredArtefacts = artefacts.filter((artefact) =>
    artefact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginate artefacts
  const paginatedArtefacts = filteredArtefacts.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  const isUserInGroup = session?.user?.groups_direct?.includes("ska-telescope");

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
              disabled={!isUserInGroup}
            >
              Upload
            </Button>
          </div>

          <Paper elevation={3} className="p-6 rounded-lg shadow-md">
            {/* Search Bar */}
            <TextField
              label="Search Artefacts"
              variant="outlined"
              fullWidth
              size="small"
              className="mb-4"
              value={searchTerm}
              onChange={handleSearchChange}
            />

            {/* Artefacts Table */}
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><p className="text-m font-bold text-left">Artefact Name</p></TableCell>
                    <TableCell><p className="text-m font-bold text-left">Artefact Count</p></TableCell>
                    <TableCell><p className="text-m font-bold text-left">Actions</p></TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                {!isUserInGroup ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      User not allowed to list artefacts
                    </TableCell>
                  </TableRow>
                ) : paginatedArtefacts.length > 0 ? (
                      paginatedArtefacts.map((artefact) => (
                        <Fragment key={artefact.name}>
                          <TableRow>
                            {/* Artefact Name */}
                            <TableCell align="left">{artefact.name}</TableCell>

                            {/* Versions Count */}
                            <TableCell align="left">{artefact.artifactCount}</TableCell>

                            {/* Expand/Collapse Button */}
                            <TableCell align="left">
                              <Button
                                onClick={() => handleViewDetails(artefact.name)}
                                aria-label="expand row"
                                startIcon={<Info />}
                                disabled={!isUserInGroup}
                              >
                                <ExpandMore
                                  style={{
                                    transform: expandedArtefact === artefact.name ? "rotate(180deg)" : "rotate(0deg)",
                                  }}
                                />
                              </Button>
                            </TableCell>
                          </TableRow>

                          {/* Artefact Versions List (Collapsible) */}
                          <TableRow>
                            <TableCell colSpan={3} style={{ paddingBottom: 0, paddingTop: 0 }}>
                              <Collapse in={expandedArtefact === artefact.name} timeout="auto" unmountOnExit>
                                <ArtefactVersionsList
                                  artefactName={artefact.name}
                                  artefactVersions={artefactVersions}
                                  isUserInGroup={isUserInGroup}
                                />
                              </Collapse>
                            </TableCell>
                          </TableRow>
                        </Fragment>
                      ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} align="center">
                        No artefacts found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredArtefacts.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(_, newPage) => setPage(newPage)}
              onRowsPerPageChange={(event) => {
                setRowsPerPage(parseInt(event.target.value, 10));
                setPage(0);
              }}
            />
          </Paper>
        </div>
      </Container>
    </main>
  );
}
