import { Table, TableHead, TableRow, TableCell, TableSortLabel, TableBody, Button } from "@mui/material";
import { useState } from "react";
import { FileDownload, Info } from "@mui/icons-material";

import ArtefactDetails from "../components/artefactDetails";
import { downloadArtefact, ArtefactVersion} from "../actions";

interface ArtefactVersionsListProps {
    artefactName: string;
    artefactVersions: {[key: string]: ArtefactVersion[]};
    isUserInGroup: boolean;
  }

export default function ArtefactVersionsList({artefactName, artefactVersions, isUserInGroup}: ArtefactVersionsListProps) {

    const [orderBy, setOrderBy] = useState<"author" | "createdAt" | "tag">("createdAt");
    const [orderDirection, setOrderDirection] = useState<"asc" | "desc">("asc");

    const handleSort = (column: "author" | "createdAt" | "tag") => {
        const isAsc = orderBy === column && orderDirection === "asc";
        setOrderBy(column);
        setOrderDirection(isAsc ? "desc" : "asc");
    };

    // Holds the clicked artefact version
    const [selectedVersion, setSelectedVersion] = useState<any>(null); 

    const [artefactDescriptionModalOpen, setArtefactDescriptionModalOpen] = useState(false);

    const handleOpenArtefactDescriptionModal = (version: any) => {
    setSelectedVersion(version);
    setArtefactDescriptionModalOpen(true);
    };

    const handleCloseArtefactDescriptionModal = () => {
    setSelectedVersion(null);
    setArtefactDescriptionModalOpen(false);
    };

    return (
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
                {artefactVersions[artefactName]
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
                    return 0;
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
                                downloadArtefact(artefactName, version.tags?.[0] || "latest")
                            }
                            disabled={!isUserInGroup}
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

            <ArtefactDetails 
                open={artefactDescriptionModalOpen} 
                onClose={handleCloseArtefactDescriptionModal} 
                selectedVersion={selectedVersion} 
            />
        </Table>
    )
}