import bunnyPreview from "./assets/bunny-preview.png";
import capybaraPreview from "./assets/capybara-preview.png";
import catPreview from "./assets/cat-preview.png";
import foxPreview from "./assets/fox-preview.png";
import parrotPreview from "./assets/parrot-preview.png";
import turtlePreview from "./assets/turtle-preview.png";

export const ANIAMLS = [
  { animal: "Bunny", requiredLvl: 0, image: bunnyPreview },
  { animal: "Fox", requiredLvl: 0, image: foxPreview },
  { animal: "Parrot", requiredLvl: 5, image: parrotPreview },
  { animal: "Cat", requiredLvl: 15, image: catPreview },
  { animal: "Turtle", requiredLvl: 25, image: turtlePreview },
  { animal: "Capybara", requiredLvl: 35, image: capybaraPreview },
];

export const DEFAULT_SKILLS = [
  "Physical Health & Fitness",
  "Emotional Well-Being",
  "Career & Finances",
  "Relationships & Social",
  "Personal Growth & Purpose",
];

export const COLORS: Record<string, string> = {
  XP: "xp",
  "Physical Health & Fitness": "physical-health-fitness",
  "Emotional Well-Being": "emotional-well-being",
  "Career & Finances": "career-finances",
  "Relationships & Social": "relationships-social",
  "Personal Growth & Purpose": "personal-growth-purpose",
};

export const XP_PER_LEVEL = 100;
