export interface Project {
  id: string;
  name: string;
  bpm: number;
  tracks: TrackData[];
  effects: EffectData[];
  automation: AutomationData[];
  createdAt: number;
  updatedAt: number;
}

export interface TrackData {
  deckId: string;
  url: string;
  volume: number;
  eq: { low: number; mid: number; high: number };
  hotcues: Array<{ index: number; time: number; label?: string }>;
}

export interface EffectData {
  type: string;
  wet: number;
  params: Record<string, number>;
}

export interface AutomationData {
  parameter: string;
  points: Array<{ time: number; value: number }>;
}

export class CloudStorage {
  private apiUrl: string = '/api/projects';
  private userId: string | null = null;

  setUser(userId: string): void {
    this.userId = userId;
  }

  async save(project: Project): Promise<string> {
    const response = await fetch(`${this.apiUrl}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...project, userId: this.userId })
    });

    if (!response.ok) throw new Error('Failed to save project');

    const { id } = await response.json();
    console.log(`☁️ Saved project: ${id}`);
    return id;
  }

  async load(projectId: string): Promise<Project> {
    const response = await fetch(`${this.apiUrl}/${projectId}`);
    
    if (!response.ok) throw new Error('Failed to load project');

    const project = await response.json();
    console.log(`☁️ Loaded project: ${project.name}`);
    return project;
  }

  async list(): Promise<Project[]> {
    const response = await fetch(`${this.apiUrl}?userId=${this.userId}`);
    
    if (!response.ok) throw new Error('Failed to list projects');

    return await response.json();
  }

  async delete(projectId: string): Promise<void> {
    const response = await fetch(`${this.apiUrl}/${projectId}`, {
      method: 'DELETE'
    });

    if (!response.ok) throw new Error('Failed to delete project');

    console.log(`☁️ Deleted project: ${projectId}`);
  }

  async uploadAudio(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', this.userId || 'anonymous');

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) throw new Error('Failed to upload audio');

    const { url } = await response.json();
    console.log(`☁️ Uploaded: ${url}`);
    return url;
  }

  exportLocal(project: Project): void {
    const blob = new Blob([JSON.stringify(project, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.name}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async importLocal(file: File): Promise<Project> {
    const text = await file.text();
    return JSON.parse(text);
  }
}
