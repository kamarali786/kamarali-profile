# kamarali-portfolio
Modern, responsive portfolio for Kamarali Maknojiya, PHP & Laravel backend developer.

## Pages
- `index.html`: portfolio (dark/light theme, project filter, live IST clock, contact form)
- `resume.html`: one-page printable resume (no photo). The PDF is at `assets/cv/Kamarali-Maknojiya-Resume.pdf`

## Contact form (live email)
Messages are sent with Web3Forms (app.web3forms.com, signed in as maknojiyakamarali504@gmail.com).
The public access key is in `assets/js/main.js` (`WEB3FORMS_KEY`). Replies go to the visitor's email automatically.
If sending fails, the visitor gets Gmail / mail-app links with their message already filled in.

## Update the resume PDF
Open `resume.html` in Chrome → Print → "Save as PDF" (A4, margins: None, background graphics on),
then replace `assets/cv/Kamarali-Maknojiya-Resume.pdf`.
