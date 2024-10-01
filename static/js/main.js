const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');
const recordButton = document.getElementById('record-button');

sendButton.addEventListener('click', sendMessage);
recordButton.addEventListener('click', recordAudio);

userInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

function sendMessage() {
    const message = userInput.value.trim();
    if (message) {
        displayMessage('You', message);
        userInput.value = '';

        axios.post('/send_message', { message: message })
            .then(response => {
                displayMessage('PristiniAssist', response.data.response, true);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
}

function recordAudio() {
    recordButton.textContent = 'Recording...';
    axios.post('/record_audio')
        .then(response => {
            userInput.value += response.data.text;
            recordButton.textContent = '🎤';
        })
        .catch(error => {
            console.error('Error:', error);
            recordButton.textContent = '🎤';
        });
}

function displayMessage(sender, message, isMarkdown = false) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    
    if (sender === 'You') {
        messageElement.classList.add('user-message');
        messageElement.textContent = `${sender}: ${message}`;
    } else {
        messageElement.classList.add('assistant-message');
        let iconHtml = '<img src="./icon.png" alt="" class="assistant-icon">';
        let contentHtml = isMarkdown ? marked(message) : message;
        messageElement.innerHTML = `${iconHtml}${sender}: <div class="markdown-content">${contentHtml}</div>`;
    }
    
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    messageElement.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightBlock(block);
    });
}

//options config
marked.setOptions({
    breaks: true,
    gfm: true,
    highlight: function (code, language) {
        const validLanguage = hljs.getLanguage(language) ? language : 'plaintext';
        return hljs.highlight(validLanguage, code).value;
    }
});