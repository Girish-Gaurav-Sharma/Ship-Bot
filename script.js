// AI Bot Logic
const sendChatBtn = document.querySelector('.chat-input svg');
const chatInput = document.querySelector('.chat-input textarea');
const chatbox = document.querySelector('.chatbox');
const chatbotToggler = document.querySelector('.chatbot-toggler');
const chatbotCloseBtn = document.querySelector('.close-btn');
const sendIcon = document.querySelector('.chat-input svg')
const optionButton = document.querySelectorAll('button .option-button')
const urlButton = document.querySelectorAll('button .url-button')
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
        options: ['Tracking', 'Pricing','Policy','Contact','Offices','Shipping Options','Address'],
        url: {}
    },
    Others: {
        title: ["How can I help you?"],
        options: ['Tracking', 'Pricing','Policy','Contact','Offices','Shipping Options','Address'],
        url: {}
    },
    Tracking: {
        title: ["Be ready with the AWB number and click on the following button"],
        options: ['Others'],
        url: {
            'Track': "#"
        }
    },
    Pricing: {
        title: ["To know about the shipment cost", "You must create an account in the website", 'if you already have an account you can directly login'],
        options: ['Others'],
        url: {
            'Create Account': "#",
            'Login': "#"
        }
    },
    Policy:  {
        title: ["Click on the following buttons to know about our privacy policy, T&C* and Refund Policy"],
        options: ['Others'],
        url: {
            'Privacy Policy': "#",
            'Terms & Conditions': "#",
            'Refunds Policy': "#"
        }
    },
    Contact:  {
        title: ["You can contact on following credentials.","Call: 011-42277777","Mail: support@shipglobal.in", "Mail: sales@shipglobal.in"],
        options: ['Others'],
        url: {}
    },
    Offices:  {
        title: ["We have our offices in following states"],
        options: ['Rajasthan','Madhya Pradesh','Gujarat','Tamil Nadu','Uttar Pradesh','Maharashtra','Uttarakhand','Punjab','Others'],
        url: {}   
    },
    'Shipping Options':  {
        title: ["Following are the shipping Options."],
        options: ['Economy','Direct','Premium','Express','Others'],
        url: {}   
    },
    Economy:  {
        title: ["With ECONOMY we deliver your orders within 8-12 days internaionaly"],
        options: ['Direct','Premium','Express','Others'],
        url: {}   
    },
    Direct:  {
        title: ["With DIRECT we deliver your orders within 7-10 days internaionaly"],
        options: ['Economy','Premium','Express','Others'],
        url: {}   
    },
    Premium:  {
        title: ["With PREMIUM we deliver your orders within 6-9 days internaionaly"],
        options: ['Economy','Direct','Express','Others'],
        url: {}   
    },
    Express:  {
        title: ["With EXPRESS we deliver your orders within 8-12 days internaionaly"],
        options: ['Economy','Direct','Premium','Others'],
        url: {}   
    },
    Address:  {
        title: ["Address of our Head Office is",'1404, Road No.6 Mahipalpur, New Delhi 110037, India','See on Map'],
        options: ['Offices','Others'],
        url: {'Map':'https://www.google.com/maps/place/ShipGlobal.in+(Ship+Global+Solutions)/@28.5519809,77.1324729,684m/data=!3m2!1e3!4b1!4m6!3m5!1s0x390d1dd14d73af7d:0xd07041845e591c2e!8m2!3d28.5519809!4d77.1324729!16s%2Fg%2F11tbwdpfs_?entry=ttu&g_ep=EgoyMDI0MDkwNC4wIKXMDSoASAFQAw%3D%3D'}   
    },
    Rajasthan:{
        title: ["In Rajasthan we have offices in",'Jaipur - jaipur@shipglobal.in', 'Udaipur - udaipur@shipglobal.in'],
        options: ['Offices','Others'],
        url: {}   
    },
    
    'Madhya Pradesh':{
        title: ["In Madhya Pradesh we have office in",'Bhopal - bhopal@shipglobal.in'],
        options: ['Offices','Others'],
        url: {}   
    },
    
    Gujarat:{
        title: ["In Gujarat we have offices in",'Surat - surat@shipglobal.in','Ahmedabad - ahmedabad@shipglobal.in'],
        options: ['Offices','Others'],
        url: {}   
    },
    'Tamil Nadu':{
        title: ["In Tamil Nadu we have office in",'Chennai - chennai@shipglobal.in'],
        options: ['Offices','Others'],
        url: {}   
    },
    'Uttar Pradesh':{
        title: ["In Uttar Pradesh we have offices in",'Agra - agra@shipglobal.in','Moradabad - moradabad@shipglobal.in','Kanpur - kanpur@shipglobal.in','Lucknow - lucknow@shipglobal.in','Meerut - meerut@shipglobal.in'],
        options: ['Offices','Others'],
        url: {}   
    },
    Maharashtra: {
        title: ["In Maharashtra we have office in",'Mumbai - mumbai@shipglobal.in'],
        options: ['Offices','Others'],
        url: {}   
    },
    Uttarakhand:{
        title: ["In Uttarakhand we have office in",'Roorkee - roorkee@shipglobal.in'],
        options: ['Offices','Others'],
        url: {}   
    },
    Punjab:{
        title: ["In Punjab we have office in",'Jalandhar - jalandhar@shipglobal.in','Ludhiana - ludhiana@shipglobal.in'],
        options: ['Offices','Others'],
        url: {} 
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
        console.log(optionButton); // Should output a NodeList of buttons
console.log(urlButton);    // Should output a NodeList of buttons

        optionButton.forEach(button =>{button.style.pointerEvents = 'auto';
            button.style.cursor = 'pointer';
                    });
        urlButton.forEach(button =>{button.style.pointerEvents = 'auto';
            button.style.cursor = 'pointer';});
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
        console.log(optionButton); // Should output a NodeList of buttons
        console.log(urlButton);    // Should output a NodeList of buttons
        isShipbotMode = false;
        setTimeout(() => {
            
            chatbox.append(createChatLi('Hey there, Iam AI write down what you wanna ask.', 'incoming'));
            chatbox.scrollTop = chatbox.scrollHeight;
        }, 1000);
        optionButton.forEach(button =>{button.style.pointerEvents = 'none';
button.style.cursor = 'not-allowed';
        });
        urlButton.forEach(button =>{button.style.pointerEvents = 'none';
            button.style.cursor = 'not-allowed';});

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
