// Initial notes data (fallback)
const initialNotes = [
    { id: 1, title: 'Meeting Notes: Project Alpha', preview: 'Discussed the timeline for Q3 and confirmed the design milestones with the engineering team.', date: 'Oct 12', favorite: true },
    { id: 2, title: 'Grocery List', preview: '- Almond milk\n- Avocados\n- Sourdough bread\n- Coffee beans', date: 'Oct 11', favorite: false },
    { id: 3, title: 'Design Inspiration', preview: 'Check out the new minimalist portfolios online. The use of whitespace and typography is inspiring.', date: 'Oct 10', favorite: true },
    { id: 4, title: 'Weekend Plans', preview: 'Hike in the mountains on Saturday morning, then check out the new cafe downtown.', date: 'Oct 09', favorite: false }
];

// Load from Local Storage safely
const storedNotes = localStorage.getItem('saffronCurrentNotes');
let parsedNotes = null;
if (storedNotes) {
    try {
        parsedNotes = JSON.parse(storedNotes);
        if (!Array.isArray(parsedNotes)) parsedNotes = null;
    } catch(e) {}
}
let currentNotes = parsedNotes || [...initialNotes];

// Save function to update Local Storage
function saveNotesToStorage() {
    localStorage.setItem('saffronCurrentNotes', JSON.stringify(currentNotes));
}

const notesGrid = document.getElementById('notesGrid');
const searchInput = document.getElementById('searchInput');
const addNoteBtn = document.getElementById('addNoteBtn');

// Navigation Elements
const navDashboard = document.getElementById('navDashboard');
const navCategories = document.getElementById('navCategories');
const navSettings = document.getElementById('navSettings');
const dashboardView = document.getElementById('dashboardView');
const categoriesView = document.getElementById('categoriesView');
const settingsView = document.getElementById('settingsView');

// View Switching Logic
function switchView(activeNav, activeView) {
    // Nav styles
    [navDashboard, navCategories, navSettings].forEach(nav => nav.classList.remove('active'));
    activeNav.classList.add('active');
    
    // View display
    [dashboardView, categoriesView, settingsView].forEach(view => view.style.display = 'none');
    activeView.style.display = 'block';
}

navDashboard.addEventListener('click', (e) => { e.preventDefault(); switchView(navDashboard, dashboardView); });
navCategories.addEventListener('click', (e) => { e.preventDefault(); switchView(navCategories, categoriesView); });
navSettings.addEventListener('click', (e) => { e.preventDefault(); switchView(navSettings, settingsView); });

// Settings Logic
const saveSettingsBtn = document.getElementById('saveSettingsBtn');
const settingsNameInput = document.getElementById('settingsNameInput');
const userNameDisplay = document.querySelector('.user-name');

saveSettingsBtn.addEventListener('click', () => {
    userNameDisplay.innerText = settingsNameInput.value;
    alert('Ayarlar başarıyla kaydedildi!');
});

// Render notes to DOM
function renderNotes(notesToRender) {
    notesGrid.innerHTML = ''; // Clear existing
    
    if (notesToRender.length === 0) {
        notesGrid.innerHTML = '<p style="color: var(--text-muted); grid-column: 1 / -1;">No notes found matching your criteria.</p>';
        return;
    }

    notesToRender.forEach(note => {
        const noteEl = document.createElement('div');
        noteEl.classList.add('note-card');
        
        // Handle favorite icon display
        const favIcon = note.favorite ? 'star' : 'star-outline';
        const favColor = note.favorite ? 'color: var(--saffron);' : '';
        
        noteEl.innerHTML = `
            <div>
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.8rem;">
                    <h3 class="note-title" style="margin-bottom: 0;">${note.title}</h3>
                    <ion-icon name="${favIcon}" style="${favColor} font-size: 1.2rem; cursor: pointer; transition: all 0.3s;" class="fav-btn"></ion-icon>
                </div>
                <p class="note-preview">${note.preview.substring(0, 100)}${note.preview.length > 100 ? '...' : ''}</p>
            </div>
            <div class="note-footer">
                <span>${note.date}</span>
                <ion-icon name="ellipsis-horizontal" style="cursor: pointer; padding: 5px; font-size: 1.2rem;" class="more-options-btn"></ion-icon>
            </div>
        `;
        
        // Favorite button interactivity
        const favBtn = noteEl.querySelector('.fav-btn');
        favBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // prevent triggering note click
            note.favorite = !note.favorite;
            saveNotesToStorage();
            applyFilters(); // Re-render with new state
        });
        
        // Options button interactivity
        const optionsBtn = noteEl.querySelector('.more-options-btn');
        optionsBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            alert('Options menu for: ' + note.title + '\n(Edit, Delete, Share functionality coming soon)');
        });
        
        // Card click
        noteEl.addEventListener('click', () => {
            openEditModal(note);
        });
        
        notesGrid.appendChild(noteEl);
    });
}

// Filter Functionality
const filterOptions = document.querySelectorAll('#filterOptions span');
let currentFilter = 'all';

filterOptions.forEach(option => {
    option.addEventListener('click', () => {
        // Update active class
        filterOptions.forEach(opt => opt.classList.remove('active'));
        option.classList.add('active');
        
        currentFilter = option.dataset.filter;
        applyFilters();
    });
});

function applyFilters() {
    const term = searchInput.value.toLowerCase();
    
    let filtered = currentNotes.filter(n => n.title.toLowerCase().includes(term) || n.preview.toLowerCase().includes(term));
    
    if (currentFilter === 'recent') {
        // Just simulating recent by reversing or limiting slice
        filtered = filtered.slice(0, 2); 
    } else if (currentFilter === 'favorites') {
        filtered = filtered.filter(n => n.favorite);
    }
    
    renderNotes(filtered);
}

// Search functionality
searchInput.addEventListener('input', applyFilters);

// Edit Modal Logic
const editNoteOverlay = document.getElementById('editNoteOverlay');
const editNoteTitle = document.getElementById('editNoteTitle');
const editNoteContent = document.getElementById('editNoteContent');
const closeEditModalBtn = document.getElementById('closeEditModalBtn');
const saveNoteBtn = document.getElementById('saveNoteBtn');
const deleteNoteBtn = document.getElementById('deleteNoteBtn');

let currentEditingNote = null;

function openEditModal(note) {
    currentEditingNote = note;
    editNoteTitle.value = note.title;
    editNoteContent.value = note.preview;
    editNoteOverlay.classList.add('active');
}

function closeEditModal() {
    editNoteOverlay.classList.remove('active');
    currentEditingNote = null;
}

closeEditModalBtn.addEventListener('click', closeEditModal);

saveNoteBtn.addEventListener('click', () => {
    if (currentEditingNote) {
        currentEditingNote.title = editNoteTitle.value;
        currentEditingNote.preview = editNoteContent.value;
        currentEditingNote.date = 'Just now'; // Update date to show recently modified
        saveNotesToStorage();
        applyFilters();
        closeEditModal();
    }
});

deleteNoteBtn.addEventListener('click', () => {
    if (currentEditingNote) {
        if(confirm('Are you sure you want to delete this note?')) {
            currentNotes = currentNotes.filter(n => n.id !== currentEditingNote.id);
            saveNotesToStorage();
            applyFilters();
            closeEditModal();
        }
    }
});

// Add note mock logic
addNoteBtn.addEventListener('click', () => {
    const newNote = {
        id: Date.now(),
        title: 'New Blank Note ' + (currentNotes.length + 1),
        preview: '',
        date: 'Just now',
        favorite: false
    };
    currentNotes.unshift(newNote); // Add to top
    saveNotesToStorage();
    
    // Switch to All filter so user sees new note
    document.querySelector('[data-filter="all"]').click();
    
    // Smooth scroll to top
    document.getElementById('dashboardView').scrollTo({ top: 0, behavior: 'smooth' });
    
    // Auto-open previously created note for edit
    openEditModal(newNote);
});

// Login Mock
const loginBtn = document.getElementById('loginBtn');
const userStatus = document.querySelector('.user-status');

loginBtn.addEventListener('click', () => {
    if (loginBtn.innerText === 'Login to Sync') {
        loginBtn.innerText = 'Log Out';
        userNameDisplay.innerText = 'Admin User';
        settingsNameInput.value = 'Admin User'; // reflect in settings
        userStatus.innerText = 'Synced';
        userStatus.style.color = 'var(--sage-green)';
    } else {
        loginBtn.innerText = 'Login to Sync';
        userNameDisplay.innerText = 'Guest User';
        settingsNameInput.value = 'Guest User';
        userStatus.innerText = 'Not Logged In';
        userStatus.style.color = 'var(--text-muted)';
    }
});

// Login Overlay Logic
const loginOverlay = document.getElementById('loginOverlay');
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('emailInput');
const skipLoginBtn = document.getElementById('skipLoginBtn');

function hideLoginOverlay() {
    loginOverlay.classList.remove('active');
}

loginForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent page reload
    // Update sidebar UI with the logged-in email
    const email = emailInput.value;
    const nameFromEmail = email.split('@')[0];
    userNameDisplay.innerText = nameFromEmail;
    settingsNameInput.value = nameFromEmail;
    userStatus.innerText = 'Synced';
    userStatus.style.color = 'var(--sage-green)';
    loginBtn.innerText = 'Log Out';
    hideLoginOverlay();
});

skipLoginBtn.addEventListener('click', () => {
    hideLoginOverlay();
});

// Category Click Mock
document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', () => {
        const titleEl = card.querySelector('h3');
        if (titleEl && titleEl.innerText !== 'Add Category') {
            document.getElementById('navDashboard').click(); // Geri dön
            alert(titleEl.innerText + ' kategorisindeki notlarınız başarıyla listelendi (Ön İzleme Modu).');
        } else {
            alert('Yeni kategori ekleme modülü yakında eklenecektir!');
        }
    });
});

// Init
applyFilters();

/* --- Chatbot Logic --- */
const chatToggleBtn = document.getElementById('chatToggleBtn');
const chatWindow = document.getElementById('chatWindow');
const closeChatBtn = document.getElementById('closeChatBtn');
const chatInput = document.getElementById('chatInput');
const sendChatBtn = document.getElementById('sendChatBtn');
const chatMessages = document.getElementById('chatMessages');

chatToggleBtn.addEventListener('click', () => {
    chatWindow.classList.add('active');
    // Focus inner input
    setTimeout(() => chatInput.focus(), 100);
});

closeChatBtn.addEventListener('click', () => {
    chatWindow.classList.remove('active');
});

function appendMessage(text, sender, id = null) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message');
    msgDiv.classList.add(sender === 'bot' ? 'bot-message' : 'user-message');
    msgDiv.innerText = text;
    if (id) msgDiv.id = id;
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

sendChatBtn.addEventListener('click', handleChatSubmit);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleChatSubmit();
});

async function handleChatSubmit() {
    const text = chatInput.value.trim();
    if (!text) return;
    
    appendMessage(text, 'user');
    chatInput.value = '';
    
    // Add loading indicator
    const loadingId = 'loading-' + Date.now();
    appendMessage('...', 'bot', loadingId);
    
    // Fetch response (API or Mock)
    const response = await generateBotResponse(text);
    
    // Remove loading
    const loadingEl = document.getElementById(loadingId);
    if(loadingEl) loadingEl.remove();
    
    appendMessage(response, 'bot');
}

// Bot Personality Logic (Creative Muse via Secure Node.js Server or Local Mock)
async function generateBotResponse(input) {
    try {
        // Tarayıcı şifre göndermez. Sadece mesajı sizin güvenli sunucunuza iletir.
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: input })
        });
        
        if (!response.ok) {
            throw new Error('Sunucuda API Key eksik veya bağlantı hatası');
        }
        
        const data = await response.json();
        return data.reply;
        
    } catch (error) {
        console.warn('Backend yapay zekasına ulaşılamadı. Lokal yedeğe geçiliyor.', error);
        
        // Fallback to local logic
        const lowerInput = input.toLowerCase();
        if (lowerInput.includes('ilham') || lowerInput.includes('fikir') || lowerInput.includes('konu') || lowerInput.includes('ne yaz')) {
            const ideas = [
                'Neden bugün başından geçen en tuhaf ya da ilginç tesadüfü not etmiyorsun?',
                'Gelecekteki kendine bir mektup yazabilirsin. Bir yıl sonraki sen nerede, ne hissediyor?',
                'Tam şu anda "yapmam gerekenler" ve "yapmak istediklerim" diye iki liste yapmak seni çok rahatlatabilir!'
            ];
            return ideas[Math.floor(Math.random() * ideas.length)];
        }
        if (lowerInput.includes('merhaba') || lowerInput.includes('selam')) {
            return 'Selam! (Sunucuya henüz API Key eklemediğiniz için klasik lokal versiyon devrede!) Ne yazıyoruz?';
        }
        const fallbacks = [
            'Hmm, bu gayet düşünceli bir yaklaşım. Bence bunu hemen bir nota kaydetmeli ve daha detaylı düşünmelisin!',
            'Bana biraz daha bahsetmek ister misin?'
        ];
        return fallbacks[Math.floor(Math.random() * fallbacks.length)];
    }
}

// --- WEATHER WIDGET LOGIC ---
const weatherWidget = document.getElementById('weatherWidget');

function fetchWeather(latitude, longitude) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
    
    fetch(url)
        .then(res => res.json())
        .then(data => {
            if(data && data.current_weather) {
                const temp = Math.round(data.current_weather.temperature);
                const code = data.current_weather.weathercode;
                updateWeatherUI(temp, code);
            }
        })
        .catch(err => {
            console.error('Hava durumu çekilemedi:', err);
            weatherWidget.innerHTML = `<ion-icon name="cloud-offline-outline" style="color: var(--text-muted); font-size: 1.5rem;"></ion-icon> <span style="font-size: 0.8rem;">Dışarıda hava nasıl? :(</span>`;
        });
}

function updateWeatherUI(temp, code) {
    let iconName = 'cloud-outline';
    let iconColor = 'var(--sage-green)';

    // Weather Code mapping to Ionicons
    if (code === 0) {
        iconName = 'sunny-outline';
        iconColor = 'var(--saffron)';
    } else if (code >= 1 && code <= 3) {
        iconName = 'partly-sunny-outline';
        iconColor = 'var(--saffron)';
    } else if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) {
        iconName = 'rainy-outline';
        iconColor = '#74b9ff';
    } else if (code >= 71 && code <= 77) {
        iconName = 'snow-outline';
        iconColor = '#dfe6e9';
    } else if (code >= 95) {
        iconName = 'thunderstorm-outline';
        iconColor = '#636e72';
    }

    weatherWidget.innerHTML = `
        <ion-icon name="${iconName}" style="color: ${iconColor}; font-size: 1.5rem;"></ion-icon> 
        <span style="font-weight: 500;">${temp}°C</span>
    `;
}

function initWeather() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                fetchWeather(position.coords.latitude, position.coords.longitude);
            },
            (error) => {
                console.warn('Konum izni alınamadı, varsayılan şehir (İstanbul) kullanılıyor.', error);
                fetchWeather(41.0082, 28.9784);
            },
            { timeout: 5000 }
        );
    } else {
        fetchWeather(41.0082, 28.9784);
    }
}

// Start weather fetch
initWeather();
