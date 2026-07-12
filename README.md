# JobTrackr CI/CD Deployment Guide

## Overview
This project can be deployed using CI/CD pipelines with GitHub Actions.

## Recommended deployment flow
1. Push code to GitHub.
2. GitHub Actions runs install, build, and validation steps.
3. If checks pass on the main branch, the app is deployed automatically.

## Suggested hosting setup
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas
- Environment variables stored in GitHub Secrets

## Why CI/CD is useful
- Automatic testing and builds on every push or pull request
- Faster and safer releases
- Consistent deployment process for both frontend and backend
- Easier rollback and collaboration

## Interview talking points
- I used GitHub Actions as the CI/CD tool.
- The pipeline checks out the code, installs dependencies, builds the frontend, and validates the backend.
- Secrets like API keys and deployment tokens are stored in GitHub Secrets.
- The deploy stage runs only for the main branch after successful validation.
- The frontend uses a configurable API base URL so it can work in both local and production environments.
