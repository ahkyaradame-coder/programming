# CodeLearn

CodeLearn is an interactive platform that helps you learn programming by building real-world projects. Whether you're a beginner or an experienced developer, you'll find guided lessons, practical challenges, and mentor-style feedback to boost your skills.

## Features

- Guided project-based courses (front-end, back-end, DevOps, ML)
- Built-in AI tutor for explanations, exercises, and debugging
- Mock authentication and local subscription demo
- Discount wheel, feedback widget, and an interactive quiz
- Light/dark themes, RTL support, and responsive UI

## Quick start (local)

1. Install dependencies:

```
npm install
```

2. Set environment variables (Windows `cmd.exe` example):

```
set PAYPAL_CLIENT_ID=your_paypal_client_id
set PAYPAL_SECRET=your_paypal_secret
set OPENAI_API_KEY=your_openai_api_key
```

3. Start the server:

```
node server.js
```

4. Open the site in your browser:

```
http://localhost:3000
```

Notes:
- The project uses `localStorage` for demo authentication and subscriptions.
- The AI tutor will proxy to the server `/api/ai` endpoint when `OPENAI_API_KEY` is configured; otherwise the client falls back to canned responses.

## Development

- Frontend: single-page static files (`index.html`, `script.js`, `style.css`).
- Backend: `server.js` (Express) provides PayPal and AI proxy endpoints used by the demo.

## Contributing

Feel free to open issues or submit pull requests for improvements — especially for:

- Replacing mock auth with a real authentication flow
- Persisting data to a real database
- Enhancing the AI prompts and canned responses

## License

This repository is provided as a demo. Add a license file if you plan to publish or share it publicly.

