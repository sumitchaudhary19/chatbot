document.addEventListener('DOMContentLoaded', () => {
    // --- Elements ---
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    const sidebar = document.getElementById('sidebar');
    const sidebarBackdrop = document.getElementById('sidebarBackdrop');
    const openSidebarBtn = document.getElementById('openSidebar');
    const closeSidebarBtn = document.getElementById('closeSidebar');
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');
    const chatContainer = document.getElementById('chatContainer');
    const chatHistoryList = document.getElementById('chatHistoryList');

    // --- Supabase Setup ---
    const SUPABASE_URL = 'https://oekybhjrmklerezrccst.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9la3liaGpybWtsZXJlenJjY3N0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2MTMwODIsImV4cCI6MjA5MzE4OTA4Mn0.za8ozJAFci62M6Y3upSrmrjtseQCvAJYswa1OStThfs';
    window.supabaseClient = null;
    if (window.supabase) {
        window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }

    // --- State ---
    let isWaitingForResponse = false;
    let chatHistory = [];

    // --- Persistence & Auth Bypass ---
    const savedProfile = localStorage.getItem('askmnit_profile');
    const skippedProfile = localStorage.getItem('askmnit_skipped');
    if (savedProfile || skippedProfile) {
        // Skip auth and setup completely
        const authView = document.getElementById('authView');
        if(authView) {
            authView.style.display = 'none';
            authView.classList.add('hidden');
        }
        const chatbotView = document.getElementById('chatbotView');
        if(chatbotView) chatbotView.classList.remove('hidden');
        const dottedSurface = document.getElementById('dottedSurface');
        if(dottedSurface) dottedSurface.classList.remove('hidden');
        
        // Update dashboard details if profile exists
        if (savedProfile) {
            try {
                const profile = JSON.parse(savedProfile);
                if (profile.name) {
                    const dashHeroName = document.getElementById('dashHeroName');
                    const dashSidebarName = document.getElementById('dashSidebarName');
                    if (dashHeroName) dashHeroName.textContent = profile.name;
                    if (dashSidebarName) dashSidebarName.textContent = profile.name;
                }
                if (profile.branch || profile.year) {
                    const dashSidebarBranch = document.getElementById('dashSidebarBranch');
                    if (dashSidebarBranch) {
                        const yearStr = profile.year && profile.year !== '2024-2028' ? profile.year.split('-')[0] : 'B.Tech';
                        const branchStr = profile.branch && profile.branch !== 'CSE, ME...' ? profile.branch : 'Student';
                        dashSidebarBranch.textContent = `${yearStr}, ${branchStr}`;
                    }
                }
            } catch(e) {}
        }
    }

    // --- Theme Management ---
    // Default to dark theme as it looks more premium/tech-forward
    if (localStorage.getItem('theme') === 'light') {
        html.classList.remove('dark');
    } else {
        html.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    }

    // --- Three.js Background Management ---
    let threeJSGeometry = null;
    
    function updateThreeJSTheme() {
        if (!threeJSGeometry) return;
        const isDark = html.classList.contains('dark');
        const colors = [];
        const AMOUNTX = 40;
        const AMOUNTY = 60;
        
        for (let ix = 0; ix < AMOUNTX; ix++) {
            for (let iy = 0; iy < AMOUNTY; iy++) {
                if (isDark) {
                    colors.push(200 / 255, 200 / 255, 200 / 255);
                } else {
                    colors.push(0, 0, 0);
                }
            }
        }
        threeJSGeometry.setAttribute('color', new window.THREE.Float32BufferAttribute(colors, 3));
        threeJSGeometry.attributes.color.needsUpdate = true;
    }

    themeToggle.addEventListener('click', () => {
        html.classList.toggle('dark');
        localStorage.setItem('theme', html.classList.contains('dark') ? 'dark' : 'light');
        updateThreeJSTheme();
    });

    // --- Sidebar Management (Desktop & Mobile) ---
    const sidebarContainer = document.getElementById('sidebarContainer');
    let isDesktopSidebarOpen = true;

    function toggleSidebar() {
        if (window.innerWidth >= 1024) {
            // Desktop logic
            isDesktopSidebarOpen = !isDesktopSidebarOpen;
            if (isDesktopSidebarOpen) {
                sidebarContainer.classList.replace('lg:w-0', 'lg:w-72');
                sidebar.classList.replace('lg:-translate-x-full', 'lg:translate-x-0');
            } else {
                sidebarContainer.classList.replace('lg:w-72', 'lg:w-0');
                sidebar.classList.replace('lg:translate-x-0', 'lg:-translate-x-full');
            }
        } else {
            // Mobile logic
            sidebar.classList.remove('-translate-x-full');
            sidebarBackdrop.classList.remove('hidden');
            setTimeout(() => sidebarBackdrop.classList.add('opacity-100'), 10);
        }
    }

    function closeSidebar() {
        if (window.innerWidth < 1024) {
            sidebar.classList.add('-translate-x-full');
            sidebarBackdrop.classList.remove('opacity-100');
            setTimeout(() => sidebarBackdrop.classList.add('hidden'), 300);
        }
    }

    openSidebarBtn.addEventListener('click', toggleSidebar);
    if(closeSidebarBtn) closeSidebarBtn.addEventListener('click', closeSidebar);
    sidebarBackdrop.addEventListener('click', closeSidebar);

    // --- Chat Management ---
    function addMessage(text, sender, isHtml = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `flex w-full ${sender === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`;
        
        const innerDiv = document.createElement('div');
        innerDiv.className = `max-w-[85%] lg:max-w-[75%] rounded-3xl px-6 py-4 backdrop-blur-md border ${
            sender === 'user' 
                ? 'bg-black/5 dark:bg-white/10 border-black/10 dark:border-white/10 text-gray-800 dark:text-white shadow-sm' 
                : 'bg-white/50 dark:bg-white/5 border-gray-200 dark:border-white/5 text-gray-800 dark:text-gray-200 shadow-sm markdown-body'
        }`;

        if (sender === 'bot') {
            const header = document.createElement('div');
            header.className = 'flex items-center gap-2 mb-2 pb-2 border-b border-gray-100 dark:border-gray-700/50';
            header.innerHTML = `
                <div class="w-6 h-6 rounded-md bg-gradient-to-br from-blue-600 to-mnit-cyan flex items-center justify-center">
                    <i class="fa-solid fa-robot text-white text-xs"></i>
                </div>
                <span class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">AskMNIT Assistant</span>
            `;
            innerDiv.appendChild(header);
            
            const contentDiv = document.createElement('div');
            if (isHtml) {
                contentDiv.innerHTML = text;
            } else {
                contentDiv.textContent = text;
            }
            innerDiv.appendChild(contentDiv);
        } else {
            innerDiv.textContent = text;
        }

        messageDiv.appendChild(innerDiv);
        chatContainer.appendChild(messageDiv);
        scrollToBottom();
    }

    function addTypingIndicator() {
        const indicatorId = 'typing-' + Date.now();
        const messageDiv = document.createElement('div');
        messageDiv.id = indicatorId;
        messageDiv.className = `flex w-full justify-start animate-fade-in`;
        
        messageDiv.innerHTML = `
            <div class="max-w-[85%] rounded-2xl px-5 py-4 bg-white dark:bg-gray-800 border border-gray-200/50 dark:border-gray-700/50 shadow-md rounded-bl-sm">
                <div class="flex items-center gap-2 mb-2 pb-2 border-b border-gray-100 dark:border-gray-700/50">
                    <div class="w-6 h-6 rounded-md bg-gradient-to-br from-blue-600 to-mnit-cyan flex items-center justify-center">
                        <i class="fa-solid fa-robot text-white text-xs"></i>
                    </div>
                    <span class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">AskMNIT Assistant</span>
                </div>
                <div class="flex items-center gap-1 h-6">
                    <div class="w-2 h-2 rounded-full bg-mnit-cyan typing-dot"></div>
                    <div class="w-2 h-2 rounded-full bg-mnit-cyan typing-dot"></div>
                    <div class="w-2 h-2 rounded-full bg-mnit-cyan typing-dot"></div>
                </div>
            </div>
        `;
        
        chatContainer.appendChild(messageDiv);
        scrollToBottom();
        return indicatorId;
    }

    function removeTypingIndicator(id) {
        const el = document.getElementById(id);
        if (el) el.remove();
    }

    function scrollToBottom() {
        chatContainer.scrollTo({
            top: chatContainer.scrollHeight,
            behavior: 'smooth'
        });
    }

    async function sendMessage() {
        const text = messageInput.value.trim();
        if (!text || isWaitingForResponse) return;

        // Reset input
        messageInput.value = '';
        sendButton.disabled = true;

        if (attachedFile) {
            attachedFile = null;
            fileInput.value = '';
            fileIndicator.classList.add('hidden');
        }

        // Add user message
        addMessage(text, 'user');
        chatHistory.push({ role: 'user', content: text });

        // Show typing indicator
        isWaitingForResponse = true;
        const typingId = addTypingIndicator();

        try {
            // Send to FastAPI backend
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: text, history: chatHistory.slice(0, -1) })
            });

            if (!response.ok) throw new Error('Network response was not ok');
            
            const data = await response.json();
            
            removeTypingIndicator(typingId);
            addMessage(data.reply, 'bot', true);
            chatHistory.push({ role: 'assistant', content: data.reply });

            // Update history sidebar
            updateChatHistoryList(text);

        } catch (error) {
            console.error('Error:', error);
            removeTypingIndicator(typingId);
            addMessage("I'm sorry, I'm having trouble connecting to the MNIT servers right now. Please try again later.", 'bot');
        } finally {
            isWaitingForResponse = false;
            sendButton.disabled = false;
        }
    }

    // --- Input Listener ---
    messageInput.addEventListener('input', function() {
        const hasText = this.value.trim() !== '';
        sendButton.disabled = !hasText;
    });

    // --- File Attachment ---
    const fileInput = document.getElementById('fileInput');
    const attachBtn = document.getElementById('attachBtn');
    const fileIndicator = document.getElementById('fileIndicator');
    const fileName = document.getElementById('fileName');
    const removeFileBtn = document.getElementById('removeFileBtn');
    let attachedFile = null;

    if(attachBtn && fileInput) {
        attachBtn.addEventListener('click', () => {
            fileInput.click();
        });

        fileInput.addEventListener('change', (e) => {
            if (e.target.files && e.target.files[0]) {
                attachedFile = e.target.files[0];
                fileName.textContent = attachedFile.name;
                fileIndicator.classList.remove('hidden');
            }
        });
    }

    if(removeFileBtn) {
        removeFileBtn.addEventListener('click', () => {
            attachedFile = null;
            fileInput.value = '';
            fileIndicator.classList.add('hidden');
        });
    }

    messageInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    sendButton.addEventListener('click', sendMessage);

    // --- Init ---
    function initWelcome() {
        chatContainer.innerHTML = '';
    }

    function updateChatHistoryList(text) {
        // Simple history updater
        const shortText = text.length > 25 ? text.substring(0, 25) + '...' : text;
        const li = document.createElement('li');
        li.innerHTML = `
            <a href="#" class="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors">
                <i class="fa-regular fa-message w-5 text-center text-gray-400"></i>
                <span class="truncate text-sm">${shortText}</span>
            </a>
        `;
        chatHistoryList.prepend(li);
    }

    // Export functions to global scope for HTML onclick handlers
    window.startNewChat = () => {
        chatHistory = [];
        initWelcome();
        if (window.innerWidth < 1024) closeSidebar();
    };

    window.showResource = (type) => {
        if (isWaitingForResponse) return;
        if (window.innerWidth < 1024) closeSidebar();
        
        let resourceHtml = '';
        let title = '';

        if (type === 'syllabus') {
            title = 'Show me the 1st Year Syllabus';
            resourceHtml = `
                <p>Here is the official 1st Year B.Tech Syllabus overview for MNIT Jaipur:</p>
                <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="border border-gray-200 dark:border-gray-700 rounded-xl p-4 bg-gray-50 dark:bg-gray-800/50 hover:border-mnit-cyan transition-colors cursor-pointer group">
                        <i class="fa-solid fa-file-pdf text-red-500 text-2xl mb-2 group-hover:scale-110 transition-transform"></i>
                        <h4 class="font-semibold text-sm">Group 1 Syllabus (Physics Cycle)</h4>
                        <p class="text-xs text-gray-500 mt-1">PDF Document • 1.2 MB</p>
                    </div>
                    <div class="border border-gray-200 dark:border-gray-700 rounded-xl p-4 bg-gray-50 dark:bg-gray-800/50 hover:border-mnit-cyan transition-colors cursor-pointer group">
                        <i class="fa-solid fa-file-pdf text-red-500 text-2xl mb-2 group-hover:scale-110 transition-transform"></i>
                        <h4 class="font-semibold text-sm">Group 2 Syllabus (Chemistry Cycle)</h4>
                        <p class="text-xs text-gray-500 mt-1">PDF Document • 1.4 MB</p>
                    </div>
                </div>
            `;
        } else if (type === 'manuals') {
            title = 'I need Lab Manuals';
            resourceHtml = `
                <p>I have pulled the latest lab manuals from the central repository. Click to download:</p>
                <div class="mt-4 flex flex-col gap-3">
                    <a href="#" class="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <div class="flex items-center gap-3">
                            <div class="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg text-blue-600 dark:text-blue-400"><i class="fa-solid fa-magnet"></i></div>
                            <div><p class="text-sm font-semibold">Physics Lab Manual</p><p class="text-xs text-gray-500">First Year • PDF</p></div>
                        </div>
                        <i class="fa-solid fa-download text-gray-400 hover:text-mnit-cyan"></i>
                    </a>
                    <a href="#" class="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <div class="flex items-center gap-3">
                            <div class="bg-orange-100 dark:bg-orange-900/30 p-2 rounded-lg text-orange-600 dark:text-orange-400"><i class="fa-solid fa-gear"></i></div>
                            <div><p class="text-sm font-semibold">Mechanical Workshop Manual</p><p class="text-xs text-gray-500">First Year • PDF</p></div>
                        </div>
                        <i class="fa-solid fa-download text-gray-400 hover:text-mnit-cyan"></i>
                    </a>
                </div>
            `;
        } else if (type === 'pyq') {
            title = 'Get Previous Year Papers';
            resourceHtml = `
                <p>Here are the Mid-Term and End-Term question papers for 1st Year B.Tech:</p>
                <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="border border-gray-200 dark:border-gray-700 rounded-xl p-4 bg-gray-50 dark:bg-gray-800/50 hover:border-mnit-cyan transition-colors cursor-pointer">
                        <h4 class="font-semibold text-sm mb-2"><i class="fa-regular fa-folder-open text-mnit-cyan mr-2"></i>2022-2023 Papers</h4>
                        <ul class="text-xs text-gray-500 space-y-1">
                            <li class="hover:text-mnit-cyan"><i class="fa-solid fa-angle-right mr-1"></i> Mid-Term (All Subjects)</li>
                            <li class="hover:text-mnit-cyan"><i class="fa-solid fa-angle-right mr-1"></i> End-Term (All Subjects)</li>
                        </ul>
                    </div>
                    <div class="border border-gray-200 dark:border-gray-700 rounded-xl p-4 bg-gray-50 dark:bg-gray-800/50 hover:border-mnit-cyan transition-colors cursor-pointer">
                        <h4 class="font-semibold text-sm mb-2"><i class="fa-regular fa-folder-open text-mnit-cyan mr-2"></i>2021-2022 Papers</h4>
                        <ul class="text-xs text-gray-500 space-y-1">
                            <li class="hover:text-mnit-cyan"><i class="fa-solid fa-angle-right mr-1"></i> Mid-Term (All Subjects)</li>
                            <li class="hover:text-mnit-cyan"><i class="fa-solid fa-angle-right mr-1"></i> End-Term (All Subjects)</li>
                        </ul>
                    </div>
                </div>
            `;
        } else if (type === 'events') {
            title = 'What are the upcoming events?';
            resourceHtml = `
                <p>Here are the latest updates from CACS and other societies:</p>
                <div class="mt-4 space-y-3">
                    <div class="p-3 border-l-4 border-purple-500 bg-purple-50 dark:bg-purple-900/20 rounded-r-lg">
                        <div class="flex justify-between items-start">
                            <h4 class="font-semibold text-sm">Sphinx Tech Fest</h4>
                            <span class="text-xs font-bold text-purple-600 dark:text-purple-400">NOV 10</span>
                        </div>
                        <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">Annual Tech Fest of MNIT Jaipur. Register your teams for Hackathons and RoboWars!</p>
                    </div>
                    <div class="p-3 border-l-4 border-pink-500 bg-pink-50 dark:bg-pink-900/20 rounded-r-lg">
                        <div class="flex justify-between items-start">
                            <h4 class="font-semibold text-sm">Blitzschlag Cultural Fest</h4>
                            <span class="text-xs font-bold text-pink-600 dark:text-pink-400">FEB 15</span>
                        </div>
                        <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">Get ready for three days of EDM nights, cultural events, and pronites.</p>
                    </div>
                </div>
            `;
        }

        addMessage(title, 'user');
        
        isWaitingForResponse = true;
        const typingId = addTypingIndicator();
        
        setTimeout(() => {
            removeTypingIndicator(typingId);
            addMessage(resourceHtml, 'bot', true);
            isWaitingForResponse = false;
        }, 800);
    };

    // --- Three.js Initialization ---
    function initThreeJSBackground() {
        const container = document.getElementById('dottedSurface');
        if (!container || !window.THREE) return;

        const SEPARATION = 150;
        const AMOUNTX = 40;
        const AMOUNTY = 60;

        const scene = new window.THREE.Scene();
        scene.fog = new window.THREE.Fog(0xffffff, 2000, 10000);

        const camera = new window.THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000);
        camera.position.set(0, 355, 1220);

        const renderer = new window.THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(scene.fog.color, 0); // Transparent

        container.appendChild(renderer.domElement);

        const positions = [];
        const colors = [];
        threeJSGeometry = new window.THREE.BufferGeometry();

        const isDark = html.classList.contains('dark');

        for (let ix = 0; ix < AMOUNTX; ix++) {
            for (let iy = 0; iy < AMOUNTY; iy++) {
                const x = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2;
                const y = 0; 
                const z = iy * SEPARATION - (AMOUNTY * SEPARATION) / 2;

                positions.push(x, y, z);
                if (isDark) {
                    colors.push(200 / 255, 200 / 255, 200 / 255);
                } else {
                    colors.push(0, 0, 0);
                }
            }
        }

        threeJSGeometry.setAttribute('position', new window.THREE.Float32BufferAttribute(positions, 3));
        threeJSGeometry.setAttribute('color', new window.THREE.Float32BufferAttribute(colors, 3));

        const material = new window.THREE.PointsMaterial({
            size: 8,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            sizeAttenuation: true,
        });

        const points = new window.THREE.Points(threeJSGeometry, material);
        scene.add(points);

        let count = 0;

        const animate = () => {
            requestAnimationFrame(animate);

            const positionAttribute = threeJSGeometry.attributes.position;
            const positions = positionAttribute.array;

            let i = 0;
            for (let ix = 0; ix < AMOUNTX; ix++) {
                for (let iy = 0; iy < AMOUNTY; iy++) {
                    const index = i * 3;
                    positions[index + 1] = Math.sin((ix + count) * 0.3) * 50 + Math.sin((iy + count) * 0.5) * 50;
                    i++;
                }
            }
            positionAttribute.needsUpdate = true;
            
            renderer.render(scene, camera);
            count += 0.1;
        };

        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener('resize', handleResize);
        animate();
    }

    // Run welcome on load
    initWelcome();
    sendButton.disabled = true;
    initThreeJSBackground();

    // --- Button Functionalities ---
    
    // Magic Tools
    const magicToolsBtn = document.getElementById('magicToolsBtn');
    if (magicToolsBtn) {
        magicToolsBtn.addEventListener('click', () => {
            const prompts = [
                "bhai kal physics ka practical hai kuch nahi padha",
                "can you share the 1st year timetable for VLTC?",
                "how do I prepare for mechanical workshop viva?",
                "where can I find previous year questions for end term?"
            ];
            const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
            messageInput.value = randomPrompt;
            messageInput.dispatchEvent(new Event('input')); // Trigger input event to enable send button
        });
    }

    // Sidebar Pin
    window.togglePin = function(btn, event) {
        event.preventDefault(); // Prevent link click
        event.stopPropagation();
        const icon = btn.querySelector('i');
        if (icon.classList.contains('text-mnit-cyan')) {
            icon.classList.remove('text-mnit-cyan');
            icon.classList.add('text-gray-400');
        } else {
            icon.classList.remove('text-gray-400');
            icon.classList.add('text-mnit-cyan');
        }
    };

    // Sidebar Delete
    window.deleteChat = function(btn, event) {
        event.preventDefault(); // Prevent link click
        event.stopPropagation();
        const liItem = btn.closest('li');
        if (liItem) {
            liItem.style.opacity = '0';
            liItem.style.transition = 'opacity 0.3s ease';
            setTimeout(() => {
                liItem.remove();
            }, 300);
        }
    };

    // View Switching Logic
    window.switchToDashboard = function() {
        const chatbotView = document.getElementById('chatbotView');
        const dashboardView = document.getElementById('dashboardView');
        const dottedSurface = document.getElementById('dottedSurface');
        
        if (chatbotView && dashboardView) {
            chatbotView.classList.add('hidden');
            dashboardView.classList.remove('hidden');
            if(dottedSurface) dottedSurface.classList.add('hidden'); // Hide 3D background for dashboard
        }
    };

    window.switchToChatbot = function() {
        const chatbotView = document.getElementById('chatbotView');
        const dashboardView = document.getElementById('dashboardView');
        const dottedSurface = document.getElementById('dottedSurface');
        
        if (chatbotView && dashboardView) {
            dashboardView.classList.add('hidden');
            chatbotView.classList.remove('hidden');
            if(dottedSurface) dottedSurface.classList.remove('hidden'); // Show 3D background for chatbot
        }
    };

    // --- Auth Logic ---
    window.goToAuthPassword = function() {
        const email = document.getElementById('authEmailInput').value;
        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            const wrap = document.getElementById('authEmailInput').parentElement.parentElement;
            wrap.style.transform = "translateX(5px)";
            setTimeout(() => wrap.style.transform = "translateX(-5px)", 100);
            setTimeout(() => wrap.style.transform = "translateX(5px)", 200);
            setTimeout(() => wrap.style.transform = "translateX(0)", 300);
            return;
        }
        
        const step1 = document.getElementById('authStepEmail');
        const step2 = document.getElementById('authStepPassword');
        
        step1.classList.add('opacity-0');
        setTimeout(() => {
            step1.classList.add('hidden');
            step2.classList.remove('hidden');
            void step2.offsetWidth;
            step2.classList.remove('opacity-0');
            step2.classList.add('opacity-100');
            document.getElementById('authPassInput').focus();
        }, 300);
    };

    window.goBackToEmail = function() {
        const step1 = document.getElementById('authStepEmail');
        const step2 = document.getElementById('authStepPassword');
        
        step2.classList.remove('opacity-100');
        step2.classList.add('opacity-0');
        setTimeout(() => {
            step2.classList.add('hidden');
            step1.classList.remove('hidden');
            void step1.offsetWidth;
            step1.classList.remove('opacity-0');
            step1.classList.add('opacity-100');
        }, 300);
    };

    window.submitAuth = function() {
        const pass = document.getElementById('authPassInput').value;
        if (pass.length < 6) {
            const wrap = document.getElementById('authPassInput').parentElement.parentElement;
            wrap.style.transform = "translateX(5px)";
            setTimeout(() => wrap.style.transform = "translateX(-5px)", 100);
            setTimeout(() => wrap.style.transform = "translateX(5px)", 200);
            setTimeout(() => wrap.style.transform = "translateX(0)", 300);
            return;
        }

        const modal = document.getElementById('authModal');
        const modalBox = document.getElementById('authModalBox');
        const modalText = document.getElementById('authModalText');
        
        modal.classList.remove('hidden');
        void modal.offsetWidth;
        modal.classList.remove('opacity-0');
        modal.classList.add('opacity-100');
        modalBox.classList.remove('scale-90');
        modalBox.classList.add('scale-100');

        const steps = ["Onboarding you...", "Finalizing...", "Welcome Aboard!"];
        let stepIndex = 0;
        
        const interval = setInterval(() => {
            if (stepIndex < steps.length) {
                modalText.innerText = steps[stepIndex];
                
                if (stepIndex === steps.length - 1) {
                    // Success step
                    clearInterval(interval);
                    document.querySelector('#authModalBox i').className = "fa-solid fa-check-circle text-5xl text-green-500";
                    fireConfetti();
                    
                    // After success, transition to app
                    setTimeout(() => {
                        const authView = document.getElementById('authView');
                        authView.style.opacity = '0';
                        
                        setTimeout(() => {
                            authView.classList.add('hidden');
                            // Show Profile Setup
                            const profileView = document.getElementById('profileSetupView');
                            profileView.classList.remove('hidden');
                            void profileView.offsetWidth;
                            profileView.classList.remove('opacity-0');
                            profileView.classList.add('opacity-100');
                            
                            // Animate modal pop-in
                            const profileModal = document.getElementById('profileSetupModal');
                            if(profileModal) {
                                profileModal.classList.remove('scale-95', 'opacity-0');
                                profileModal.classList.add('scale-100', 'opacity-100');
                            }
                        }, 500);
                    }, 2000);
                }
                stepIndex++;
            }
        }, 1200);
    };

    function fireConfetti() {
        if (typeof confetti === 'function') {
            const duration = 2.5 * 1000;
            const animationEnd = Date.now() + duration;
            const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

            function randomInRange(min, max) {
                return Math.random() * (max - min) + min;
            }

            const interval = setInterval(function() {
                const timeLeft = animationEnd - Date.now();

                if (timeLeft <= 0) {
                    return clearInterval(interval);
                }

                const particleCount = 50 * (timeLeft / duration);
                confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
                confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
            }, 250);
        }
    }

    // --- Profile Setup Logic ---
    window.toggleAdditionalDetails = function() {
        const panel = document.getElementById('additionalDetailsPanel');
        const icon = document.getElementById('additionalDetailsIcon');
        if (panel.classList.contains('hidden')) {
            panel.classList.remove('hidden');
            icon.classList.remove('fa-chevron-down');
            icon.classList.add('fa-chevron-up');
        } else {
            panel.classList.add('hidden');
            icon.classList.remove('fa-chevron-up');
            icon.classList.add('fa-chevron-down');
        }
    };

    window.completeProfileSetup = function() {
        // Collect and save data
        const profileData = {
            email: document.getElementById('authEmailInput')?.value.trim() || '',
            name: document.getElementById('profileName')?.value.trim() || 'Sumit',
            year: document.getElementById('profileYear')?.value,
            semester: document.getElementById('profileSem')?.value,
            branch: document.getElementById('profileBranch')?.value,
            hostel: document.getElementById('profileHostel')?.value,
            interests: document.getElementById('profileInterests')?.value.trim()
        };
        
        // Save to Supabase (student_profiles table)
        if (window.supabaseClient) {
            window.supabaseClient.from('student_profiles').insert([
                {
                    email: profileData.email,
                    name: profileData.name,
                    year: profileData.year,
                    semester: profileData.semester,
                    branch: profileData.branch,
                    hostel: profileData.hostel,
                    interests: profileData.interests
                }
            ]).then(res => {
                console.log('Saved to Supabase:', res);
            }).catch(err => {
                console.error('Supabase save error:', err);
            });
        }

        localStorage.setItem('askmnit_profile', JSON.stringify(profileData));

        // Immediately apply to Dashboard UI
        const dashHeroName = document.getElementById('dashHeroName');
        const dashSidebarName = document.getElementById('dashSidebarName');
        if (dashHeroName) dashHeroName.textContent = profileData.name;
        if (dashSidebarName) dashSidebarName.textContent = profileData.name;
        
        const dashSidebarBranch = document.getElementById('dashSidebarBranch');
        if (dashSidebarBranch) {
            const yearStr = profileData.year && profileData.year !== '2024-2028' ? profileData.year.split('-')[0] : 'B.Tech';
            const branchStr = profileData.branch && profileData.branch !== 'CSE, ME...' ? profileData.branch : 'Student';
            dashSidebarBranch.textContent = `${yearStr}, ${branchStr}`;
        }

        transitionToChatbot();
    };

    window.skipProfileSetup = function() {
        localStorage.setItem('askmnit_skipped', 'true');
        transitionToChatbot();
    };

    function transitionToChatbot() {
        const profileView = document.getElementById('profileSetupView');
        const profileModal = document.getElementById('profileSetupModal');
        
        if(profileModal) {
            profileModal.classList.remove('scale-100', 'opacity-100');
            profileModal.classList.add('scale-95', 'opacity-0');
        }
        profileView.classList.remove('opacity-100');
        profileView.classList.add('opacity-0');
        
        setTimeout(() => {
            profileView.classList.add('hidden');
            
            // Show chatbot
            const chatbotView = document.getElementById('chatbotView');
            chatbotView.classList.remove('hidden');
            chatbotView.classList.add('opacity-0', 'transition-opacity', 'duration-1000');
            void chatbotView.offsetWidth;
            chatbotView.classList.remove('opacity-0');
            chatbotView.classList.add('opacity-100');
            
            const dottedSurface = document.getElementById('dottedSurface');
            if(dottedSurface) dottedSurface.classList.remove('hidden');
        }, 500);
    }

    // --- Dashboard Tabs & Settings ---
    window.switchDashboardTab = function(tabName) {
        const homeNav = document.getElementById('navHome');
        const settingsNav = document.getElementById('navSettings');
        const homeContent = document.getElementById('dashboardHomeContent');
        const settingsContent = document.getElementById('dashboardSettingsContent');
        
        if(!homeNav || !settingsNav || !homeContent || !settingsContent) return;

        // Reset styles
        [homeNav, settingsNav].forEach(nav => {
            nav.classList.remove('bg-gradient-to-r', 'from-[#6633ee]/20', 'to-transparent', 'border-[#6633ee]/30', 'text-[#a855f7]');
            nav.classList.add('hover:bg-white/5', 'text-gray-400', 'hover:text-white', 'border-transparent');
            
            const icon = nav.querySelector('.nav-icon');
            if(icon) {
                icon.classList.remove('text-[#a855f7]');
                icon.classList.add('group-hover:text-white');
            }
        });

        // Hide all contents with fade out
        [homeContent, settingsContent].forEach(content => {
            content.classList.remove('opacity-100');
            content.classList.add('opacity-0');
        });

        // Wait for fade out, then swap visibility and fade in target
        setTimeout(() => {
            [homeContent, settingsContent].forEach(content => content.classList.add('hidden'));

            if (tabName === 'home') {
                homeNav.classList.add('bg-gradient-to-r', 'from-[#6633ee]/20', 'to-transparent', 'border-[#6633ee]/30', 'text-[#a855f7]');
                homeNav.classList.remove('hover:bg-white/5', 'text-gray-400', 'hover:text-white', 'border-transparent');
                const icon = homeNav.querySelector('.nav-icon');
                if(icon) {
                    icon.classList.add('text-[#a855f7]');
                    icon.classList.remove('group-hover:text-white');
                }
                
                homeContent.classList.remove('hidden');
                setTimeout(() => {
                    homeContent.classList.remove('opacity-0');
                    homeContent.classList.add('opacity-100');
                }, 50);
            } else if (tabName === 'settings') {
                settingsNav.classList.add('bg-gradient-to-r', 'from-[#6633ee]/20', 'to-transparent', 'border-[#6633ee]/30', 'text-[#a855f7]');
                settingsNav.classList.remove('hover:bg-white/5', 'text-gray-400', 'hover:text-white', 'border-transparent');
                const icon = settingsNav.querySelector('.nav-icon');
                if(icon) {
                    icon.classList.add('text-[#a855f7]');
                    icon.classList.remove('group-hover:text-white');
                }

                settingsContent.classList.remove('hidden');
                setTimeout(() => {
                    settingsContent.classList.remove('opacity-0');
                    settingsContent.classList.add('opacity-100');
                }, 50);
            }
        }, 300);
    };

    window.saveExtraProfileDetails = function(silent = false) {
        // Collect data
        const extraData = {
            program: document.getElementById('profileProgram')?.value,
            department: document.getElementById('profileDepartment')?.value,
            academic_session: document.getElementById('profileAcademicSession')?.value,
            criteria: document.getElementById('profileCriteria')?.value,
            wef: document.getElementById('profileWef')?.value
        };

        // Fetch existing profile to merge and to get email for Supabase Update constraint
        let existingProfile = {};
        try {
            existingProfile = JSON.parse(localStorage.getItem('askmnit_profile') || '{}');
        } catch(e) {}

        const mergedProfile = { ...existingProfile, ...extraData };
        localStorage.setItem('askmnit_profile', JSON.stringify(mergedProfile));

        // Update in Supabase
        if (window.supabaseClient && existingProfile.email) {
            window.supabaseClient.from('student_profiles')
                .update({
                    program: extraData.program,
                    department: extraData.department,
                    academic_session: extraData.academic_session,
                    criteria: extraData.criteria,
                    wef: extraData.wef
                })
                .eq('email', existingProfile.email)
                .then(res => {
                    console.log('Updated Extra Profile details in Supabase:', res);
                    if(!silent) alert("Profile updated successfully!");
                })
                .catch(err => {
                    console.error('Supabase update error:', err);
                    if(!silent) alert("Profile updated successfully locally.");
                });
        } else {
            if(!silent) alert("Profile updated successfully locally.");
        }
    };

    window.checkProfileCompletion = function() {
        const program = document.getElementById('profileProgram')?.value;
        const dept = document.getElementById('profileDepartment')?.value;
        const session = document.getElementById('profileAcademicSession')?.value;
        const criteria = document.getElementById('profileCriteria')?.value;
        const wef = document.getElementById('profileWef')?.value;

        const btn = document.getElementById('getScheduleBtn');
        const reqText = document.getElementById('scheduleRequirementText');

        // Check if all fields are selected (not empty)
        if (program && dept && session && criteria && wef) {
            if(btn) btn.disabled = false;
            if(reqText) reqText.classList.add('hidden');
        } else {
            if(btn) btn.disabled = true;
            if(reqText) reqText.classList.remove('hidden');
        }
    };

    window.getSchedule = function() {
        // First, automatically save the extra details to Supabase (silently, without extra alerts)
        window.saveExtraProfileDetails(true);

        const btn = document.getElementById('getScheduleBtn');
        const spinner = document.getElementById('scheduleSpinner');
        const textSpan = btn.querySelector('span');
        const originalText = textSpan.innerText;
        
        // UI Loading state
        btn.classList.add('opacity-80', 'pointer-events-none');
        spinner.classList.remove('hidden');
        textSpan.innerText = "Fetching from mnit.ac.in/TimeTable...";

        // Simulate network delay for fetching the schedule
        setTimeout(() => {
            // Reset UI
            btn.classList.remove('opacity-80', 'pointer-events-none');
            spinner.classList.add('hidden');
            textSpan.innerText = originalText;
            
            // In a real scenario, we would parse the scraped timetable here
            const fetchedSchedule = [
                { title: "Data Structures", room: "VLTC L-102", time: "09:00 AM", color: "bg-green-400", shadow: "shadow-[0_0_8px_rgba(74,222,128,0.6)]" },
                { title: "Algorithms", room: "VLTC L-103", time: "10:00 AM", color: "bg-blue-400", shadow: "shadow-[0_0_8px_rgba(96,165,250,0.6)]" },
                { title: "OS Lab", room: "Lab 3", time: "11:00 AM", color: "bg-gray-500", shadow: "" },
                { title: "Computer Networks", room: "VLTC L-201", time: "02:00 PM", color: "bg-purple-400", shadow: "shadow-[0_0_8px_rgba(168,85,247,0.6)]" }
            ];
            
            // Update the Dashboard card to show the schedule
            const emptyState = document.getElementById('scheduleEmptyState');
            const filledState = document.getElementById('scheduleFilledState');
            if (emptyState && filledState) {
                // Generate dynamic HTML from fetched schedule
                filledState.innerHTML = fetchedSchedule.map(s => `
                    <div class="bg-black/40 border border-white/5 rounded-full px-3 py-2 flex items-center justify-between hover:bg-white/5 transition-colors group/capsule shrink-0">
                        <div class="flex items-center gap-2">
                            <div class="w-2 h-2 rounded-full ${s.color} ${s.shadow}"></div>
                            <div>
                                <p class="text-xs font-bold text-white group-hover/capsule:text-[#a855f7] transition-colors leading-tight truncate max-w-[120px]">${s.title}</p>
                                <p class="text-[10px] text-gray-500 leading-tight">${s.room}</p>
                            </div>
                        </div>
                        <span class="text-[10px] font-medium text-gray-400 bg-white/5 px-2 py-1 rounded-md whitespace-nowrap">${s.time}</span>
                    </div>
                `).join('');

                emptyState.classList.add('hidden');
                filledState.classList.remove('hidden');
                filledState.classList.add('flex');
            }

            alert("Schedule successfully fetched and synced to your AskMNIT profile!");

            // Redirect automatically to Dashboard Home
            window.switchDashboardTab('home');
        }, 3000);
    };
});
