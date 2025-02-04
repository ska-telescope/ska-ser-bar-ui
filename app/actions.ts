//"use server";

export interface Artefact {
    name: string;
    artifactCount: string;
    creationTime: string;
    id: string;
    projectId: string;
    pullCount: string;
    updateTime: string;
}

export interface ArtefactVersion {
    name: string;
    digest: string;
    size: number;
    tags: string[];
    annotations: Record<string, string> | null;
    created_at: string;
}

const API_BASE_URL = "http://localhost:8000/binary_artefacts/v1"; // Change this to your actual API URL

export async function fetchArtefacts(page: number = 1, pageSize: number = 10): Promise<{ artefacts: Artefact[]; total: number }> {
    try {
        const response = await fetch(`${API_BASE_URL}/artefacts?page=${page}&page_size=${pageSize}`);
        if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        const artefacts = data
            .filter((artefact: any) => artefact.name) // Ensures 'name' exists before mapping
            .map((artefact: any) => ({
                name: artefact.name,
                artifactCount: artefact.artifact_count,
                creationTime: artefact.creation_time,
                id: artefact.id,
                projectId: artefact.project_id,
                pullCount: artefact.pull_count,
                updateTime: artefact.update_time,
            }));
            
        // Extract X-Total-Count from headers
        const total = parseInt(response.headers.get("X-Total-Count") || "0", 10);

        return { artefacts, total };
    } catch (error) {
        console.error("Failed to fetch artefacts:", error);
        throw error;
    }
}

export async function fetchArtefactVersions(artefact_name: string, page: number = 1, pageSize: number = 100): Promise<{ artefact_versions: ArtefactVersion[] }> {
    try {
        const response = await fetch(`${API_BASE_URL}/artefacts/${artefact_name}?page=${page}&page_size=${pageSize}`);
        if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        const artefact_versions = data
            .filter((artefact_version: any) => artefact_version.digest) // Ensures 'digest' exists before mapping
            .map((artefact_version: any) => ({
                name: artefact_name,
                digest: artefact_version.digest,
                size: artefact_version.size,
                tags: artefact_version.tags ? artefact_version.tags.map((tag: any) => tag.name) : [], // Extract tag names
                annotations: artefact_version.annotations || null,
                created_at: artefact_version.push_time
            }));

        return { artefact_versions };
    } catch (error) {
        console.error("Failed to fetch artefact versions:", error);
        throw error;
    }
}

export const downloadArtefact = (artefactName: string, tag: string): void => {
    const downloadUrl = `${API_BASE_URL}/artefacts/${artefactName}/tags/${tag}?format=zip`;
    window.open(downloadUrl, "_blank"); // Opens download in a new tab
  };

  export const downloadArtefactFile = (artefactName: string, tag: string, fileName: string): void => {
    const downloadUrl = `${API_BASE_URL}/artefacts/${artefactName}/tags/${tag}/assets/${fileName}`;
    window.open(downloadUrl, "_blank"); // Opens download in a new tab
  };