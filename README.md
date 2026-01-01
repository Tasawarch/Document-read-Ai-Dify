# Document Read AI

A powerful React-based web application that enables users to upload documents and interact with them through AI-powered conversations. Built with Dify API integration for intelligent document analysis and chat functionality.

## Features

- **Document Upload**: Support for various document formats with drag-and-drop interface
- **AI-Powered Chat**: Interactive conversations with your uploaded documents using Dify AI
- **Real-time Responses**: Fast and responsive chat interface with loading states
- **File Management**: Easy file selection and context switching
- **Modern UI**: Clean, intuitive interface built with Tailwind CSS and Lucide icons
- **Markdown Support**: Rendered responses with proper formatting

## Technology Stack

- **Frontend**: React 18 with Vite for fast development
- **Styling**: Tailwind CSS for modern, responsive design
- **Icons**: Lucide React for beautiful icon components
- **HTTP Client**: Axios for API communication
- **Markdown**: React Markdown for formatted responses
- **AI Integration**: Dify API for document processing and chat

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn
- Dify API key for workflow app integration

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd document-read-ai
```

2. Install dependencies:
```bash
npm install
```

3. Configure your Dify API key in `src/DifyChat.jsx`:
```javascript
const API_KEY = 'your-dify-api-key';
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

### Usage

1. **Upload a Document**: Click the paperclip icon or drag and drop a file into the upload area
2. **Start Chatting**: Type your questions about the document and press Enter or click Send
3. **View Responses**: AI responses will appear in markdown format with proper formatting
4. **Reset Chat**: Use the trash icon to clear the conversation and start fresh

## API Configuration

The application uses the Dify API for document processing. Make sure to:

1. Create a workflow app in your Dify dashboard
2. Obtain your API key from the Dify settings
3. Update the `API_KEY` constant in `src/DifyChat.jsx`
4. Ensure your workflow app is configured for document processing

## Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Project Structure

```
src/
├── App.jsx          # Main application component
├── DifyChat.jsx     # Core chat functionality with Dify integration
├── main.jsx         # Application entry point
└── assets/          # Static assets
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
