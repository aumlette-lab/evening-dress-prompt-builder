
import type { Category, VisualElementGroup } from './types';

// This list defines the order for analysis and is the single source of truth for all categories.
// The order here MUST match the order of categories as they appear in the VISUAL_ELEMENT_GROUPS below.
export const CATEGORIES: Category[] = [
  // Corresponds to "Model and Styling Details" group
  { id: 'ethnicity', label: 'Ethnicity' },
  { id: 'body_type', label: 'Body Type' },
  { id: 'hair', label: 'Hair' },
  { id: 'dress_colour', label: 'Dress Colour' },
  { id: 'bags', label: 'Bags' },
  { id: 'accessory', label: 'Accessories' },
  { id: 'shoes', label: 'Shoes' },
  
  // Corresponds to "Pose and Expression" group
  { id: 'pose', label: 'Pose' },
  { id: 'hands_arms', label: 'Hands & Arms' },
  { id: 'expression', label: 'Facial Expression' }, // Changed label from "Expression"

  // Corresponds to "Photographic Style" group
  { id: 'style', label: 'Style' },
  { id: 'focal_feel', label: 'Focal Feel' },
  { id: 'camera_angle', label: 'Camera Angle' },

  // Corresponds to "Environment & Atmosphere" group
  { id: 'scene', label: 'Scene' },
  { id: 'lighting', label: 'Lighting' },
];

// This list defines the UI grouping for the main page.
// The categories within should reference the IDs from the CATEGORIES list.
export const VISUAL_ELEMENT_GROUPS: VisualElementGroup[] = [
  {
    title: 'Model and Styling Details',
    categories: [
        { id: 'ethnicity', label: 'Ethnicity' },
        { id: 'body_type', label: 'Body Type' },
        { id: 'hair', label: 'Hair' },
        { id: 'dress_colour', label: 'Dress Colour' },
        { id: 'bags', label: 'Bags' },
        { id: 'accessory', label: 'Accessories' },
        { id: 'shoes', label: 'Shoes' },
    ]
  },
  {
    title: 'Pose and Expression',
    categories: [
        { id: 'pose', label: 'Pose' },
        { id: 'hands_arms', label: 'Hands & Arms' },
        { id: 'expression', label: 'Facial Expression' },
    ]
  },
  {
    title: 'Photographic Style',
    categories: [
      { id: 'style', label: 'Style' },
      { id: 'focal_feel', label: 'Focal Feel' },
      { id: 'camera_angle', label: 'Camera Angle' }
    ]
  },
  {
    title: 'Environment & Atmosphere',
    categories: [
        { id: 'scene', label: 'Scene' },
        { id: 'lighting', label: 'Lighting' },
    ]
  }
];

export const CATEGORY_HIGHLIGHT_CLASSES: Record<string, string> = {
  ethnicity: 'bg-fuchsia-500/10 border border-fuchsia-500/30',
  body_type: 'bg-cyan-500/10 border border-cyan-500/30',
  hair: 'bg-amber-500/10 border border-amber-500/30',
  dress_colour: 'bg-emerald-500/10 border border-emerald-500/30',
  bags: 'bg-rose-500/10 border border-rose-500/30',
  accessory: 'bg-sky-500/10 border border-sky-500/30',
  shoes: 'bg-violet-500/10 border border-violet-500/30',
  pose: 'bg-indigo-500/10 border border-indigo-500/30',
  hands_arms: 'bg-lime-500/10 border border-lime-500/30',
  expression: 'bg-purple-500/10 border border-purple-500/30',
  scene: 'bg-teal-500/10 border border-teal-500/30',
  lighting: 'bg-orange-500/10 border border-orange-500/30',
  style: 'bg-blue-500/10 border border-blue-500/30',
  focal_feel: 'bg-pink-500/10 border border-pink-500/30',
  camera_angle: 'bg-red-500/10 border border-red-500/30',
};
