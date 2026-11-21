# kamarali-portfolio
Modern, responsive portfolio for Kamarali Maknojiya, PHP & Laravel backend developer.

## Pages
- `index.html`: portfolio (dark/light theme, project filter, live IST clock, contact form)
- `resume.html`: one-page printable resume (no photo). The PDF is at `assets/cv/Kamarali-Maknojiya-Resume.pdf`

## Contact form (live email)
Messages are sent with EmailJS. Keys are in `assets/js/main.js` (`EMAILJS`).
Your EmailJS template should use: `{{from_name}}`, `{{reply_to}}`, `{{subject}}`, `{{message}}`.
If sending fails, the visitor gets Gmail / mail-app links with their message already filled in.

## Update the resume PDF
Open `resume.html` in Chrome → Print → "Save as PDF" (A4, margins: None, background graphics on),
then replace `assets/cv/Kamarali-Maknojiya-Resume.pdf`.
