class Task {
  id: number;
  title: string;
  description: string;
  persona: string;
  group: number;
  stage: string; 

  constructor(id: number, title: string, description: string, persona: string, group: number, stage: string) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.persona = persona;
    this.group = group;
    this.stage = stage;
  }
}

export default Task;
