# SEO Analysis Tool Documentation

## Overview
The SEO Analysis Tool is a comprehensive solution for analyzing websites' search engine optimization. It provides detailed insights and actionable recommendations to improve SEO performance. This documentation outlines the architecture, features, and technical implementation of the system.

## System Architecture

### Components
The SEO Analysis Tool consists of several key components:

1. **User Interface** - Built with React and Next.js, providing an intuitive interface for analysis and result visualization
2. **Analysis Engine** - Server-side logic that evaluates SEO factors
3. **Storage Module** - Handles saving and retrieving analysis history
4. **Export System** - Enables exporting reports in JSON and HTML formats

### Analysis Process
When a user requests an SEO analysis:

1. The URL is validated and normalized
2. The system fetches the website content using Puppeteer
3. Multiple analysis modules evaluate specific SEO aspects
4. Results are combined, scored, and presented to the user
5. Analysis results are stored in the history

### Data Storage
Analysis results are stored in two ways:

1. **Local Storage** - For client-side persistence between sessions
2. **Database (Optional)** - For enterprise deployments requiring long-term storage and sharing

## Key Features

### Core Features
- **Comprehensive SEO Analysis** - Evaluates meta tags, content quality, headings, links, images, and more
- **Actionable Recommendations** - Provides specific improvement suggestions
- **Export Options** - Export reports in JSON or HTML format
- **Analysis History** - Track and compare changes over time
- **Responsive Design** - Works on desktop and mobile devices

### Analysis Categories
The system evaluates several categories:

- **Meta Tags** - Title, description, and keywords
- **Headings** - Structure and usage of H1-H6 tags
- **Content Quality** - Word count, readability, and keyword usage
- **Images** - Alt text usage and optimization
- **Performance** - Load time and mobile optimization
- **Links** - Internal and external link analysis
- **Security** - HTTPS usage and security best practices

## Configuration Options

### Analysis Depth
The system supports different analysis depths:
- **Basic** - Quick overview of critical factors
- **Standard** - Comprehensive analysis (default)
- **Deep** - In-depth analysis including advanced factors

### Environment Variables
- `USE_MOCK_SEO` - Toggle mock data for development

## Code Structure

### Key Files and Directories
- `/components/SEOAnalyzer.tsx` - Main UI component
- `/api/analyze-seo.ts` - Core analysis logic
- `/api/analysis/` - Individual analysis modules
- `/types/seo.ts` - TypeScript interfaces and types

### Data Flow
1. User input → `/components/SEOAnalyzer.tsx`
2. Analysis request → `/api/analyze-seo.ts`
3. Modular analysis → `/api/analysis/*`
4. Results returned to UI → rendered in components

## Technical Implementation

### Technologies Used
- **Frontend**: React, Next.js, Tailwind CSS
- **Backend**: Next.js API routes, Puppeteer
- **Analysis**: Custom algorithms, JSDOM
- **Testing**: Jest, React Testing Library

### Puppeteer Configuration
The system uses Puppeteer for website analysis, configured to work across different environments:
- Development: Local Chrome installation
- Production: Optimized for serverless environments with chrome-aws-lambda

### Performance Optimizations
- Browser instances are efficiently managed
- Analysis runs in parallel where possible
- Results are cached to minimize repeat processing

## Troubleshooting

### Common Issues
- **Memory Usage** - Puppeteer can use significant memory for complex sites
- **Network Errors** - Some sites may block automated access
- **Rendering Issues** - Sites heavily dependent on client-side JS may need deeper analysis

### Solutions
- Adjust memory settings for large sites
- Implement retry mechanisms for transient errors
- Use timeout settings to handle slow-loading sites

## Future Enhancements

### Planned Features
- Advanced keyword analysis
- Competitor comparison
- Automated monitoring
- Integration with other SEO tools
- AI-powered recommendations

## Development Guidelines

### Adding New Analysis Modules
1. Create a new file in `/api/analysis/`
2. Implement the analysis function
3. Export the function for use in the main analysis process
4. Update scoring and recommendation systems

### UI Extensions
When extending the UI:
1. Follow the established component patterns
2. Use existing UI components for consistency
3. Implement responsive design for all new elements
4. Ensure proper error handling and loading states

### Testing
- All new features should have unit tests
- UI components should have component tests
- Core analysis functions should have integration tests

## Contributing
Contributions to the SEO Analysis Tool are welcome. Please follow the established code style and submit pull requests for review.

## Browserless.io Setup (Recommended)

For the most reliable production deployment, we recommend using Browserless.io:

### Step 1: Sign Up for Browserless.io

1. Go to [Browserless.io](https://www.browserless.io/) and sign up for an account
   - They offer a free tier with 1,000 sessions per month
   - No credit card required for the free tier

2. After signing up, go to your dashboard and copy your API token
   - It will look something like `abc-123-def-456`

### Step 2: Configure Your Environment

Add your Browserless.io token to your environment:

1. Create/edit `.env.local` for local development:
   ```
   BROWSERLESS_TOKEN=your_browserless_token_here
   FALLBACK_TO_MOCK=true
   BLOCK_RESOURCES=true
   SEO_ANALYSIS_TIMEOUT=60000
   ```

2. Add the same variables to your production environment (Vercel, Netlify, etc.)

### Step 3: Test the Connection

1. Test locally:
   ```bash
   # Run the dev server
   npm run dev
   
   # Visit the test endpoint in your browser
   http://localhost:3000/api/test-browserless
   ```

2. After deploying, test in production:
   ```
   https://your-site.com/api/test-browserless
   ```

If successful, you'll see a JSON response with a screenshot of example.com.

## Troubleshooting

### Connection Issues

If you see errors connecting to Browserless.io:

1. Verify your token is correct
2. Check if you've exceeded your monthly limit
3. Ensure your hosting provider allows WebSocket connections
4. Try the fallback options by setting `FALLBACK_TO_MOCK=true`

### Performance Optimization

For faster analysis:

1. Set `BLOCK_RESOURCES=true` to skip loading images, fonts, etc.
2. Adjust `SEO_ANALYSIS_TIMEOUT` based on your needs
3. Consider upgrading your Browserless.io plan for more concurrent sessions

## Alternative Deployment Options

If Browserless.io doesn't work for your use case, see the other options in [Deployment Options](#deployment-options).

## Deployment Options

Choose one of these deployment methods:

### Option 1: Browserless.io (Recommended)

As described above - the easiest and most reliable option.

### Option 2: Vercel with Serverless Browser

1. Add this to your Vercel project settings:
   - Add build command: `npm run build && npm run install-chromium`
   - Build command installs both puppeteer and chrome-aws-lambda

2. Deploy with increased function size:
   - Increase serverless function size limit to at least 50MB

### Option 3: Regular Server Deployment

1. Make sure Chrome/Chromium is installed on the server
2. Run: `npm install puppeteer`
3. Deploy normally

## Local Development

To run locally:
```bash
npm run dev
```

To use mock data locally (avoid browser initialization):
```bash
# Add to .env.local
USE_MOCK_SEO=true
```
