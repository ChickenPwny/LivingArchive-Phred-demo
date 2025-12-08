// Demo state
const demoState = {
    emailsSent: 50,
    emailsOpened: 0,
    linksClicked: 0,
    formsSubmitted: 0,
    startTime: Date.now(),
    chartData: {
        times: [],
        opens: [],
        clicks: [],
        submits: []
    }
};

// Initialize demo
document.addEventListener('DOMContentLoaded', function() {
    initializeDemo();
    setupEventListeners();
    startAutoSimulation();
    initializeChart();
    startAnimationLoop();
});

function initializeDemo() {
    updateStats();
    addActivity('Campaign initialized', '📧');
    addActivity('Sending emails to 50 targets...', '📤');
    
    // Simulate initial email sends
    setTimeout(() => {
        demoState.emailsSent = 50;
        updateStats();
        addActivity('All emails sent successfully', '✅');
    }, 1000);
}

function setupEventListeners() {
    document.getElementById('btn-open-email').addEventListener('click', function() {
        simulateEmailOpen();
        triggerAnimation();
    });
    document.getElementById('btn-click-link').addEventListener('click', function() {
        simulateLinkClick();
        triggerAnimation();
    });
    document.getElementById('btn-submit-form').addEventListener('click', function() {
        simulateFormSubmit();
        triggerAnimation();
    });
    document.getElementById('btn-reset').addEventListener('click', resetDemo);
    
    // Prevent default link behavior
    document.getElementById('demo-link').addEventListener('click', function(e) {
        e.preventDefault();
        simulateLinkClick();
        triggerAnimation();
    });
}

function simulateEmailOpen() {
    if (demoState.emailsOpened < demoState.emailsSent) {
        demoState.emailsOpened++;
        updateStats();
        addActivity(`Email opened by user #${demoState.emailsOpened}`, '👁️');
        updateChart();
        
        // Visual feedback
        const btn = document.getElementById('btn-open-email');
        const originalBg = btn.style.background;
        btn.style.background = '#27ae60';
        setTimeout(() => {
            btn.style.background = originalBg || '#3498db';
        }, 500);
    } else {
        addActivity('All emails have been opened', 'ℹ️');
    }
}

function simulateLinkClick() {
    if (demoState.linksClicked < demoState.emailsOpened) {
        demoState.linksClicked++;
        updateStats();
        addActivity(`Link clicked - User redirected to landing page`, '🔗');
        updateChart();
        
        // Visual feedback
        const btn = document.getElementById('btn-click-link');
        const originalBg = btn.style.background;
        btn.style.background = '#f39c12';
        setTimeout(() => {
            btn.style.background = originalBg || '#3498db';
        }, 500);
    } else {
        addActivity('No more emails to click (open emails first)', 'ℹ️');
    }
}

function simulateFormSubmit() {
    if (demoState.formsSubmitted < demoState.linksClicked) {
        demoState.formsSubmitted++;
        updateStats();
        addActivity(`⚠️ Form submitted - Credential entry detected`, '🚨');
        updateChart();
        
        // Visual feedback
        const btn = document.getElementById('btn-submit-form');
        const originalBg = btn.style.background;
        btn.style.background = '#e74c3c';
        setTimeout(() => {
            btn.style.background = originalBg || '#3498db';
        }, 500);
    } else {
        addActivity('No more forms to submit (click links first)', 'ℹ️');
    }
}

function resetDemo() {
    demoState.emailsSent = 50;
    demoState.emailsOpened = 0;
    demoState.linksClicked = 0;
    demoState.formsSubmitted = 0;
    demoState.chartData = {
        times: [],
        opens: [],
        clicks: [],
        submits: []
    };
    
    animationState.eventCount = 0;
    animationState.isActive = false;
    
    // Reset animation elements
    document.getElementById('phishing-page').classList.remove('active');
    document.getElementById('connection-line').classList.remove('active');
    document.getElementById('server').classList.remove('active');
    document.getElementById('event-badge').classList.remove('active');
    document.getElementById('event-badge').textContent = '0 Events';
    document.getElementById('event-log').classList.remove('active');
    ['data-packet-1', 'data-packet-2', 'data-packet-3'].forEach(id => {
        document.getElementById(id).classList.remove('active');
    });
    
    updateStats();
    document.getElementById('activity-feed').innerHTML = '';
    initializeDemo();
    initializeChart();
    
    addActivity('Demo reset - Ready for new interactions', '🔄');
}

function updateStats() {
    document.getElementById('emails-sent').textContent = demoState.emailsSent;
    document.getElementById('emails-opened').textContent = demoState.emailsOpened;
    document.getElementById('links-clicked').textContent = demoState.linksClicked;
    document.getElementById('forms-submitted').textContent = demoState.formsSubmitted;
    
    const openRate = demoState.emailsSent > 0 ? ((demoState.emailsOpened / demoState.emailsSent) * 100).toFixed(1) : 0;
    const clickRate = demoState.emailsSent > 0 ? ((demoState.linksClicked / demoState.emailsSent) * 100).toFixed(1) : 0;
    const submitRate = demoState.emailsSent > 0 ? ((demoState.formsSubmitted / demoState.emailsSent) * 100).toFixed(1) : 0;
    
    document.getElementById('open-rate').textContent = `${openRate}%`;
    document.getElementById('click-rate').textContent = `${clickRate}%`;
    document.getElementById('submit-rate').textContent = `${submitRate}%`;
    
    // Animate number changes
    animateValue('emails-opened', demoState.emailsOpened);
    animateValue('links-clicked', demoState.linksClicked);
    animateValue('forms-submitted', demoState.formsSubmitted);
}

function animateValue(elementId, targetValue) {
    const element = document.getElementById(elementId);
    const currentValue = parseInt(element.textContent) || 0;
    
    if (currentValue === targetValue) return;
    
    const increment = targetValue > currentValue ? 1 : -1;
    const duration = 500;
    const steps = Math.abs(targetValue - currentValue);
    const stepDuration = Math.max(10, duration / steps);
    
    let current = currentValue;
    const timer = setInterval(() => {
        current += increment;
        element.textContent = current;
        if (current === targetValue) {
            clearInterval(timer);
        }
    }, stepDuration);
}

function addActivity(text, icon = '📊') {
    const feed = document.getElementById('activity-feed');
    const time = new Date().toLocaleTimeString();
    const item = document.createElement('div');
    item.className = 'activity-item';
    item.innerHTML = `
        <span class="activity-time">${time}</span>
        <span class="activity-icon">${icon}</span>
        <span class="activity-text">${text}</span>
    `;
    feed.insertBefore(item, feed.firstChild);
    
    // Keep only last 20 items
    while (feed.children.length > 20) {
        feed.removeChild(feed.lastChild);
    }
}

function startAutoSimulation() {
    // Auto-simulate some interactions every few seconds
    setInterval(() => {
        if (Math.random() > 0.7 && demoState.emailsOpened < demoState.emailsSent) {
            simulateEmailOpen();
        }
        if (Math.random() > 0.8 && demoState.linksClicked < demoState.emailsOpened) {
            simulateLinkClick();
        }
        if (Math.random() > 0.9 && demoState.formsSubmitted < demoState.linksClicked) {
            simulateFormSubmit();
        }
    }, 3000);
}

let chart = null;

function initializeChart() {
    const canvas = document.getElementById('metrics-chart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Adjust canvas size for high DPI displays
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    
    chart = {
        canvas: canvas,
        ctx: ctx,
        width: rect.width,
        height: rect.height
    };
    
    drawChart();
}

function updateChart() {
    const now = Date.now();
    const timeLabel = new Date(now).toLocaleTimeString();
    
    demoState.chartData.times.push(timeLabel);
    demoState.chartData.opens.push(demoState.emailsOpened);
    demoState.chartData.clicks.push(demoState.linksClicked);
    demoState.chartData.submits.push(demoState.formsSubmitted);
    
    // Keep only last 20 data points
    if (demoState.chartData.times.length > 20) {
        demoState.chartData.times.shift();
        demoState.chartData.opens.shift();
        demoState.chartData.clicks.shift();
        demoState.chartData.submits.shift();
    }
    
    drawChart();
}

function drawChart() {
    if (!chart || demoState.chartData.times.length === 0) return;
    
    const { ctx, width, height } = chart;
    const data = demoState.chartData;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    const maxValue = Math.max(
        ...data.opens,
        ...data.clicks,
        ...data.submits,
        50,
        1
    );
    
    // Draw axes
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();
    
    // Draw grid lines
    ctx.strokeStyle = '#f0f0f0';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
        const y = padding + (i / 5) * chartHeight;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
    }
    
    // Draw lines
    const drawLine = (values, color) => {
        if (values.length === 0) return;
        
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        values.forEach((value, index) => {
            const x = padding + (index / Math.max(values.length - 1, 1)) * chartWidth;
            const y = height - padding - (value / maxValue) * chartHeight;
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        
        ctx.stroke();
    };
    
    drawLine(data.opens, '#3498db');
    drawLine(data.clicks, '#f39c12');
    drawLine(data.submits, '#e74c3c');
    
    // Draw labels
    ctx.fillStyle = '#333';
    ctx.font = '12px sans-serif';
    ctx.fillText('Opens', width - 100, 20);
    ctx.fillText('Clicks', width - 100, 35);
    ctx.fillText('Submits', width - 100, 50);
    
    // Color indicators
    ctx.fillStyle = '#3498db';
    ctx.fillRect(width - 120, 15, 10, 10);
    ctx.fillStyle = '#f39c12';
    ctx.fillRect(width - 120, 30, 10, 10);
    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(width - 120, 45, 10, 10);
}

// Animation functions
let animationState = {
    isActive: false,
    eventCount: 0,
    currentCycle: 0
};

function startAnimationLoop() {
    // Start the animation cycle every 4 seconds
    setInterval(() => {
        if (!animationState.isActive) {
            triggerAnimation();
        }
    }, 4000);
    
    // Initial trigger
    setTimeout(() => triggerAnimation(), 1000);
}

function triggerAnimation() {
    animationState.isActive = true;
    const phishingPage = document.getElementById('phishing-page');
    const connectionLine = document.getElementById('connection-line');
    const server = document.getElementById('server');
    const eventBadge = document.getElementById('event-badge');
    const eventLog = document.getElementById('event-log');
    
    // Step 1: User clicks on phishing page
    phishingPage.classList.add('active');
    setTimeout(() => {
        phishingPage.classList.remove('active');
    }, 500);
    
    // Step 2: Data packets flow
    setTimeout(() => {
        connectionLine.classList.add('active');
        const packets = ['data-packet-1', 'data-packet-2', 'data-packet-3'];
        packets.forEach((id, index) => {
            setTimeout(() => {
                const packet = document.getElementById(id);
                packet.classList.add('active');
                setTimeout(() => {
                    packet.classList.remove('active');
                }, 2000);
            }, index * 300);
        });
    }, 600);
    
    // Step 3: Server receives
    setTimeout(() => {
        server.classList.add('active');
        eventBadge.classList.add('active');
        animationState.eventCount++;
        eventBadge.textContent = `${animationState.eventCount} Events`;
        
        setTimeout(() => {
            server.classList.remove('active');
            eventBadge.classList.remove('active');
        }, 500);
    }, 1500);
    
    // Step 4: Show event log
    setTimeout(() => {
        showEventLog();
    }, 2000);
    
    // Step 5: Reset for next cycle
    setTimeout(() => {
        connectionLine.classList.remove('active');
        animationState.isActive = false;
    }, 3500);
}

function showEventLog() {
    const eventLog = document.getElementById('event-log');
    const events = [
        'page_view',
        'link_clicked',
        'keystroke_logged',
        'form_submit'
    ];
    
    eventLog.innerHTML = '';
    eventLog.classList.add('active');
    
    events.forEach((event, index) => {
        setTimeout(() => {
            const eventItem = document.createElement('div');
            eventItem.className = 'event-item show';
            eventItem.textContent = `✓ ${event}`;
            eventLog.appendChild(eventItem);
        }, index * 200);
    });
    
    setTimeout(() => {
        eventLog.classList.remove('active');
    }, 2000);
}

// Animation functions are defined above

