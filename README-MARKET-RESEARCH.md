# Market Research Functionality

This document explains how to set up and use the Market Research functionality in the Advisa application.

## Overview

The Market Research feature provides real-time competitor analysis, market trends, and market opportunities based on the user's business profile. It uses web scraping, search engine results, and data analysis to provide valuable insights.

## Features

- **Competitor Analysis**: Identifies and analyzes competitors in the user's industry
- **Market Trends**: Identifies current and emerging trends in the user's industry
- **Market Opportunities**: Identifies potential opportunities based on market gaps and competitor weaknesses

## Setup

### 1. Install Dependencies

The Market Research functionality requires the following dependencies:

```bash
npm install axios cheerio serpapi
```

### 2. Configure API Keys

You need to set up the following API keys in your `.env.local` file:

```
# SerpAPI Configuration
# Get your API key from https://serpapi.com/
NEXT_PUBLIC_SERPAPI_KEY=your-serpapi-key
```

You can get a SerpAPI key by signing up at [https://serpapi.com/](https://serpapi.com/).

### 3. Firebase Configuration

Ensure your Firebase configuration is set up correctly in `.env.local`:

```
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-firebase-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-firebase-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-firebase-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-firebase-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-firebase-app-id
```

### 4. Firestore Database Structure

The Market Research functionality uses the following collections in Firestore:

- `competitors`: Stores competitor data
- `marketTrends`: Stores market trend data
- `marketOpportunities`: Stores market opportunity data
- `users/{userId}/savedReports`: Stores saved reports for each user

## How It Works

### Data Collection

1. **Competitor Data Collection**:
   - Searches for competitors in the user's industry using SerpAPI
   - Scrapes company websites to extract information
   - Analyzes the data to identify strengths, weaknesses, and market position

2. **Market Trends Collection**:
   - Analyzes industry news and publications
   - Identifies emerging trends and their potential impact

3. **Market Opportunities Collection**:
   - Analyzes market gaps and competitor weaknesses
   - Identifies potential opportunities for the user's business

### Data Storage

All collected data is stored in Firestore for future use. This improves performance and reduces the need for repeated data collection.

### User Interface

The Market Research page provides a user-friendly interface to view and interact with the collected data:

- **Competitor Analysis Tab**: Displays competitor information, market share, strengths, and weaknesses
- **Market Trends Tab**: Displays current and emerging trends in the industry
- **Opportunities Tab**: Displays potential opportunities for the user's business

## Usage

1. Navigate to the Market Research page in the dashboard
2. The system will automatically load data based on the user's profile
3. Use the "Update Analysis" button to refresh the data
4. Use the "Save" button to save the current analysis for future reference

## Customization

### Adding New Data Sources

To add new data sources, modify the `dataCollectionService.ts` file:

1. Add a new function to collect data from the new source
2. Integrate the new data into the existing data models
3. Update the UI to display the new data

### Modifying Data Analysis

To modify how data is analyzed, update the relevant functions in `dataCollectionService.ts`:

- `transformToCompetitors`: Modifies how competitor data is analyzed
- `generateStrengths` and `generateWeaknesses`: Modify how strengths and weaknesses are identified
- `fetchMarketTrends`: Modifies how market trends are identified
- `generateMarketOpportunities`: Modifies how market opportunities are identified

## Troubleshooting

### Common Issues

1. **No data appears**: Ensure your user profile has an industry specified
2. **Error loading data**: Check your API keys and network connection
3. **Slow performance**: Data collection can take time, especially for the first analysis

### Debugging

Enable detailed logging by adding the following to your `.env.local` file:

```
NEXT_PUBLIC_DEBUG_MODE=true
```

This will output detailed logs to the browser console.

## Future Enhancements

Planned enhancements for the Market Research functionality:

1. Integration with financial data APIs for more accurate market share information
2. Machine learning for better strength/weakness analysis
3. Social media sentiment analysis for brand perception
4. Competitive content analysis
5. Pricing strategy recommendations 