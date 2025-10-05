export interface Skill {
  id: string;
  name: string;
}

export interface CreateSkillDTO {
  name: string;
}

export interface UserSkill {
  userId: string;
  skillId: string;
}
