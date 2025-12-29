# Deployment Instructions

## Prerequisites
- Node.js (v18 or higher)
- npm

## Build for Production

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Build the Project**
    ```bash
    npm run build
    ```
    This will create a `dist` directory containing the production build.

## Deployment Options

### Static Hosting (Vercel, Netlify, GitHub Pages)
The `dist` folder can be deployed to any static hosting provider.

**Vercel:**
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the project root.
3. Follow the prompts.

**Netlify:**
1. Drag and drop the `dist` folder to Netlify Drop.

### Docker
1. Build the image:
   ```bash
   docker build -t campaign-dashboard .
   ```
2. Run the container:
   ```bash
   docker run -p 80:80 campaign-dashboard
   ```
