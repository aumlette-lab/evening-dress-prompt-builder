
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

  // Corresponds to "Environment & Atmosphere" group
  { id: 'scene', label: 'Scene' },
  { id: 'lighting', label: 'Lighting' },
  
  // Corresponds to "Photographic Style" group
  { id: 'style', label: 'Style' },
  { id: 'focal_feel', label: 'Focal Feel' },
  { id: 'camera_angle', label: 'Camera Angle' },
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
    title: 'Environment & Atmosphere',
    categories: [
        { id: 'scene', label: 'Scene' },
        { id: 'lighting', label: 'Lighting' },
    ]
  },
  {
    title: 'Photographic Style',
    categories: [
      { id: 'style', label: 'Style' },
      { id: 'focal_feel', label: 'Focal Feel' },
      { id: 'camera_angle', label: 'Camera Angle' }
    ]
  }
];
