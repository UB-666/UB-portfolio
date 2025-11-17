# Security Policy

## Supported Versions

Currently supporting the latest version of this portfolio website.

| Version | Supported          |
| ------- | ------------------ |
| latest  | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability, please email me directly rather than opening a public issue.

**DO NOT** create a public GitHub issue for security vulnerabilities.

## Security Measures

This project implements the following security measures:

1. **Environment Variables**: All API keys and secrets are stored in `.env.local` (not committed to git)
2. **Input Validation**: Form inputs are validated and sanitized
3. **CAPTCHA Protection**: hCaptcha integration prevents bot submissions
4. **No Sensitive Data**: No user data is stored or transmitted
5. **HTTPS Only**: Deployed on platforms that enforce HTTPS

## Safe Deployment

Before deploying:
1. Never commit `.env.local` or any file containing secrets
2. Set environment variables in your deployment platform (Vercel, Netlify, etc.)
3. Rotate any exposed API keys immediately
4. Use the `.env.local.example` file as a template

## Best Practices

- Keep dependencies updated
- Review all third-party packages
- Use secure hosting platforms
- Enable security headers
- Monitor for vulnerabilities
