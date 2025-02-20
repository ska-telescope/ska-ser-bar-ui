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

const API_BASE_URL = "/proxy/api/v1";

export async function fetchArtefacts(page: number = 1, pageSize: number = 10): Promise<{ artefacts: Artefact[]; total: number }> {
    try {
        const response = await fetch(`${API_BASE_URL}/artefacts`);
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

export async function fetchArtefactVersions(artefactName: string, page: number = 1, pageSize: number = 100): Promise<{ artefactVersions: ArtefactVersion[] }> {
    try {
        const response = await fetch(`${API_BASE_URL}/artefacts/${artefactName}?page=${page}&page_size=${pageSize}`);
        if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        const artefactVersions = data
            .filter((artefactVersion: any) => artefactVersion.digest) // Ensures 'digest' exists before mapping
            .map((artefactVersion: any) => ({
                name: artefactName,
                digest: artefactVersion.digest,
                size: artefactVersion.size,
                tags: artefactVersion.tags ? artefactVersion.tags.map((tag: any) => tag.name) : [], // Extract tag names
                annotations: artefactVersion.annotations || null,
                created_at: artefactVersion.push_time
            }));

        return { artefactVersions };
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

export async function uploadArtefact(
    artefactName: string,
    tagName: string,
    files: File[],
    annotations: { key: string; value: string }[],
    authorName: string,
    setUploadProgress?: (progress: number) => void
  ): Promise<{ status: number; body: any }> {
    const formData = new FormData();
  
    // Append files to FormData
    files.forEach((file) => {
      formData.append("files", file);
    });
    
    const annotationsDict: Record<string, string> = annotations.reduce(
        (acc, { key, value }) => {
          acc[key] = value;
          return acc;
        },
        {} as Record<string, string>
    );

    if (!Object.hasOwn(annotationsDict,"name")) {
        annotationsDict.name = authorName;
    }

    // Append annotations as a JSON string
    formData.append("annotations", JSON.stringify(annotationsDict));

    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${API_BASE_URL}/artefacts/${artefactName}/tags/${tagName}`);
  
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && setUploadProgress) {
        const percentComplete = (event.loaded / event.total) * 100;
        setUploadProgress(percentComplete);
      }
    };
  
    return new Promise((resolve, reject) => {
        xhr.onload = () => {
          resolve({ status: xhr.status, body: xhr.responseText });
        };
        xhr.onerror = () => {
            reject(new Error(`Request failed with status ${xhr.status}: ${xhr.statusText}`));
        };
        xhr.send(formData);
    });
  }