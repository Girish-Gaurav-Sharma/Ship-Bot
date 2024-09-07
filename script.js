// AI Bot Logic
const sendChatBtn = document.querySelector('.chat-input svg');
const chatInput = document.querySelector('.chat-input textarea');
const chatbox = document.querySelector('.chatbox');
const chatbotToggler = document.querySelector('.chatbot-toggler');
const chatbotCloseBtn = document.querySelector('.close-btn');
const sendIcon = document.querySelector('.chat-input svg')

let userMessage;
const API_KEY = "AIzaSyAMqXwox4Pja-8XMymtyQC0nxi0Hxcxnpo"
const inputInitHeight = '62px'; // Initial height of the textarea

const createChatLi = (message, className) => {
    const chatLi = document.createElement('li');
    chatLi.classList.add("chat", className);

    let chatContent;
    if (className === "outgoing") {
        chatContent = `<p></p>`;
    } else { if(isShipbotMode){

        chatContent = `<img src="shipglobalin_logo.jpeg" alt="sdf"><p></p>`;
    }
else{
    chatContent = `<img src="Ai_logo.png" alt="sdf"><p></p>`;

}
    }    
    
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi;
};

const generateResponse = () => {
    const API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent";
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': `${API_KEY}`
        },
        body: JSON.stringify({
            contents: [
                {
                    role: 'user',
                    parts: [{ text: userMessage }]
                }
            ]
        })
    };

    // Return the API call so we can use it in handleChat
    return fetch(API_URL, requestOptions)
        .then(res => res.json())
        .then(data => {
            const responseMessage = data.candidates[0].content.parts[0].text;
            return responseMessage;
        })
        .catch((error) => {
            console.log(error);
            return 'Sorry, something went wrong!';
        });
};

const handleChat = () => {
    userMessage = chatInput.value.trim();

    if (!userMessage) return;
    
    chatInput.value = '';    
    chatbox.append(createChatLi(userMessage, 'outgoing'));
    chatbox.scrollTo(0, chatbox.scrollHeight);
    
    chatInput.style.height = inputInitHeight;
    chatInput.focus();
    
    // Append "Thinking..." message immediately
    
    // Call generateResponse and wait for the response
    setTimeout(() => {
        
        generateResponse().then((apiResponse) => {
            // Remove "Thinking..." message and add actual response
            chatbox.append(createChatLi(apiResponse, 'incoming')); // Appends the actual response
    
            chatbox.scrollTo(0, chatbox.scrollHeight);
        });
    }, 600);
};


chatInput.addEventListener("input", () => {
    chatInput.style.height = inputInitHeight;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleChat();
    }
});

sendChatBtn.addEventListener('click', handleChat);
var isFirstClick = true;
chatbotToggler.addEventListener('click', () => {
    if(isFirstClick){
        isFirstClick=false;
        document.body.classList.toggle('show-chatbot')
        sendIcon.style.visibility = 'hidden'

        handleShipbotResponse('chatStart');
        
    }
    else{document.body.classList.toggle('show-chatbot')}

});
chatbotCloseBtn.addEventListener('click', () => document.body.classList.remove('show-chatbot'));

// ShipBot Logic
const shipbotData = {
    chatStart: {
        title: ["Hey There", "I am Mr. ShipBot", "How can I help you today?"],
        options: ['others', 'Tracking', 'Pricing'],
        url: {}
    },
    others: {
        title: ["How can I help you?"],
        options: ['others', 'Tracking', 'Pricing'],
        url: {}
    },
    Tracking: {
        title: ["Be ready with the AWB number and click on the following button"],
        options: ['others'],
        url: {
            'Track': "#"
        }
    },
    Pricing: {
        title: ["To know about the shipment cost", "You must create an account in the website", 'if you already have an account you can directly login'],
        options: ['others'],
        url: {
            'Create Account': "#",
            'Login': "#"
        }
    }
};

const createButton = (text, isUrl = false) => {
    const button = document.createElement('button');
    button.textContent = text;
    button.classList.add(isUrl ? 'url-button' : 'option-button');
    return button;
};

const handleShipbotResponse = (key) => {
    const response = shipbotData[key];
    var indexCount=response.title.length+2;

    response.title.forEach((message, index) => {
        setTimeout(() => {
            chatbox.append(createChatLi(message, 'incoming'));
            chatbox.scrollTop = chatbox.scrollHeight;
        },(index+1)*600)
    });
    // Append URL buttons after all messages have been added
    const urlButtonsLi = document.createElement('li');
    urlButtonsLi.classList.add("chat", "incoming");
    Object.entries(response.url).forEach(([text, url]) => {
        const button = createButton(text, true);
        button.onclick = () => window.open(url, '_blank');
        urlButtonsLi.appendChild(button);
    });
    setTimeout(() => {
        chatbox.append(urlButtonsLi);
        chatbox.scrollTop = chatbox.scrollHeight;

    }, indexCount*600);
    indexCount=indexCount+1;
    // Append option buttons after URL buttons
    const optionButtonsLi = document.createElement('li');
    optionButtonsLi.classList.add("chat", "incoming");
    response.options.forEach(option => {
        const button = createButton(option);
        button.onclick = () => {
            chatbox.append(createChatLi(option, 'outgoing'));
            handleShipbotResponse(option);
            chatbox.scrollTop = chatbox.scrollHeight;

        };
        optionButtonsLi.appendChild(button);
    });
    setTimeout(() => {
        chatbox.append(optionButtonsLi);
        chatbox.scrollTop = chatbox.scrollHeight;
    
    }, indexCount*600);

};

// Switching Logic
const talkToShipbotBtn = document.querySelector('#talk-to-shipbot');
const talkToAIBtn = document.querySelector('#talk-to-ai');
const chatInputContainer = document.querySelector('.chat-input');
const text_area = document.querySelector('textarea');
let isShipbotMode = true;

const switchToShipbot = () => {
    if (!isShipbotMode) {
        chatInput.value = '';
        sendIcon.style.visibility = 'hidden'
        isShipbotMode = true;
        handleShipbotResponse('others');
        text_area.disabled = true;
        text_area.style.cursor = "not-allowed";
        text_area.placeholder = "You can use AI if stuck";
        talkToShipbotBtn.style.display = 'none';
        talkToAIBtn.style.display = 'block';
    }
};

const switchToAI = () => {
    if (isShipbotMode) {
        isShipbotMode = false;
        sendIcon.style.visibility = 'visible'
        text_area.disabled = false;
        text_area.style.cursor = "auto";
        text_area.placeholder = "Enter your question....";
        talkToShipbotBtn.style.display = 'block';
        talkToAIBtn.style.display = 'none';
    }
};

window.onload = () => {
    text_area.disabled = true;
    text_area.style.cursor = "not-allowed";
    text_area.placeholder = "Select options or use AI";
    talkToAIBtn.style.display = 'block';
    talkToShipbotBtn.style.display = 'none';
};

talkToShipbotBtn.addEventListener('click', switchToShipbot);
talkToAIBtn.addEventListener('click', switchToAI);
