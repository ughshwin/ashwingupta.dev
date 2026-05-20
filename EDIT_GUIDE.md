# How to Edit Your Portfolio

This guide will help you customize your portfolio to make it truly yours!

## 1. Personal Information (Hero Section)

**File:** `/src/app/components/Hero.tsx`

Find and replace:

- `"Your Name"` → Your actual name
- `"AI Systems Engineer"` → Your job title
- `"ashwingupta3012@gmail.com"` → Your email address
- `"github.com/ughshwin"` → Your GitHub profile URL
- `"linkedin.com/in/ashwingupta3012"` → Your LinkedIn profile URL

**To change the hero image:**

- Replace the image URL on line with the `src=` attribute
- Use a professional photo of yourself or your workspace

## 2. About Section

**File:** `/src/app/components/About.tsx`

Update:

- The paragraph text with your own story
- Change the workspace image by replacing the image URL
- The icons and descriptions match your strengths

## 3. Skills Section

**File:** `/src/app/components/Skills.tsx`

Edit the `skills` array at the top:

```typescript
const skills = [
  { name: "React", level: 95 }, // Change name and level (0-100)
  { name: "Your Skill", level: 85 },
  // Add more skills...
];
```

## 4. Projects Section

**File:** `/src/app/components/Projects.tsx`

Edit the `projects` array:

```typescript
const projects = [
  {
    title: "Your Project Name",
    description: "What your project does",
    image: "image-url-here",
    tags: ["Tech1", "Tech2", "Tech3"],
    gradient: "from-blue-500 to-cyan-500",
  },
  // Add more projects...
];
```

**To add your own project images:**

1. Upload images to a hosting service (Imgur, Cloudinary, etc.)
2. Replace the `image` URL with your hosted image URL

## 5. Contact Section

**File:** `/src/app/components/Contact.tsx`

Update:

- Your email address
- Your location
- Modify the contact form text

**To make the form actually work:**
You'll need to connect it to a backend service like:

- EmailJS
- Formspree
- Your own backend API

## 6. Colors & Theme

**To change the color scheme:**

Find these gradient classes throughout the files and replace them:

- `from-indigo-600 to-pink-600` → Use any Tailwind colors
- `bg-indigo-600` → Change to your brand color
- `text-indigo-600` → Change text colors

Popular color combinations:

- `from-blue-600 to-purple-600` (Blue to Purple)
- `from-green-500 to-teal-500` (Green to Teal)
- `from-orange-500 to-red-500` (Orange to Red)

## 7. Add New Sections

To add a new section:

1. Create a new file in `/src/app/components/YourSection.tsx`
2. Copy the structure from an existing component
3. Import and add it to `/src/app/App.tsx`

## Quick Tips

- **Images:** Use high-quality, professional images (at least 1920px wide)
- **Text:** Keep descriptions clear and concise
- **Links:** Make sure all URLs start with `https://`
- **Testing:** Preview changes frequently to see how they look

## Need Help?

- Check the existing code for examples
- Each section is self-contained and easy to modify
- Don't worry about breaking things - just refresh to see your changes!
