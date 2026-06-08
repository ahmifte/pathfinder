# Security Policy

## Reporting a vulnerability

Please report security issues privately rather than opening a public issue.

- Email: security@example.com
- Or use GitHub's private vulnerability reporting on this repository.

I aim to acknowledge reports within 72 hours.

## Secrets and payment data

This project never commits secrets — all credentials come from environment variables (see `.env.example`). Payments and card data are handled entirely by Stripe. If you find a committed secret, treat it as a vulnerability and report it.
